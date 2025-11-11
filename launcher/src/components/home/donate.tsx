"use client";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export function Donate() {
  const handleClick = () => {
    window.open(
      "https://megahosting.mysellauth.com",
      "_blank",
      "noopener noreferrer"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      className="w-full cursor-pointer bg-gradient-to-r from-purple-700 via-pink-700 to-red-700
        border border-transparent rounded-lg h-20 flex items-center justify-between shadow-lg
        hover:from-pink-700 hover:via-red-700 hover:to-yellow-600
        transition-colors duration-300 ease-in-out
        select-none
        px-6"
    >
      <div className="text-white">
        <h2 className="text-2xl font-bold">Donate to Luna</h2>
        <p className="text-sm opacity-90">
          Help contribute to Luna by donating!
        </p>
      </div>
      <ExternalLink size={30} />
    </motion.div>
  );
}
