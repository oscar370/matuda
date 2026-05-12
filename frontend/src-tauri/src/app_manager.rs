use crate::{
    errors::AppManagerError,
    models::{AllUpdates, AppVersions, ConfigTomlDto, GitHubRelease, UpdateMetadata},
};
use flate2::read::GzDecoder;
use ini::Ini;
use shared::ConfigToml;
use std::{
    env, fs,
    io::Cursor,
    path::{Path, PathBuf},
};
use tar::Archive;

pub struct AppManager {
    config_dir: PathBuf,
    daemon_path: PathBuf,
    matugen_path: PathBuf,
    service_dir: PathBuf,
    service_path: PathBuf,
    service_name: String,
    config_path: PathBuf,
    client: reqwest::Client,
}

impl AppManager {
    pub fn new() -> Result<Self, AppManagerError> {
        let base_dir = env::var("XDG_CONFIG_HOME")
            .map(PathBuf::from)
            .or_else(|_| env::var("HOME").map(|h| PathBuf::from(h).join(".config")))?;

        let config_dir = base_dir.join("matuda");
        let service_dir = base_dir.join("systemd/user");
        let service_name = "matuda-daemon.service".to_string();

        let client = reqwest::Client::builder()
            .user_agent("matuda")
            .build()
            .map_err(|e| AppManagerError::Network(e.to_string()))?;

        Ok(Self {
            daemon_path: config_dir.join("daemon"),
            matugen_path: config_dir.join("matugen"),
            config_path: config_dir.join("config.toml"),
            service_path: service_dir.join(&service_name),
            config_dir,
            service_dir,
            service_name,
            client,
        })
    }

    pub fn config_dir(&self) -> &Path {
        &self.config_dir
    }
    pub fn daemon_path(&self) -> &Path {
        &self.daemon_path
    }
    pub fn matugen_path(&self) -> &Path {
        &self.matugen_path
    }
    pub fn service_path(&self) -> &Path {
        &self.service_path
    }
    pub fn service_name(&self) -> &str {
        &self.service_name
    }

    pub fn create_dirs(&self) -> Result<(), AppManagerError> {
        fs::create_dir_all(&self.config_dir)?;
        fs::create_dir_all(&self.service_dir)?;
        Ok(())
    }

    pub async fn setup_binaries(&self) -> Result<AppVersions, AppManagerError> {
        if cfg!(any(debug_assertions, feature = "dev")) {
            println!("[INFO] Copying local binaries");

            let local_daemon = std::env::current_dir().unwrap().join("../../dist/daemon");
            let local_matugen = std::env::current_dir().unwrap().join("../../dist/matugen");

            std::fs::copy(&local_daemon, &self.daemon_path)?;
            Self::set_executable(&self.daemon_path)?;

            std::fs::copy(&local_matugen, &self.matugen_path)?;
            Self::set_executable(&self.matugen_path)?;

            Ok(AppVersions {
                daemon: "local-dev".to_string(),
                matugen: "local-dev".to_string(),
            })
        } else {
            let (daemon_version, daemon_url) = self.check_daemon_update().await?;
            if !self.daemon_path.exists() {
                self.install_daemon(&daemon_url).await?;
            }

            let (matugen_version, matugen_url) = self.check_matugen_update().await?;
            if !self.matugen_path.exists() {
                self.install_matugen(&matugen_url).await?;
            }

            Ok(AppVersions {
                daemon: daemon_version,
                matugen: matugen_version,
            })
        }
    }

    fn set_executable(dest_path: &std::path::Path) -> Result<(), AppManagerError> {
        use std::os::unix::fs::PermissionsExt;
        let mut perms = std::fs::metadata(dest_path)?.permissions();
        perms.set_mode(0o755);
        std::fs::set_permissions(dest_path, perms)?;
        Ok(())
    }

    pub fn setup_service(&self) -> Result<(), AppManagerError> {
        let mut config = Ini::new();
        let exec_config = format!(
            "{} --config-path {} --matugen-path {}",
            self.daemon_path.display(),
            self.config_path.display(),
            self.matugen_path.display()
        );

        config
            .with_section(Some("Unit"))
            .set("Description", "Daemon for Matugen");
        config
            .with_section(Some("Service"))
            .set("ExecStart", exec_config)
            .set("Restart", "on-failure");
        config
            .with_section(Some("Install"))
            .set("WantedBy", "default.target");

        config.write_to_file(&self.service_path)?;

        self.systemctl_run(&["daemon-reload"])?;
        self.systemctl_run(&["enable", "--now", &self.service_name])?;

        Ok(())
    }

    pub fn write_config(&self, config: &ConfigToml) -> Result<(), AppManagerError> {
        let mut content = toml::to_string(config)?;
        content.push_str("\n[config]\nversion_check = false\n");
        fs::write(&self.config_path, content)?;
        Ok(())
    }

    pub fn read_config(&self) -> Result<ConfigToml, AppManagerError> {
        if !self.config_path.exists() {
            let default_config = ConfigToml::default();
            self.write_config(&default_config)?;
            return Ok(default_config);
        }

        let content = std::fs::read_to_string(&self.config_path)?;
        let config: ConfigToml = toml::from_str(&content)?;

        Ok(config)
    }

