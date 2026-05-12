use std::{error::Error, fs::File, io::Read, path::PathBuf};

pub fn get_image_extension(path: &PathBuf) -> Result<String, Box<dyn Error>> {
    let mut file = File::open(path)?;
    let mut buffer = [0; 16];

    file.read_exact(&mut buffer)?;

    let kind = infer::get(&buffer).ok_or("The image could not be inferred")?;

    Ok(kind.extension().to_string())
}
