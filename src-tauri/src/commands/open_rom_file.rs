use tauri_plugin_dialog::DialogExt;

#[tauri::command]
pub fn open_rom_file(app: tauri::AppHandle) {
  let file_path = app.dialog().file().blocking_pick_file();
  println!("Selected file: {:?}", file_path);
}