use std::{path::PathBuf, sync::Mutex};

use memmap2::Mmap;
use tauri::State;
use std::fs::{self, File};

use crate::structs::app_state::AppState;
use crate::structs::project_files::project::Project;

#[tauri::command]
pub fn load_project(project_path: String, state: State<Mutex<AppState>>) -> Result<(), String> {
    let project_path_buffer = PathBuf::from(project_path.as_str());
    let project_json_path = project_path_buffer.join("project.json");

    let project_string = fs::read_to_string(project_json_path)
        .map_err(|e| format!("Failed to read project file: {}", e))?;
    let project: Project = serde_json::from_str(&project_string)
        .map_err(|e| format!("Failed to parse project file: {}", e))?;

    let rom_file = File::open(project.rom_path)
        .map_err(|e| format!("Failed to open ROM file: {}", e))?;

    let mmap = unsafe { Mmap::map(&rom_file)
        .map_err(|e| format!("Failed to memory-map ROM file: {}", e))? };

    let mut app_state = state.lock()
        .map_err(|e| format!("Failed to acquire app state lock: {}", e))?;

    app_state.rom_file_map = Some(mmap);

    return Ok(());
}