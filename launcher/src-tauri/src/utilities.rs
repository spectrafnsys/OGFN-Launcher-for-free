use std::{
    ffi::CString,
    fs,
    io::Write,
    path::{Path, PathBuf},
};
use winapi::um::tlhelp32::{
    CreateToolhelp32Snapshot, Thread32First, Thread32Next, TH32CS_SNAPTHREAD, THREADENTRY32,
};
use winapi::um::winnt::HANDLE;
use winapi::um::winnt::THREAD_SUSPEND_RESUME;
use winapi::um::{handleapi::CloseHandle, memoryapi::VirtualFreeEx};
use winapi::um::{
    processthreadsapi::{OpenThread, SuspendThread},
    winnt::{
        PROCESS_CREATE_THREAD, PROCESS_QUERY_INFORMATION, PROCESS_VM_OPERATION, PROCESS_VM_READ,
        PROCESS_VM_WRITE,
    },
};
use winapi::{
    shared::minwindef::{DWORD, FALSE, LPVOID},
    um::{
        libloaderapi::{GetModuleHandleA, GetProcAddress},
        memoryapi::VirtualAllocEx,
        processthreadsapi::{CreateRemoteThread, OpenProcess},
        synchapi::WaitForSingleObject,
        winbase::INFINITE,
        winnt::{MEM_COMMIT, MEM_RELEASE, MEM_RESERVE, PAGE_EXECUTE_READWRITE},
    },
};
use windows::core::PCSTR;
use windows::Win32::{
    Foundation::HWND,
    UI::{Shell::ShellExecuteA, WindowsAndMessaging::SW_HIDE},
};

#[tauri::command]
pub fn exit_all() -> Result<(), String> {
    let fortnite_procs = [
        "EpicgamesLauncher.exe",
        "FortniteLauncher.exe",
        "FortniteClient-Win64-Shipping.exe",
        "EasyAntiCheat_EOS.exe",
        "EpicWebHelper.exe",
        "FortniteClient-Win64-Shipping_BE.exe",
        "FortniteClient-Win64-Shipping_EAC.exe",
    ];

    let batch_path = std::env::temp_dir().join("close.bat");

    let mut file = std::fs::File::create(&batch_path)
        .map_err(|e| format!("Failed to create batch file: {}", e))?;

    let mut write_line =
        |line: &str| writeln!(file, "{}", line).map_err(|e| format!("Write error: {}", e));

    write_line("@echo off")?;
    for proc in &fortnite_procs {
        write_line(&format!("taskkill /F /IM \"{}\" >nul 2>&1", proc))?;
    }
    write_line("del \"%~f0\"")?;
    drop(file);

    let path_str = batch_path
        .to_str()
        .ok_or("Failed to convert batch path to string")?;
    let path_cstr = CString::new(path_str).map_err(|e| format!("CString error: {}", e))?;

    let hwnd = HWND(std::ptr::null_mut());

    let result = unsafe {
        ShellExecuteA(
            hwnd,
            PCSTR(b"runas\0".as_ptr()),
            PCSTR(path_cstr.as_ptr() as *const u8),
            PCSTR::null(),
            PCSTR::null(),
            SW_HIDE,
        )
    };

    if result.0 as isize <= 32 {
        return Err("Failed to launch batch file with elevated permissions".into());
    }

    Ok(())
}

pub fn handle_game_dll_path(game_path: &Path) -> PathBuf {
    game_path.parent().unwrap().parent().unwrap().join(
        "Engine\\Binaries\\ThirdParty\\NVIDIA\\NVaftermath\\Win64\\GFSDK_Aftermath_Lib.x64.dll",
    )
}

pub fn remove_game_dll_sync(game_path: &Path) -> Result<(), String> {
    let game_dll_path = handle_game_dll_path(game_path);

    loop {
        match std::fs::remove_file(&game_dll_path) {
            Ok(_) => break,
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => break,
            Err(_) => std::thread::sleep(std::time::Duration::from_millis(100)),
        }
    }
    Ok(())
}

#[tauri::command]
pub fn remove_client_dll_sync(client_dll_path: &Path) -> Result<(), String> {
    loop {
        match std::fs::remove_file(&client_dll_path) {
            Ok(_) => break,
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => break,
            Err(_) => std::thread::sleep(std::time::Duration::from_millis(100)),
        }
    }
    Ok(())
}

#[tauri::command]
pub fn download_file(url: &str, dest: &str) -> Result<(), String> {
    let response = reqwest::blocking::get(url).map_err(|e| e.to_string())?;
    let mut file = fs::File::create(dest).map_err(|e| e.to_string())?;
    let content = response.bytes().map_err(|e| e.to_string())?;
    file.write_all(&content).map_err(|e| e.to_string())?;
    Ok(())
}

// https://www.reddit.com/r/rust/comments/xu2hiw/comment/iqtrpb5
#[tauri::command]
pub fn suspend_process(pid: u32) -> (u32, bool) {
    unsafe {
        let mut has_err = false;
        let mut count: u32 = 0;

        let te: &mut THREADENTRY32 = &mut std::mem::zeroed();
        (*te).dwSize = std::mem::size_of::<THREADENTRY32>() as u32;

        let snapshot: HANDLE = CreateToolhelp32Snapshot(TH32CS_SNAPTHREAD, 0);

        if Thread32First(snapshot, te) == 1 {
            loop {
                if pid == (*te).th32OwnerProcessID {
                    let tid = (*te).th32ThreadID;

                    let thread: HANDLE = OpenThread(THREAD_SUSPEND_RESUME, FALSE, tid);
                    has_err |= SuspendThread(thread) as i32 == -1i32;

                    CloseHandle(thread);
                    count += 1;
                }

                if Thread32Next(snapshot, te) == 0 {
                    break;
                }
            }
        }

        CloseHandle(snapshot);

        (count, has_err)
    }
}

