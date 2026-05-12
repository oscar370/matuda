use crate::{
    app_manager::AppManager,
    errors::AppManagerError,
    models::{AllUpdates, AppVersions, ConfigTomlDto},
};
use shared::ConfigToml;
use tauri::State;

#[tauri::command]
#[specta::specta]
pub async fn get_service_status(
    app_manager: State<'_, AppManager>,
) -> Result<String, AppManagerError> {
    let output = tokio::process::Command::new("systemctl")
        .arg("--user")
        .arg("status")
        .arg(app_manager.service_name())
        .output()
        .await?;

    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

#[tauri::command]
#[specta::specta]
pub async fn is_init_app(app_manager: State<'_, AppManager>) -> Result<bool, ()> {
    Ok(app_manager.daemon_path().exists()
        && app_manager.matugen_path().exists()
        && app_manager.service_path().exists())
}

#[tauri::command]
#[specta::specta]
pub async fn init_app(app_manager: State<'_, AppManager>) -> Result<AppVersions, AppManagerError> {
    app_manager.create_dirs()?;
    let version_tag = app_manager.setup_binaries().await?;
    app_manager.write_config(&ConfigToml::default())?;
    app_manager.setup_service()?;
    Ok(version_tag)
}

#[tauri::command]
#[specta::specta]
pub async fn start_service(app_manager: State<'_, AppManager>) -> Result<(), AppManagerError> {
    tokio::process::Command::new("systemctl")
        .arg("--user")
        .args(["enable", "--now", app_manager.service_name()])
        .output()
        .await?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn stop_service(app_manager: State<'_, AppManager>) -> Result<(), AppManagerError> {
    tokio::process::Command::new("systemctl")
        .arg("--user")
        .args(["disable", "--now", app_manager.service_name()])
        .output()
        .await?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn restart_service(app_manager: State<'_, AppManager>) -> Result<(), AppManagerError> {
    tokio::process::Command::new("systemctl")
        .arg("--user")
        .args(["restart", app_manager.service_name()])
        .output()
        .await?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn clean_app(app_manager: State<'_, AppManager>) -> Result<(), AppManagerError> {
    app_manager.clean_service()?;
    app_manager.clean_config()?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn save_new_config(
    app_manager: State<'_, AppManager>,
    invoke_config: ConfigTomlDto,
) -> Result<(), AppManagerError> {
    app_manager.update_from_payload(invoke_config)?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn get_config(app_manager: State<'_, AppManager>) -> Result<ConfigTomlDto, AppManagerError> {
    let config = app_manager.read_config()?;
    let dto: ConfigTomlDto = config.into();

    Ok(dto)
}

#[tauri::command]
#[specta::specta]
pub async fn check_updates(
    app_manager: State<'_, AppManager>,
) -> Result<AllUpdates, AppManagerError> {
    app_manager.check_all_updates().await
}

#[tauri::command]
#[specta::specta]
pub async fn install_daemon(
    app_manager: State<'_, AppManager>,
    url: String,
) -> Result<(), AppManagerError> {
    app_manager.install_daemon(&url).await
}

#[tauri::command]
#[specta::specta]
pub async fn install_matugen(
    app_manager: State<'_, AppManager>,
    url: String,
) -> Result<(), AppManagerError> {
    app_manager.install_matugen(&url).await
}
