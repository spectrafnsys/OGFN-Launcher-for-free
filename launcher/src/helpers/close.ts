import { invoke } from "@tauri-apps/api/core";
import useBuilds, { Build } from "@/stores/build";

export const handleCloseBuild = async (path: string): Promise<boolean> => {
  await invoke("exit_all", {});
  const BuildState = useBuilds.getState();
  const selectedBuild: Build | undefined = BuildState.builds.get(path);
  if (!selectedBuild) {
    console.error("build not found in BuildState:", path);
    return false;
  }
  selectedBuild.open = false;
  BuildState.update(path, selectedBuild);

  return true;
};
