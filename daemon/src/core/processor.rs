use crate::{
    services::matugen,
    utils::{images, paths},
};
use shared::{Args, ConfigToml};
use std::{error::Error, fs};

pub fn process_new_wallpaper(
    uri: String,
    args: &Args,
    config: &ConfigToml,
) -> Result<(), Box<dyn Error>> {
    let white_list_formats = ["png", "jpg"];
    let path = paths::get_clean_uri(uri);
    paths::ensure_path_exists(&path)?;

    println!("[INFO] Wallpaper path: {}", path.display());

    let ext = images::get_image_extension(&path)?;
    let temp_path = std::env::temp_dir().join(format!("current_wallpaper.{}", ext));

    let _ = fs::remove_file(&temp_path);
    fs::copy(&path, &temp_path)?;

    println!("[INFO] Image temporarily copied to {}", temp_path.display());

    if !white_list_formats.contains(&ext.as_str()) {
        println!("[INFO] Incompatible format detected, generating with fallback");
        matugen::generate_with_fallback(args, config)?;
        let _ = fs::remove_file(temp_path);
        return Ok(());
    }

    matugen::generate_colors(&temp_path, args, config)?;
    let _ = fs::remove_file(temp_path);

    Ok(())
}
