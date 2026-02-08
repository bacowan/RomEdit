use std::fs;
use std::io::{Cursor, Write};
use std::path::{Path};

use serde_json::json;
use zip::ZipWriter;
use zip::write::{SimpleFileOptions};

#[tauri::command]
pub fn create_new_project(project_name: String, rom_path: String, project_file_path: String) -> Result<(), String> {
    if Path::new(project_file_path.as_str()).exists() {
        return Err("File already exists".to_string());
    }

    let project_data = json!({
        "name": project_name,
        "rom_path": rom_path
    });

    // create the zip in memory
    let mut buffer = Vec::new();
    let cursor = Cursor::new(&mut buffer);
    let mut zip = ZipWriter::new(cursor);

    let options = SimpleFileOptions::default()
        .compression_method(zip::CompressionMethod::Deflated);

    zip.start_file("project.json", options)
        .map_err(|e| format!("Failed to add project.json to zip: {}", e))?;

    zip.write_all(project_data.to_string().as_bytes())
        .map_err(|e| format!("Failed to write project data to zip: {}", e))?;

    zip.finish()
        .map_err(|e| format!("Failed to finalize zip: {}", e))?;
    
    // create the path to the output directory if it doesn't exist
    let path = Path::new(project_file_path.as_str());
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create project directory: {}", e))?;
    }

    std::fs::write(project_file_path, buffer)
        .map_err(|e| format!("Failed to write project file: {}", e))?;

    return Ok(());
}