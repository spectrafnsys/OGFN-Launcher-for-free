"use client";

import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { convertFileSrc } from "@tauri-apps/api/core";
import useBuilds from "@/stores/build";
import { sendNotification } from "@tauri-apps/plugin-notification";

export const handleAddBuild = async () => {
  const buildState = useBuilds.getState();
  try {
    const selectedPath = await open({ directory: true, multiple: false });

    if (!selectedPath) {
      return null;
    }

    const splash = `${selectedPath}\\FortniteGame\\Content\\Splash\\Splash.bmp`;
    const exe = `${selectedPath}\\FortniteGame\\Binaries\\Win64\\FortniteClient-Win64-Shipping.exe`;

    const splashExists = await invoke("check_file_exists", { path: splash });

    let version = "Unknown Version";
    let release = "Unknown CL";

    const hexCheck = (await invoke("search_for_version", {
      path: exe,
    })) as string[];

    let foundMatch = false;
    for (const str of hexCheck) {
      const match = str.match(/\+\+Fortnite\+Release-(\d+\.\d+|Cert)-CL-(\d+)/);
      if (match && !str.includes("Live") && !str.includes("Cert")) {
        version = match[1];
        if (
          version.split(".")[0].length === 2 &&
          version.split(".")[1].length === 1
        ) {
          version += "0";
        }
        release = `${version}-CL-${match[2]}`;
        foundMatch = true;
        break;
      } else if (
        (match && str.includes("Live")) ||
        (match && str.includes("Cert"))
      ) {
        if (match) {
          switch (parseInt(match[2])) {
            case 3870737: {
              version = "2.4.2";
              release = "2.4.2-CL-3870737";
              foundMatch = true;
              break;
            }
            case 3858292: {
              version = "2.4";
              release = "2.4-CL-3858292";
              foundMatch = true;
              break;
            }
            case 3847564: {
              version = "2.3";
              release = "2.3-CL-3847564";
              foundMatch = true;
              break;
            }
            case 3841827: {
              version = "2.2";
              release = "2.2-CL-3841827";
              foundMatch = true;
              break;
            }
            case 3825894: {
              version = "2.1";
              release = "2.1-CL-3825894";
              foundMatch = true;
              break;
            }
            case 3807424: {
              version = "1.11";
              release = "1.11-CL-3807424";
              foundMatch = true;
              break;
            }
            case 3790078: {
              version = "1.10";
              release = "1.10-CL-3790078";
              foundMatch = true;
              break;
            }
            case 3775276: {
              version = "1.91";
              release = "1.91-CL-3775276";
              foundMatch = true;
              break;
            }
            case 3757339: {
              version = "1.9";
              release = "1.9-CL-3757339";
              foundMatch = true;
              break;
            }
            case 3729133: {
              version = "1.8.1";
              release = "1.81-CL-3729133";
              foundMatch = true;
              break;
            }
            case 3724489: {
              version = "1.8";
              release = "1.8-CL-3724489";
              foundMatch = true;
              break;
            }
            case 3700114: {
              version = "1.7.2";
              release = "1.72-CL-3700114";
              foundMatch = true;
              break;
            }
            case 3541083: {
              version = "1.2";
              release = "1.2-CL-3541083";
              foundMatch = true;
              break;
            }
            case 3532353: {
              version = "1.0";
              release = "1.0-CL-3532353";
              foundMatch = true;
              break;
            }
          }
          break;
        }
      }
    }
    const data = {
      splash: splashExists ? convertFileSrc(splash) : "no splash",
      path: selectedPath.toString(),
      version: version || "?",
      real: release || "Unknown Version",
      verified: true,
      open: false,
      loading: false,
    };

    if (version !== "24.20") {
      sendNotification({
        title: "Import Error",
        body: `Only version 24.20 builds are supported. Detected version: ${version}`,
      });
      return null;
    }

    buildState.add(selectedPath.toString(), data);
    console.log(foundMatch);
    return true;
  } catch (error) {
    console.error("Error adding build:", error);
    sendNotification({
      title: "Import Error",
      body: "Error adding build: " + error,
    });
  } finally {
  }
};
