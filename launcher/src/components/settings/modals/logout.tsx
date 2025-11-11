import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-stone-900/95 backdrop-blur-sm border border-stone-700/50 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <LogOut size={20} className="text-red-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Logout</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-stone-800/50 rounded-md transition-colors cursor-pointer"
              >
                <X size={20} className="text-stone-400" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-stone-300 mb-2">
                Are you sure you want to log out?
              </p>
              <p className="text-sm text-stone-400">
                You'll need to sign in again to access your builds and settings.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-stone-700/50 hover:bg-stone-700/70 text-stone-300 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
