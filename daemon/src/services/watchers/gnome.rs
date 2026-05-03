use gio::prelude::*;
use std::sync::mpsc::Sender;

pub fn watch_gnome_bg(tx: Sender<String>) {
    println!("[INFO] Initializing GNOME watcher...");

    let settings = gio::Settings::new("org.gnome.desktop.background");

    settings.connect_changed(Some("picture-uri"), move |s, _| {
        println!("[INFO] Wallpaper changed");
        let uri = s.string("picture-uri");

        if let Err(e) = tx.send(uri.to_string()) {
            eprintln!("[ERROR] Channel send failed: {}", e);
        }
    });

    gio::glib::MainLoop::new(None, false).run();
}
