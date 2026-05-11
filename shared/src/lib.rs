use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
pub struct ConfigToml {
    pub app: AppConfig,
    pub templates: HashMap<String, TemplateConfig>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
pub struct AppConfig {
    pub color_schema: String,
    pub contrast: f64,
    pub mode: String,
    pub resize_filter: String,
    pub fallback_color: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
pub struct TemplateConfig {
    pub input_path: String,
    pub output_path: Option<String>,
    pub pre_hook: String,
    pub post_hook: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            color_schema: "scheme-tonal-spot".to_string(),
            contrast: 0.0,
            mode: "dark".to_string(),
            resize_filter: "nearest".to_string(),
            fallback_color: "#1e1e2e".to_string(),
        }
    }
}

impl Default for TemplateConfig {
    fn default() -> Self {
        Self {
            input_path: "~/.config/example/input.css".to_string(),
            output_path: None,
            pre_hook: String::new(),
            post_hook: String::new(),
        }
    }
}

impl Default for ConfigToml {
    fn default() -> Self {
        Self {
            app: AppConfig::default(),
            templates: HashMap::from([("example".to_string(), TemplateConfig::default())]),
        }
    }
}
