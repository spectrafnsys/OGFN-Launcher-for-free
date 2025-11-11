"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Loader2,
  Play,
  Settings,
  Trash2,
  FolderOpen,
  Lock,
} from "lucide-react";
import { handleAddBuild } from "@/helpers/import";
import { STORAGE_CONFIG } from "@/stores/build";
import { handleLaunchBuild } from "@/helpers/launch";
import { handleCloseBuild } from "@/helpers/close";
import { Config } from "@/exports/exports";

export function Library() {
  const [importedBuilds, setImportedBuilds] = useState<[string, any][]>([]);
  const [importing, setImporting] = useState(false);
  const [options, setShowOptions] = useState<string | null>(null);

  useEffect(() => {
    const savedBuilds = JSON.parse(
      localStorage.getItem(STORAGE_CONFIG.build.key) || "[]"
    );
    setImportedBuilds(savedBuilds);
  }, []);

  const handleImport = async () => {
    setImporting(true);
    await handleAddBuild();
    const builds = JSON.parse(
      localStorage.getItem(STORAGE_CONFIG.build.key) || "[]"
    );
    setImportedBuilds(builds);
    setImporting(false);
  };

  const handleDeleteBuild = (pathToDelete: string) => {
    const updatedBuilds = importedBuilds.filter(
      ([path]) => path !== pathToDelete
    );
    localStorage.setItem(
      STORAGE_CONFIG.build.key,
      JSON.stringify(updatedBuilds)
    );
    setImportedBuilds(updatedBuilds);
    setShowOptions(null);
  };

  const getBuildImages = () => {
    const images = {
      "14": "https://www.nme.com/wp-content/uploads/2020/08/082720-Fortnite-Season-4-Nexus-War-YouTube.jpg",
      "13": "https://sm.ign.com/t/ign_nordic/video/f/fortnite-c/fortnite-chapter-2-season-3-battle-pass-gameplay-trailer_e7dc.1200.jpg",
      "12": "https://assets1.ignimgs.com/thumbs/userUploaded/2020/2/20/fortnite-battlepass-chapter-2-season-2-blog-thumb-1582190454248.jpg",
      "11": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQxHgCiZMuC7T-fLwdrbbDvq6vAfo3w4SKY3wEAnyIEPUw7XPmBVnFgXY286G5AI2naLI&usqp=CAU",
      "10": "https://assetsio.gnwcdn.com/fortnite-season-10-battle-pass-skins-changes-6003-1564646875464.jpg?width=1200&height=630&fit=crop&enable=upscale&auto=png",
      "9": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQT4AqzH-IYvr2XbLSIMfOzQX1ulJ-BL0xfw&s",
      "8": "https://cdn2.unrealengine.com/Fortnite%2Fblog%2Fseason-8%2FBR08_News_Featured_Launch_ScreenKeyArt_Announce-1920x1080-f831323339109ab3c6a8d9e4c670f1973b8796d0.jpg",
      "7": "https://cdn2.unrealengine.com/Fortnite%2Fpatch-notes%2Fv7-00%2Fheader-v7-00%2FPATCH-BR07_News_Featured_16_9-1920x1080-cffcaf5bb2ed63854673855b592e167e7e817360.jpg",
      "6": "https://cdn2.unrealengine.com/Fortnite%2Fpatch-notes%2Fv6-00%2Fbr-header-v6-00%2FBR06_News_Featured_16_9_ReleaseNotes-1920x1080-9a66a68e6061577160f354858e3e13d80eda6886.jpg",
      "5": "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/a/ae/S3mapchange8.png?width=1280",
      "4": "https://i.ytimg.com/vi/FRQw8Vqmve8/maxresdefault.jpg",
      "3": "https://static.wikia.nocookie.net/fortnite/images/9/9f/Season_3_Battle_Pass_skins.jpg/revision/latest/scale-to-width/360?cb=20211127171403",
      "15": "https://assetsio.gnwcdn.com/desert-coliseum.jpg?width=1200&height=630&fit=crop&enable=upscale&auto=png",
      "16": "https://static1.srcdn.com/wordpress/wp-content/uploads/2021/03/Fortnite-Season-6-Battle-Pass-Characters-1.jpg",
      "17": "https://cdn.mos.cms.futurecdn.net/FnGEJtCKmFSFot4d7DoR9Z.jpeg",
      "18": "https://cdn2.unrealengine.com/s18-ss-cinematic-1920x1080-01-1920x1080-26b0af26e89b.jpg",
      "19": "https://cdn2.unrealengine.com/fortnite-chapter-3-season-1-flipped-3840x2160-27429dc20c19.jpg",
      "20": "https://cdn.shopify.com/s/files/1/0556/5795/5430/articles/fortnite-chapter-3-season-2-overview-page-key-art-bg-1920x1080-080c6c393c60.jpg?v=1712937377",
      "21": "https://staticg.sportskeeda.com/editor/2022/06/010a7-16544364228602-1920.jpg",
      "22": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVYBl3trRJVmN2YxAFVMamB5c-MwXZQ82Rkg&s",
      "23": "https://cdn2.unrealengine.com/unreal-engine-5-1-features-for-fortnite-chapter-4-header-1920x1080-2e96869442d6.jpg?resize=1&w=1920",
      "24": "https://oyster.ignimgs.com/mediawiki/apis.ign.com/fortnite/4/4e/Fortnite_Mega_City_Teaser.JPG?width=640",
      "25": "https://wallpapercave.com/wp/wp12405940.jpg",
      "26": "https://www.dexerto.com/cdn-image/wp-content/uploads/2023/08/25/Fortnite-Chapter-4-Season-4-map-changes-2.jpg?width=1200&quality=60&format=auto",
    };

    return images;
  };

  return (
    <div className="h-full overflow-hidden">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="h-full flex flex-col p-6"
      >
        <div className="flex-shrink-0 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FolderOpen size={24} className="text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Library</h1>
                <p className="text-sm text-stone-400">
                  Manage your Fortnite builds
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-stone-400">
                  {importedBuilds.length > 0
                    ? `${importedBuilds.length} Build${
                        importedBuilds.length !== 1 ? "s" : ""
                      }`
                    : "No builds imported"}
                </p>
              </div>
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors duration-200 font-medium cursor-pointer"
              >
                {importing ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Plus size={18} />
                )}
                {importing ? "Importing..." : "Import Build"}
              </button>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent" />
        </div>

        <div className="flex-1 min-h-0">
          {importedBuilds.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 bg-stone-800/50 rounded-full mb-4">
                <FolderOpen size={48} className="text-stone-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No builds imported yet
              </h3>
              <p className="text-stone-400 mb-6 max-w-md">
                Import your first Fortnite build to get started. Click the
                "Import Build" button above to begin.
              </p>
            </div>
          ) : (
            <div className="h-full">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 auto-rows-max">
                {importedBuilds
                  .sort(([, a], [, b]) => {
                    if (a.version === "24.20") return -1;
                    if (b.version === "24.20") return 1;
                    return 0;
                  })
                  .map(([path, build]) => {
                    const majorVersion = build.version.split(
                      "."
                    )[0] as keyof ReturnType<typeof getBuildImages>;
                    const imageUrl = getBuildImages()[majorVersion];
                    const isPublicBuild = build.version === Config.BUILD;

                    return (
                      <motion.div
                        key={path}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-stone-700/50 group w-full max-w-sm mx-auto"
                      >
                        <div className="relative">
                          {imageUrl && (
                            <div className="relative rounded-t-xl overflow-hidden">
                              <img
                                src={imageUrl}
                                alt={`Build ${build.version}`}
                                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                              <div className="absolute top-3 right-3">
                                <button
                                  onClick={() =>
                                    setShowOptions(
                                      options === path ? null : path
                                    )
                                  }
                                  className="p-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20 cursor-pointer"
                                >
                                  <Settings size={16} className="text-white" />
                                </button>

                                {options === path && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-12 right-0 bg-stone-900/95 backdrop-blur-sm border border-stone-700/50 rounded-lg p-1 min-w-[120px] shadow-xl z-20"
                                  >
                                    <button
                                      onClick={() => handleDeleteBuild(path)}
                                      className="w-full flex items-center gap-2 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-all duration-200 text-sm cursor-pointer"
                                    >
                                      <Trash2 size={14} />
                                      Delete
                                    </button>
                                  </motion.div>
                                )}
                              </div>

                              <div className="absolute top-3 left-3">
                                {isPublicBuild ? (
                                  <span className="text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm px-2 py-1 rounded-md">
                                    Public Build
                                  </span>
                                ) : (
                                  <span className="text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30 backdrop-blur-sm px-2 py-1 rounded-md">
                                    Alternative
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <div className="mb-3">
                            <h3 className="text-lg font-bold text-white mb-1">
                              Version {build.version}
                            </h3>
                            <p className="text-xs text-stone-400 font-mono">
                              {build.real.replace(`${build.version}-`, "")}
                            </p>
                          </div>

                          <button
                            onClick={async () => {
                              if (!isPublicBuild) return;

                              if (build.open) {
                                const result = await handleCloseBuild(path);
                                if (result) {
                                  setImportedBuilds((prevBuilds) =>
                                    prevBuilds.map(([prevPath, prevBuild]) =>
                                      prevPath === path
                                        ? [
                                            prevPath,
                                            { ...prevBuild, open: false },
                                          ]
                                        : [prevPath, prevBuild]
                                    )
                                  );
                                }
                              } else {
                                const result = await handleLaunchBuild(path);
                                if (result) {
                                  setImportedBuilds((prevBuilds) =>
                                    prevBuilds.map(([prevPath, prevBuild]) =>
                                      prevPath === path
                                        ? [
                                            prevPath,
                                            { ...prevBuild, open: true },
                                          ]
                                        : [prevPath, prevBuild]
                                    )
                                  );
                                }
                              }
                            }}
                            disabled={!isPublicBuild}
                            className={`w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 px-4 rounded-lg transition-all duration-200 ${
                              build.isRunning
                                ? "bg-stone-700/50 text-stone-500 border border-stone-600/50 cursor-not-allowed"
                                : !isPublicBuild
                                ? "bg-red-600/20 text-red-400 border border-red-500/30 cursor-not-allowed"
                                : build.open
                                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300 border border-purple-500/30 hover:border-purple-500/50 cursor-pointer"
                                : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300 border border-purple-500/30 hover:border-purple-500/50 cursor-pointer"
                            }`}
                          >
                            {!isPublicBuild ? (
                              <>
                                <Lock size={16} />
                                Unavailable
                              </>
                            ) : build.open ? (
                              <>
                                <Play size={16} />
                                Launch Build
                              </>
                            ) : (
                              <>
                                <Play size={16} />
                                Launch Build
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </motion.main>
    </div>
  );
}
