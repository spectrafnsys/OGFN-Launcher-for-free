use crate::utilities;

use reqwest::Client;
use std::process::{Child, Command};
use std::{fs::File, io::Write, path::Path, thread, time::Duration};

fn launch_process(exe_path: &Path, args: &[&str]) -> Result<Child, String> {
    Command::new(exe_path)
        .args(args)
        .spawn()
        .map_err(|e| format!("Failed to launch process {:?}: {}", exe_path, e))
}

#[tauri::command]
pub async fn start_mega(file_path: String, email: String, password: String) -> Result<(), String> {
    let dll_url = "https://dl.netcable.dev/starfall%20redirect/local3551/Starfall.dll";
    let exe_dir = Path::new(&file_path);
    let dll_path = exe_dir.join("Starfall.dll");

    if !dll_path.exists() {
        let client = Client::new();
        let bytes = client
            .get(dll_url)
            .send()
            .await
            .map_err(|e| format!("Failed to download DLL: {}", e))?
            .bytes()
            .await
            .map_err(|e| format!("Failed to read DLL bytes: {}", e))?;
        let mut file =
            File::create(&dll_path).map_err(|e| format!("Failed to create DLL file: {}", e))?;
        file.write_all(&bytes)
            .map_err(|e| format!("Failed to write DLL file: {}", e))?;
    }

    let fn_normal = exe_dir.join("FortniteClient-Win64-Shipping.exe");
    let fn_eac = exe_dir.join("FortniteClient-Win64-Shipping_EAC.exe");
    let fn_be = exe_dir.join("FortniteClient-Win64-Shipping_BE.exe");

    if !fn_normal.exists() || !fn_eac.exists() || !fn_be.exists() {
        return Err("One or more Fortnite executables are missing.".into());
    }

    let auth_login_arg = format!("-AUTH_LOGIN={}", email);
    let auth_password_arg = format!("-AUTH_PASSWORD={}", password);

    let common_args = [
        "-skippatchcheck",
        "-steamimportavailable",
        "-useallavailablecores",
        "-epicportal",
        "-epicenv=prod",
        "-epicsandboxid=fn",
        "-nobe",
        "-backend=127.0.0.1:3551",
        "-fromfl=eac",
        "-epicapp=Fortnite",
        "-epiclocale=en-us",
        "-fltoken=3db3ba5dcbd2e16703f3978d",
        &auth_login_arg,
        &auth_password_arg,
        "-AUTH_TYPE=epic",
        "-caldera=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiYmU5ZGE1YzJmYmVhNDQwN2IyZjQwZWJhYWQ4NTlhZDQiLCJnZW5lcmF0ZWQiOjE2Mzg3MTcyNzgsImNhbGRlcmFHdWlkIjoiMzgxMGI4NjMtMmE2NS00NDU3LTliNTgtNGRhYjNiNDgyYTg2IiwiYWNQcm92aWRlciI6IkVhc3lBbnRpQ2hlYXQiLCJub3RlcyI6IiIsImZhbGxiYWNrIjpmYWxzZX0.VAWQB67RTxhiWOxx7DBjnzDnXyyEnX7OljJm-j2d88G_WgwQ9wrE6lwMEHZHjBd1ISJdUO1UVUqkfLdU5nofBQ",
    ];

    let eac_proc = launch_process(&fn_eac, &common_args)?;
    let (_eac_threads_suspended, eac_err) = utilities::suspend_process(eac_proc.id());
    if eac_err {
        eprintln!("Warning: Failed to suspend one or more EAC threads");
    }

    let be_proc = launch_process(&fn_be, &common_args)?;
    let (_be_threads_suspended, be_err) = utilities::suspend_process(be_proc.id());
    if be_err {
        eprintln!("Warning: Failed to suspend one or more BE threads");
    }

    let fn_proc = launch_process(&fn_normal, &common_args)?;

    utilities::inject_dll(
        fn_proc.id(),
        dll_path
            .to_str()
            .ok_or("Failed to convert DLL path to string")?,
    )?;

    thread::sleep(Duration::from_secs(5));

    Ok(())
}
