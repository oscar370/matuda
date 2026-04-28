use anyhow::{Context, Ok, Result};
use std::{env, fs};

use crate::lib::get_config_dir;

pub fn init_app() -> Result<()> {
    create_config_dir()?;

    Ok(())
}

fn create_config_dir() -> Result<()> {
    let config_dir = get_config_dir()?;

    if !config_dir.exists() {
        let _ = fs::create_dir_all(config_dir).context("Failed to create config directory");
    }

    Ok(())
}
