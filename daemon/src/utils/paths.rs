use std::path::PathBuf;

pub fn get_clean_uri(uri: String) -> PathBuf {
    PathBuf::from(uri.strip_prefix("file://").unwrap_or(&uri))
}

pub fn ensure_path_exists(path: &PathBuf) -> Result<(), std::string::String> {
    if !path.exists() {
        return Err("The path does not exist".into());
    }

    Ok(())
}
