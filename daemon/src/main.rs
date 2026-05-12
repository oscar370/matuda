mod core;
mod models;
mod services;
mod utils;

use std::sync::mpsc;
use std::thread;

fn main() {
    let args = utils::config::init_args();
    let config = utils::config::get_config(&args.config_path).expect("Failed to parse config file");

    println!("[INFO] Configuration path: {}", args.config_path);
    println!("[INFO] Matugen path: {}", args.matugen_path);

    let (tx, rx) = mpsc::channel::<String>();

    thread::spawn(move || {
        services::watchers::gnome::watch_gnome_bg(tx);
    });

    for uri in rx {
        if let Err(e) = core::processor::process_new_wallpaper(uri, &args, &config) {
            eprintln!("[ERROR] Processor failed: {}", e);
        }
    }
}
