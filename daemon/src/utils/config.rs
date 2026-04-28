use crate::models::args;
use crate::models::config;
use clap::Parser;
use std::error::Error;
use std::fs;
use std::sync::OnceLock;

pub fn get_config(path: &str) -> Result<config::ConfigToml, Box<dyn Error>> {
    let content = fs::read_to_string(path)?;
    let config: config::ConfigToml = toml::from_str(&content)?;

    Ok(config)
}

pub static ARGS: OnceLock<args::Args> = OnceLock::new();

pub fn init_args() {
    let args = args::Args::parse();
    let _ = ARGS
        .set(args)
        .expect("The arguments have already been initialized");
}

pub fn get_args() -> &'static args::Args {
    ARGS.get().expect("The arguments have not been initialized")
}
