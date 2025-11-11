"use client";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useNavigate } from "react-router";

export function News() {
  const setView = useNavigate();

  function nav() {
    setView("/app/library");
  }
  const panelStyles =
    "relative flex-1 flex flex-col justify-between border border-stone-800 min-h-[220px] overflow-hidden rounded-xl";

  const overlayStyles = "absolute inset-0 bg-black/60 z-0";

  const contentStyles =
    "relative z-10 p-4 flex flex-col justify-between h-full";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col md:flex-row gap-4 text-white relative"
    >
      <div className={panelStyles}>
        <img
          src="/news2.png"
          alt="Welcome to Luna"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className={overlayStyles} />

        <div className={contentStyles}>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Luna</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Relive Chapter 4 Season 2 in 2025 using Luna!
            </p>
            <button
              onClick={() => nav()}
              className="p-2 py-2 absolute bottom-4 left-4 flex flex-row gap-2 cursor-pointer transition-all duration-300 hover:bg-stone-950/20 items-center justify-center bg-stone-900/20 backdrop-blur-2xl border border-stone-800 w-1/7 rounded-lg mt-2"
            >
              <Play size={20} /> Play Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
