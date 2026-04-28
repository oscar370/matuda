use crate::{
    services::matugen,
    utils::{images, paths},
};
use std::{error::Error, fs};

pub fn process_new_wallpaper(uri: String) -> Result<(), Box<dyn Error>> {
    let white_list_formats = vec![String::from("png"), String::from("jpg")];
    let path = paths::get_clean_uri(uri);
    paths::ensure_path_exists(&path)?;

    println!("[INFO] Wallpaper path: {}", path.display());

    let ext = images::get_image_extension(&path)?;
    let temp_path = std::env::temp_dir().join(format!("current_wallpaper.{}", ext));

    let _ = std::fs::remove_file(&temp_path);
    fs::copy(&path, &temp_path)?;

    println!("[INFO] Image temporarily copied to {}", temp_path.display());

    if !white_list_formats.contains(&ext) {
        println!("[INFO] Incompatible format detected, generating with fallback");
        matugen::generate_with_fallback()?;
        let _ = fs::remove_file(temp_path);
        return Ok(());
    }

    matugen::generate_colors(&temp_path)?;
    let _ = fs::remove_file(temp_path);

    Ok(())
}
