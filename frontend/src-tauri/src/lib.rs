mod app_manager;
mod commands;
mod errors;
mod models;

use app_manager::AppManager;
use specta_typescript::Typescript;
use tauri_specta::Builder;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let daemon_state = AppManager::new().expect("Failed to initialize core paths");

    let builder = Builder::<tauri::Wry>::new().commands(tauri_specta::collect_commands![
        commands::get_service_status,
        commands::is_init_app,
        commands::init_app,
        commands::start_service,
        commands::stop_service,
        commands::restart_service,
        commands::clean_app,
        commands::save_new_config,
        commands::get_config,
        commands::check_updates,
        commands::install_daemon,
        commands::install_matugen
    ]);

    #[cfg(debug_assertions)]
    {
        builder
            .export(Typescript::default(), "../src/lib/bindings.ts")
            .expect("Failed to export TypeScript bindings");
    }

    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .manage(daemon_state)
        .invoke_handler(builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
