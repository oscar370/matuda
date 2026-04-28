use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
pub struct ConfigToml {
    pub app: AppConfig,
    pub templates: HashMap<String, TemplateConfig>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct AppConfig {
    pub color_schema: String,
    pub contrast: f64,
    pub mode: String,
    pub resize_filter: String,
    pub fallback_color: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TemplateConfig {
    pub input_path: String,
    pub output_path: Option<String>,
    pub pre_hook: String,
    pub post_hook: String,
}
