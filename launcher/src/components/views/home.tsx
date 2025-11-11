import { motion } from "framer-motion";
import { News } from "@/components/home/news";
import { SmallShop } from "@/components/home/smallShop";
import { Greeting } from "../home/greet";
import { Donate } from "../home/donate";
import { ClaimVBucks } from "../home/vbucks";

export function Home() {
  const authUserString = localStorage.getItem("authUser");
  const authUser = authUserString ? JSON.parse(authUserString) : null;
  const username = authUser?.username || "Why dont you have an account bro";
  const profile = authUser?.favorite_character;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
          },
        },
      }}
      exit={{ opacity: 0, y: 30, scale: 0.9 }}
    >
      <div className="gap-4 flex flex-col mb-2">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <Greeting
            username={username}
            skinImageUrl={`https://fortnite-api.com/images/cosmetics/br/${profile}/icon.png`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <News />
        </motion.div>

        <div className="h-1 w-full bg-stone-900 mt-2 mb-2 rounded-full" />
      </div>

      <div className="flex flex-row gap-2">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <SmallShop />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <ClaimVBucks />
        </motion.div>
      </div>
      <div className="h-1 w-full bg-stone-900 mt-2 mb-2 rounded-full" />
      <motion.div
        className="mt-2"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.2,
        }}
      >
        <Donate />
      </motion.div>
    </motion.div>
  );
}