    pub fn update_from_payload(&self, payload: ConfigTomlDto) -> Result<(), AppManagerError> {
        let domain_config: ConfigToml = payload.try_into()?;
        self.write_config(&domain_config)
    }

    pub async fn check_daemon_update(&self) -> Result<(String, String), AppManagerError> {
        let api_url = "https://api.github.com/repos/oscar370/matuda/releases";
        let response = self.client.get(api_url).send().await?;

        if !response.status().is_success() {
            return Err(AppManagerError::Network(format!(
                "GitHub API error: HTTP {}",
                response.status()
            )));
        }

        let releases: Vec<GitHubRelease> = response.json().await?;

        let release = releases
            .into_iter()
            .find(|r| r.tag_name.starts_with("daemon-"))
            .ok_or_else(|| AppManagerError::ResourceNotFound("No daemon release found".into()))?;

        let asset = release
            .assets
            .into_iter()
            .find(|a| a.name == "daemon")
            .ok_or_else(|| AppManagerError::ResourceNotFound("Asset 'daemon' not found".into()))?;

        Ok((release.tag_name, asset.browser_download_url))
    }

    pub async fn check_matugen_update(&self) -> Result<(String, String), AppManagerError> {
        let api_url = "https://api.github.com/repos/InioX/matugen/releases/latest";
        let response = self.client.get(api_url).send().await?;

        if !response.status().is_success() {
            return Err(AppManagerError::Network(format!(
                "GitHub API error: HTTP {}",
                response.status()
            )));
        }

        let release: GitHubRelease = response.json().await?;
        let suffix = "-x86_64.tar.gz";
        let asset = release
            .assets
            .into_iter()
            .find(|a| a.name.starts_with("matugen-") && a.name.ends_with(suffix))
            .ok_or_else(|| AppManagerError::ResourceNotFound("Asset not found".to_string()))?;

        Ok((release.tag_name, asset.browser_download_url))
    }

    pub async fn check_all_updates(&self) -> Result<AllUpdates, AppManagerError> {
        let (daemon_res, matugen_res) =
            tokio::join!(self.check_daemon_update(), self.check_matugen_update());

        let (daemon_version, daemon_url) = daemon_res?;
        let (matugen_version, matugen_url) = matugen_res?;

        Ok(AllUpdates {
            daemon: UpdateMetadata {
                version: daemon_version,
                url: daemon_url,
            },
            matugen: UpdateMetadata {
                version: matugen_version,
                url: matugen_url,
            },
        })
    }

    pub async fn install_daemon(&self, download_url: &str) -> Result<(), AppManagerError> {
        let response = self.client.get(download_url).send().await?;

        if !response.status().is_success() {
            return Err(AppManagerError::Network(format!(
                "Download failed: HTTP {}",
                response.status()
            )));
        }

        tokio::process::Command::new("systemctl")
            .arg("--user")
            .args(["disable", "--now", self.service_name()])
            .output()
            .await?;

        let bytes = response.bytes().await?;
        fs::write(&self.daemon_path, bytes)?;
        Self::set_executable(&self.daemon_path)?;

        tokio::process::Command::new("systemctl")
            .arg("--user")
            .args(["enable", "--now", self.service_name()])
            .output()
            .await?;

        Ok(())
    }

    pub async fn install_matugen(&self, download_url: &str) -> Result<(), AppManagerError> {
        let response = self.client.get(download_url).send().await?;

        if !response.status().is_success() {
            return Err(AppManagerError::Network(format!(
                "Download failed: HTTP {}",
                response.status()
            )));
        }

        let tar_gz_bytes = response.bytes().await?;
        let cursor = Cursor::new(tar_gz_bytes);
        let mut archive = Archive::new(GzDecoder::new(cursor));

        let mut found = false;
        for entry in archive.entries()? {
            let mut file = entry?;
            let path = file.path()?;
            if path
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or_default()
                == "matugen"
            {
                let mut dest_file = fs::File::create(&self.matugen_path)?;
                std::io::copy(&mut file, &mut dest_file)?;
                found = true;
                break;
            }
        }

        if !found {
            return Err(AppManagerError::ResourceNotFound(
                "Binary 'matugen' not found in archive".to_string(),
            ));
        }

        Self::set_executable(&self.matugen_path)?;
        Ok(())
    }

    pub fn clean_service(&self) -> Result<(), AppManagerError> {
        self.systemctl_run(&["disable", "--now", self.service_name()])?;

        if self.service_path().exists() {
            fs::remove_file(self.service_path())?;
        }

        self.systemctl_run(&["daemon-reload"])?;

        Ok(())
    }

    pub fn clean_config(&self) -> Result<(), AppManagerError> {
        std::fs::remove_dir_all(self.config_dir())?;

        Ok(())
    }

    fn systemctl_run(&self, args: &[&str]) -> Result<String, AppManagerError> {
        let mut cmd = std::process::Command::new("systemctl");
        cmd.arg("--user").args(args);

        let output = cmd.output()?;

        if !output.status.success() {
            return Err(AppManagerError::CommandFailed(
                String::from_utf8_lossy(&output.stderr).to_string(),
            ));
        }
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    }
}
