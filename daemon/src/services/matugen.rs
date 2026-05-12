use crate::models::args::Args;
use shared::ConfigToml;
use std::{error::Error, path::PathBuf, process::Command};

pub fn generate_colors(
    image_path: &PathBuf,
    args: &Args,
    config: &ConfigToml,
) -> Result<(), Box<dyn Error>> {
    let output = Command::new(&args.matugen_path)
        .arg("image")
        .arg(image_path)
        .arg("-t")
        .arg(&config.app.color_schema)
        .arg("--contrast")
        .arg(config.app.contrast.to_string())
        .arg("-m")
        .arg(&config.app.mode)
        .arg("-r")
        .arg(&config.app.resize_filter)
        .arg("-c")
        .arg(&args.config_path)
        .arg("--fallback-color")
        .arg(&config.app.fallback_color.replace('#', ""))
        .arg("prefer")
        .arg(&config.app.prefer)
        .status()?;

    if !output.success() {
        return Err("Failed to execute Matugen".into());
    }

    println!("[INFO] Matugen command completed with {}", output);
    Ok(())
}

pub fn generate_with_fallback(args: &Args, config: &ConfigToml) -> Result<(), Box<dyn Error>> {
    let output = Command::new(&args.matugen_path)
        .arg("color")
        .arg("hex")
        .arg(&config.app.fallback_color.replace("#", ""))
        .arg("-t")
        .arg(&config.app.color_schema)
        .arg("--contrast")
        .arg(&config.app.contrast.to_string())
        .arg("-m")
        .arg(&config.app.mode)
        .arg("-r")
        .arg(&config.app.resize_filter)
        .arg("-c")
        .arg(&args.config_path)
        .status()?;

    if !output.success() {
        return Err("Failed to execute Matugen".into());
    }

    println!("[INFO] Matugen command completed with {}", output);

    Ok(())
}
