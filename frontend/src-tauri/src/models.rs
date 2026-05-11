use crate::errors::AppManagerError;
use serde::{Deserialize, Serialize};
use shared::{AppConfig, ConfigToml, TemplateConfig};
use specta::Type;
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug, Type)]
pub struct ConfigTomlDto {
    pub app: AppConfig,
    pub templates: Vec<TemplateItemDto>,
}

#[derive(Serialize, Deserialize, Debug, Type)]
pub struct TemplateItemDto {
    pub key: String,
    pub input_path: String,
    pub output_path: Option<String>,
    pub pre_hook: String,
    pub post_hook: String,
}

impl TryFrom<ConfigTomlDto> for ConfigToml {
    type Error = AppManagerError;

    fn try_from(dto: ConfigTomlDto) -> Result<Self, Self::Error> {
        let mut templates = HashMap::with_capacity(dto.templates.len());

        for item in dto.templates {
            if templates.contains_key(&item.key) {
                return Err(AppManagerError::DuplicateTemplateKey(item.key));
            }

            templates.insert(
                item.key,
                TemplateConfig {
                    input_path: item.input_path,
                    output_path: item.output_path,
                    pre_hook: item.pre_hook,
                    post_hook: item.post_hook,
                },
            );
        }

        Ok(ConfigToml {
            app: dto.app,
            templates,
        })
    }
}

impl From<ConfigToml> for ConfigTomlDto {
    fn from(config: ConfigToml) -> Self {
        let templates: Vec<TemplateItemDto> = config
            .templates
            .into_iter()
            .map(|(key, template)| TemplateItemDto {
                key,
                input_path: template.input_path,
                output_path: template.output_path,
                pre_hook: template.pre_hook,
                post_hook: template.post_hook,
            })
            .collect();

        Self {
            app: config.app,
            templates,
        }
    }
}

#[derive(Deserialize)]
pub struct GitHubRelease {
    pub tag_name: String,
    pub assets: Vec<GitHubAsset>,
}

#[derive(Deserialize)]
pub struct GitHubAsset {
    pub name: String,
    pub browser_download_url: String,
}

#[derive(Serialize, Type)]
pub struct AppVersions {
    pub daemon: String,
    pub matugen: String,
}

#[derive(Serialize, Type)]
pub struct UpdateMetadata {
    pub version: String,
    pub url: String,
}

#[derive(Serialize, Type)]
pub struct AllUpdates {
    pub daemon: UpdateMetadata,
    pub matugen: UpdateMetadata,
}
