#[tauri::command]
pub fn open_rom_file() {
  println!("I was invoked from JavaScript!");
}