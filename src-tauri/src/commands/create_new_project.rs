use std::fs;
use std::io::{Cursor, Write};
use std::path::{Path, PathBuf};

use serde_json::json;

#[tauri::command]
pub fn create_new_project(project_name: String, rom_path: String, project_directory_path: String) -> Result<(), String> {
    
    fs::create_dir_all(project_directory_path.as_str())
        .map_err(|e| format!("Failed to create project directory: {}", e))?;
        
    let project_data = json!({
        "name": project_name,
        "rom_path": rom_path
    });

    let project_directory_path_buffer = PathBuf::from(project_directory_path.as_str());
    let full_path = project_directory_path_buffer.join("project.json");

    std::fs::write(full_path.to_str().unwrap(), project_data.to_string())
        .map_err(|e| format!("Failed to write project file: {}", e))?;

    return Ok(());
}