#[tauri::command]
pub fn inject_dll(pid: u32, dll_path: &str) -> Result<(), String> {
    println!(
        "[inject_dll] called with pid: {}, dll_path: {}",
        pid, dll_path
    );

    unsafe {
        let dll_path = std::path::Path::new(dll_path);
        let dll_path = match dll_path.canonicalize() {
            Ok(p) => {
                println!("[inject_dll] Canonicalized DLL path: {:?}", p);
                p
            }
            Err(e) => {
                let err = format!("[inject_dll] DLL path canonicalize error: {}", e);
                println!("{}", err);
                return Err(err);
            }
        };
        let dll_path_str = match dll_path.to_str() {
            Some(s) => s,
            None => {
                let err = "[inject_dll] DLL path is not valid UTF-8".to_string();
                println!("{}", err);
                return Err(err);
            }
        };
        println!("[inject_dll] DLL path as str: {}", dll_path_str);

        let h_process = OpenProcess(
            PROCESS_CREATE_THREAD
                | PROCESS_QUERY_INFORMATION
                | PROCESS_VM_OPERATION
                | PROCESS_VM_WRITE
                | PROCESS_VM_READ,
            0,
            pid,
        );
        if h_process.is_null() {
            let err = format!(
                "[inject_dll] Failed to open process. WinError: {}",
                std::io::Error::last_os_error()
            );
            println!("{}", err);
            return Err(err);
        }
        println!("[inject_dll] Opened process handle: {:?}", h_process);

        let dll_path_c = match CString::new(dll_path_str) {
            Ok(c) => c,
            Err(_) => {
                let err = "[inject_dll] Failed to create CString from DLL path".to_string();
                println!("{}", err);
                return Err(err);
            }
        };
        println!("[inject_dll] Created CString for DLL path");

        let dll_path_ptr = VirtualAllocEx(
            h_process,
            std::ptr::null_mut(),
            dll_path_c.as_bytes_with_nul().len(),
            MEM_COMMIT | MEM_RESERVE,
            PAGE_EXECUTE_READWRITE,
        );
        if dll_path_ptr.is_null() {
            let err = "[inject_dll] Failed to allocate memory in target process".to_string();
            println!("{}", err);
            return Err(err);
        }
        println!("[inject_dll] Allocated memory at: {:?}", dll_path_ptr);

        let write_result = winapi::um::memoryapi::WriteProcessMemory(
            h_process,
            dll_path_ptr,
            dll_path_c.as_ptr() as _,
            dll_path_c.as_bytes_with_nul().len(),
            std::ptr::null_mut(),
        );
        if write_result == 0 {
            let err = format!(
                "[inject_dll] Failed to write DLL path to process memory: {}",
                std::io::Error::last_os_error()
            );
            println!("{}", err);
            return Err(err);
        }
        println!("[inject_dll] Wrote DLL path to process memory");

        let kernel32_c = CString::new("kernel32.dll").unwrap();
        let h_kernel32 = GetModuleHandleA(kernel32_c.as_ptr());
        if h_kernel32.is_null() {
            let err = "[inject_dll] Failed to get kernel32.dll handle".to_string();
            println!("{}", err);
            return Err(err);
        }
        println!("[inject_dll] Got kernel32.dll handle: {:?}", h_kernel32);

        let load_library_c = CString::new("LoadLibraryA").unwrap();
        let h_load_library = GetProcAddress(h_kernel32, load_library_c.as_ptr());
        if h_load_library.is_null() {
            let err = "[inject_dll] Failed to get LoadLibraryA address".to_string();
            println!("{}", err);
            return Err(err);
        }
        println!(
            "[inject_dll] Got LoadLibraryA address: {:?}",
            h_load_library
        );

        let thread_handle = CreateRemoteThread(
            h_process,
            std::ptr::null_mut(),
            0,
            Some(std::mem::transmute::<
                _,
                unsafe extern "system" fn(LPVOID) -> u32,
            >(h_load_library)),
            dll_path_ptr,
            0,
            std::ptr::null_mut(),
        );
        if thread_handle.is_null() {
            let err = format!(
                "[inject_dll] Failed to create remote thread: {}",
                std::io::Error::last_os_error()
            );
            println!("{}", err);
            return Err(err);
        }
        println!("[inject_dll] Created remote thread: {:?}", thread_handle);

        let wait_res = WaitForSingleObject(thread_handle, 10_000);
        if wait_res != 0 {
            let err = "[inject_dll] Waiting for remote thread failed or timed out".to_string();
            println!("{}", err);
            return Err(err);
        }
        println!("[inject_dll] Remote thread finished execution");

        VirtualFreeEx(h_process, dll_path_ptr, 0, MEM_RELEASE);
        winapi::um::handleapi::CloseHandle(thread_handle);
        winapi::um::handleapi::CloseHandle(h_process);
        println!("[inject_dll] Freed allocated memory and closed handles");
        println!("[inject_dll] DLL injection completed successfully");
    }

    Ok(())
}
