use clap::Parser;

#[derive(Parser, Debug)]
pub struct Args {
    #[arg(long)]
    pub config_path: String,

    #[arg(long)]
    pub matugen_path: String,
}
