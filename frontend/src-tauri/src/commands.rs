use crate::{app_manager::AppManager, errors::AppManagerError};
use shared::ConfigToml;
use std::fs;
use tauri::{AppHandle, State};

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
pub async fn init_app(
    app_manager: State<'_, AppManager>,
    app: AppHandle,
    invoke_config: ConfigToml,
) -> Result<(), AppManagerError> {
    app_manager.create_dirs()?;
    app_manager.setup_binaries(&app)?;
    app_manager.setup_config(&invoke_config)?;
    app_manager.setup_service()?;
    Ok(())
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
pub async fn clean_service(app_manager: State<'_, AppManager>) -> Result<(), AppManagerError> {
    tokio::process::Command::new("systemctl")
        .arg("--user")
        .args(["disable", "--now", app_manager.service_name()])
        .output()
        .await?;

    if app_manager.service_path().exists() {
        fs::remove_file(app_manager.service_path())?;
    }

    tokio::process::Command::new("systemctl")
        .arg("--user")
        .arg("daemon-reload")
        .output()
        .await?;

    Ok(())
}
