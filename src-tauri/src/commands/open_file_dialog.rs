use tauri_plugin_dialog::DialogExt;

#[tauri::command]
pub fn open_file_dialog(app: tauri::AppHandle) -> String {
  return match app.dialog().file().blocking_pick_file() {
    Some(path) => path.to_string(),
    None => "".to_string(),
  };
}