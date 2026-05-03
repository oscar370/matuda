use crate::models::args::Args;
use clap::Parser;
use shared::ConfigToml;
use std::error::Error;
use std::fs;

pub fn get_config(path: &str) -> Result<ConfigToml, Box<dyn Error>> {
    let content = fs::read_to_string(path)?;
    let config: ConfigToml = toml::from_str(&content)?;

    Ok(config)
}

pub fn init_args() -> Args {
    let args = Args::parse();
    args
}
