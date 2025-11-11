// deepLinkListener.ts
import { listen, UnlistenFn } from "@tauri-apps/api/event";

let unlisten: UnlistenFn | null = null;

export async function setupDeepLinkListener(
  callback: (payload: string) => void
) {
  if (unlisten) {
    console.log("[Auth] Listener already registered, skipping");
    return;
  }

  unlisten = await listen("tauri://uri", (event) => {
    const payload = event.payload as string;
    callback(payload);
  });
}

export function cleanupDeepLinkListener() {
  if (unlisten) {
    unlisten();
    unlisten = null;
    console.log("[Auth] Cleaning up deep link listener");
  }
}
