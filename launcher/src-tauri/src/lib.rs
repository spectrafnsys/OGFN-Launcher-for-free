use std::{env, fs::File, io::Read, path::PathBuf};

use tauri::Emitter;

use tauri::Manager;
use tauri_plugin_deep_link::DeepLinkExt;

mod launch;
mod utilities;

#[tauri::command]
async fn check_file_exists(path: &str) -> Result<bool, String> {
    Ok(PathBuf::from(path).exists())
}

#[tauri::command]
fn search_for_version(path: &str) -> Result<Vec<String>, String> {
    let mut file = File::open(path).map_err(|e| e.to_string())?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).map_err(|e| e.to_string())?;

    let pattern = [
        0x2b, 0x00, 0x2b, 0x00, 0x46, 0x00, 0x6f, 0x00, 0x72, 0x00, 0x74, 0x00, 0x6e, 0x00, 0x69,
        0x00, 0x74, 0x00, 0x65, 0x00, 0x2b, 0x00,
    ];

    let mut matches = Vec::new();
    for (i, window) in buffer.windows(pattern.len()).enumerate() {
        if window == pattern {
            let end = (i + pattern.len() + 64).min(buffer.len());
            if let Some(e) = find_end(&buffer[i + pattern.len()..end]) {
                let utf16_slice = unsafe {
                    std::slice::from_raw_parts(
                        buffer[i..i + pattern.len() + e].as_ptr() as *const u16,
                        (pattern.len() + e) / 2,
                    )
                };
                matches.push(
                    String::from_utf16_lossy(utf16_slice)
                        .trim_end_matches('\0')
                        .to_string(),
                );
            }
        }
    }

    Ok(matches)
}

fn find_end(data: &[u8]) -> Option<usize> {
    let mut i = 0;
    while i + 1 < data.len() {
        if data[i] == 0 && data[i + 1] == 0 {
            return Some(i);
        }
        i += 2;
    }
    None
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_single_instance::init(|app, argv, _| {
            let main_window = app.get_webview_window("main").unwrap();
            main_window.show().unwrap();
            main_window.set_focus().unwrap();
            for arg in argv {
                if arg.starts_with("luna://") {
                    let _ = main_window.emit("tauri://uri", arg);
                    break;
                }
            }
        }))
        .setup(|app| {
            #[cfg(desktop)]
            app.deep_link().register("luna")?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            search_for_version,
            check_file_exists,
            utilities::download_file,
            launch::start_mega,
            utilities::exit_all,
        ])
        .run(tauri::generate_context!())
        .expect("tauri app failed");
}
