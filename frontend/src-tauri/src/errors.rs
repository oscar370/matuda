use serde::Serialize;
use specta::Type;
use thiserror::Error;

#[derive(Error, Debug, Serialize, Type)]
#[serde(tag = "type", content = "message")]
pub enum AppManagerError {
    #[error("IO Error: {0}")]
    Io(String),

    #[error("Systemctl execution failed: {0}")]
    CommandFailed(String),

    #[error("Resource not found: {0}")]
    ResourceNotFound(String),

    #[error("Serialization error: {0}")]
    Serialization(String),

    #[error("Environment error: {0}")]
    Env(String),
}

impl From<std::io::Error> for AppManagerError {
    fn from(error: std::io::Error) -> Self {
        Self::Io(error.to_string())
    }
}

impl From<toml::ser::Error> for AppManagerError {
    fn from(error: toml::ser::Error) -> Self {
        Self::Serialization(error.to_string())
    }
}

impl From<std::env::VarError> for AppManagerError {
    fn from(error: std::env::VarError) -> Self {
        Self::Env(error.to_string())
    }
}
