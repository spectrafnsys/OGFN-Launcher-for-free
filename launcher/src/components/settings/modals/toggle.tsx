import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ToggleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  optionName: string;
  currentState: boolean;
}

export function ToggleModal({
  isOpen,
  onClose,
  onConfirm,
  optionName,
  currentState,
}: ToggleModalProps) {
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
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <AlertTriangle size={20} className="text-orange-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Confirm Change</h2>
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
                Are you sure you want to {currentState ? "disable" : "enable"}{" "}
                <span className="font-medium text-white">"{optionName}"</span>?
              </p>
              <p className="text-sm text-stone-400">
                This change will take effect immediately.
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
                className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                  currentState
                    ? "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30"
                    : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300 border border-purple-500/30"
                }`}
              >
                {currentState ? "Disable" : "Enable"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
