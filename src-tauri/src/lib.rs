mod commands;
mod structs;

use std::sync::Mutex;
use structs::app_state::AppState;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(Mutex::new(AppState::default()))
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            commands::create_new_project::create_new_project,
            commands::load_project::load_project,
            commands::load_rom_bytes::load_rom_bytes
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
