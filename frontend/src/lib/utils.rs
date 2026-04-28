use anyhow::{Context, Result};
use std::{env, path::PathBuf};

pub fn get_config_dir() -> Result<PathBuf> {
    let base_dir = env::var("XDG_CONFIG_HOME")
        .map(PathBuf::from)
        .context("XDG_CONFIG_HOME environment variable must be set")?;

    let config_dir = base_dir.join("matuda");

    Ok(config_dir)
}
