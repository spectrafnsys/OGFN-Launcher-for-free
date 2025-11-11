"use client";
import useBuilds, { Build } from "@/stores/build";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useAuth } from "@/stores/user";
import { sendNotification } from "@tauri-apps/plugin-notification";

const appWindow = getCurrentWebviewWindow();

export const handleLaunchBuild = async (path: string): Promise<boolean> => {
  const BuildState = useBuilds.getState();
  const authState = useAuth.getState();

  try {
    const selectedBuild: Build | undefined = BuildState.builds.get(path);
    if (!selectedBuild) {
      console.error("build not found in BuildState:", path);
      return false;
    }

    if (!authState.user) {
      console.error("user not authenticated");
      return false;
    }

    const actual = path.replace("/", "\\");
    const exe = `${actual}\\FortniteGame\\Binaries\\Win64`;
    const valid = await invoke("check_file_exists", { path: exe });

    if (!valid) {
      console.error(
        "build is invalid and was about to be launched:",
        selectedBuild.version
      );
      return false;
    }

    await invoke("start_mega", {
      filePath: exe,
      email: authState.user.email,
      password: authState.user.password,
    });

    appWindow.minimize();
    sendNotification({
      title: "Launching Game",
      body: "Game is now launching. If this is your first time launching, it may take a bit!",
    });
  } catch (error) {
    console.error("error launching build:", error);
    return false;
  }

  return true;
};
