"use client";
import { motion } from "framer-motion";

interface GreetingProps {
  username: string;
  skinImageUrl?: string;
}

export function Greeting({ username, skinImageUrl = "" }: GreetingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-stone-950 border border-stone-800 text-white rounded-lg h-24 flex items-center justify-start shadow-sm relative overflow-visible"
    >
      <div className="relative w-auto h-23 flex-shrink-0 ml-2 mr-3">
        <img
          src={skinImageUrl}
          alt={username}
          className="w-full h-full object-contain rounded-md shadow-lg"
          draggable={false}
        />
      </div>

      <div className="pt-4 pb-4">
        <h2 className="text-xl font-semibold mb-1">Ahoy, {username}!</h2>
        <p className="text-sm text-gray-400">Glad to see you playing Luna.</p>
      </div>
    </motion.div>
  );
}
