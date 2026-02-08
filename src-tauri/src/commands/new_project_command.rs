use tauri_plugin_dialog::DialogExt;

#[tauri::command]
pub fn new_project_command(app: tauri::AppHandle) {
  WebviewWindowBuilder::new(
    &app,
    "New Project",
    tauri::WindowUrl::App("new_project.html".into()),
  )
}