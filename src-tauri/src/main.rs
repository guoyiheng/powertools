#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu};

fn main() {
    let opt_quit = CustomMenuItem::new("quit", "Quit");

    let tray_menu = SystemTrayMenu::new().add_item(opt_quit);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        // ✅ 在这里传递自定义命令
        .invoke_handler(tauri::generate_handler![my_read_file])
        .system_tray(system_tray)
        .on_system_tray_event(|_app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => std::process::exit(0),
                _ => {}
            },
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn my_read_file(path: std::path::PathBuf) -> String {
    // 读取文件内容，以文本字符串形式返回
    std::fs::read_to_string(path).unwrap()
}
