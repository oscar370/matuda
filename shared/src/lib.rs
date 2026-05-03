use clap::Parser;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "../../frontend/src/types/bindings.ts")]
pub struct ConfigToml {
    pub app: AppConfig,
    pub templates: HashMap<String, TemplateConfig>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "../../frontend/src/types/bindings.ts")]
pub struct AppConfig {
    pub color_schema: String,
    pub contrast: f64,
    pub mode: String,
    pub resize_filter: String,
    pub fallback_color: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "../../frontend/src/types/bindings.ts")]
pub struct TemplateConfig {
    pub input_path: String,
    pub output_path: Option<String>,
    pub pre_hook: String,
    pub post_hook: String,
}

#[derive(Parser, Debug)]
pub struct Args {
    #[arg(long)]
    pub config_path: String,

    #[arg(long)]
    pub matugen_path: String,
}
