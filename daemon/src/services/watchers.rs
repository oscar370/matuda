use crate::core::processors;
use gio::glib::MainLoop;
use gio::prelude::SettingsExt;

pub fn watch_gnome_bg() {
    println!("[INFO] Initializing watcher...");

    let settings = gio::Settings::new("org.gnome.desktop.background");

    settings.connect_changed(Some("picture-uri"), move |s, _| {
        println!("[INFO] Wallpaper changed");

        let uri = s.string("picture-uri");

        if let Err(e) = processors::process_new_wallpaper(uri.to_string()) {
            eprintln!("[ERROR] {e}");
            return;
        }
    });

    MainLoop::new(None, false).run();
}
