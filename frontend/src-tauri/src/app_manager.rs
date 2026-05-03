use crate::errors::AppManagerError;
use ini::Ini;
use shared::ConfigToml;
use std::{
    env, fs,
    path::{Path, PathBuf},
};
use tauri::{path::BaseDirectory, AppHandle, Manager};

pub struct AppManager {
    config_dir: PathBuf,
    daemon_path: PathBuf,
    matugen_path: PathBuf,
    service_dir: PathBuf,
    service_path: PathBuf,
    service_name: String,
    config_path: PathBuf,
}

impl AppManager {
    pub fn new() -> Result<Self, AppManagerError> {
        let base_dir = env::var("XDG_CONFIG_HOME")
            .map(PathBuf::from)
            .or_else(|_| env::var("HOME").map(|h| PathBuf::from(h).join(".config")))?;

        let config_dir = base_dir.join("matuda");
        let service_dir = base_dir.join("systemd/user");
        let service_name = "matuda-daemon.service".to_string();

        Ok(Self {
            daemon_path: config_dir.join("daemon"),
            matugen_path: config_dir.join("matugen"),
            config_path: config_dir.join("config.toml"),
            service_path: service_dir.join(&service_name),
            config_dir,
            service_dir,
            service_name,
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

    pub fn setup_binaries(&self, app: &AppHandle) -> Result<(), AppManagerError> {
        let resolver = app.path();

        let daemon_res = resolver
            .resolve("resources/daemon", BaseDirectory::Resource)
            .map_err(|_| AppManagerError::ResourceNotFound("daemon binary".into()))?;
        let matugen_res = resolver
            .resolve("resources/matugen", BaseDirectory::Resource)
            .map_err(|_| AppManagerError::ResourceNotFound("matugen binary".into()))?;

        fs::copy(daemon_res, &self.daemon_path)?;
        fs::copy(matugen_res, &self.matugen_path)?;
        Ok(())
    }

    pub fn setup_service(&self) -> Result<(), AppManagerError> {
        let mut config = Ini::new();
        let exec_config = format!(
            "{} --config {} --matugen {}",
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

    pub fn setup_config(&self, config: &ConfigToml) -> Result<(), AppManagerError> {
        let content = toml::to_string(config)?;
        fs::write(&self.config_path, content)?;
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
