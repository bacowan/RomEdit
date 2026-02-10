use std::sync::Mutex;

use tauri::{State, ipc::Response};
use crate::structs::app_state::AppState;

#[tauri::command]
pub fn load_rom_bytes(start: usize, end: usize, state: State<Mutex<AppState>>) -> Result<Response, String> {
    let app_state = state.lock().unwrap();

    if let Some(mmap) = &app_state.rom_file_map {
        let len = mmap.len();
        if end >= len {
            return Err("Offset out of bounds".to_string());
        }
        Ok(tauri::ipc::Response::new(mmap[start..end].to_vec()))
    }
    else {
        Err("No file opened".to_string())
    }
}