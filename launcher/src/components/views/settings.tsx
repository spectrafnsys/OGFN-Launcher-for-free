import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, LogOut, Minimize } from "lucide-react";
import { OptionGroup } from "../settings/OptionGroup";
import { LogoutModal } from "../settings/modals/logout";

export function Settings() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /*const generalOptions = [
    {
      id: "minimizeOnLaunch",
      label: "Minimize on Launch",
      description: "Minimizes Luna when you launch an install",
      icon: Minimize,
      defaultValue: true,
    },
  ];*/

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("authUser");
    setShowLogoutModal(false);
    window.location.reload();
  };

  return (
    <>
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
                <div className="p-2 bg-transparent rounded-lg">
                  <SettingsIcon size={24} className="text-stone-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Settings</h1>
                  <p className="text-sm text-stone-400">
                    Manage the Luna Launcher
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-200 font-medium cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent" />
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-8 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-xl p-6"
              >
                <div className="flex flex-row gap-4">
                  <img
                    className="object-contain max-h-15"
                    src="/mega color.png"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      Luna Launcher
                    </h2>
                    <p className="text-sm text-stone-400">
                      Launcher made with 💖 by Abstract
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.main>
      </div>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}
