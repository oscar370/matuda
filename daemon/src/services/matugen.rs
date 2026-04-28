use std::{error::Error, path::PathBuf, process::Command};

use crate::{
    models::args,
    utils::config::{self, get_config},
};

pub fn generate_colors(image_path: &PathBuf) -> Result<(), Box<dyn Error>> {
    let args::Args {
        matugen_path,
        config_path,
    } = config::get_args();
    let settings = get_config(config_path)?;

    let output = Command::new(&matugen_path)
        .arg("image")
        .arg(&image_path)
        .arg("-t")
        .arg(&settings.app.color_schema)
        .arg("--contrast")
        .arg(&settings.app.contrast.to_string())
        .arg("-m")
        .arg(&settings.app.mode)
        .arg("-r")
        .arg(&settings.app.resize_filter)
        .arg("-c")
        .arg(&config_path)
        .arg("--fallback-color")
        .arg(&settings.app.fallback_color.replace("#", ""))
        .status()?;

    if !output.success() {
        return Err("Failed to execute Matugen".into());
    }

    println!("Matugen command completed with {}", output);

    Ok(())
}

pub fn generate_with_fallback() -> Result<(), Box<dyn Error>> {
    let args::Args {
        matugen_path,
        config_path,
    } = config::get_args();

    let settings = config::get_config(config_path)?;

    let output = Command::new(&matugen_path)
        .arg("color")
        .arg("hex")
        .arg(&settings.app.fallback_color.replace("#", ""))
        .arg("-t")
        .arg(&settings.app.color_schema)
        .arg("--contrast")
        .arg(&settings.app.contrast.to_string())
        .arg("-m")
        .arg(&settings.app.mode)
        .arg("-r")
        .arg(&settings.app.resize_filter)
        .arg("-c")
        .arg(&config_path)
        .status()?;

    if !output.success() {
        return Err("Failed to execute Matugen".into());
    }

    println!("[INFO] Matugen command completed with {}", output);

    Ok(())
}
