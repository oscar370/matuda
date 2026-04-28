mod core;
mod models;
mod services;
mod utils;

fn main() {
    utils::config::init_args();
    let models::args::Args {
        config_path,
        matugen_path,
    } = utils::config::get_args();

    println!("[INFO] Configuration path: {}", config_path);
    println!("[INFO] Matugen path: {}", matugen_path);

    services::watchers::watch_gnome_bg();
}
