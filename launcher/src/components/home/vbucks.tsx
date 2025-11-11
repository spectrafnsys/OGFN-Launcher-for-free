import { motion } from "framer-motion";
import { useState } from "react";

export function ClaimVBucks() {
  const [isClaimed, setIsClaimed] = useState(false);

  const handleClaim = (e: any) => {
    e.stopPropagation();
    if (isClaimed) return;

    setIsClaimed(true);
    setTimeout(() => setIsClaimed(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover="hover"
      transition={{ duration: 0.4, ease: "easeInOut" }}
      onClick={(e) => e.stopPropagation()}
      className="w-full h-64 rounded-xl cursor-pointer select-none shadow-2xl overflow-hidden relative group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClaim(e);
        }
      }}
      aria-label="Claim free V-Bucks"
    >
      <motion.div
        variants={{
          initial: {
            backgroundPosition: "0% 50%",
            filter: "blur(18px) brightness(0.8)",
          },
          hover: {
            backgroundPosition: "100% 50%",
            filter: "blur(18px) brightness(1.1)",
          },
        }}
        initial="initial"
        animate="initial"
        whileHover="hover"
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-purple-800 via-purple-600 to-purple-400 bg-[length:200%_200%]"
        style={{ zIndex: 0 }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />

      <motion.div
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.02 },
        }}
        className="relative z-10 flex flex-col justify-between h-full px-6 py-6 bg-stone-900/10 backdrop-blur-md rounded-xl"
      >
        <div className="flex items-center gap-8">
          <motion.div
            className="w-35 h-35 flex-shrink-0 rounded-md overflow-hidden"
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src="/vbucks.png"
              alt="V-Bucks"
              className="w-full h-full object-contain drop-shadow-lg"
              draggable={false}
            />
          </motion.div>
          <div className="flex flex-col flex-1 min-w-0">
            <motion.h2
              className="text-white text-3xl font-extrabold leading-tight overflow-hidden max-w-full"
              title="Claim Your Free V-Bucks!"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Claim Your Free V-Bucks!
            </motion.h2>
            <motion.p
              className="text-stone-300 mt-2 max-w-full text-base font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Don't miss out — boost your gameplay with free V-Bucks today.
              Instant claim, no hassle.
            </motion.p>
          </div>
        </div>

        <motion.button
          onClick={(e) => e.stopPropagation()}
          disabled={isClaimed}
          whileHover={{ scale: isClaimed ? 1 : 1.02 }}
          whileTap={{ scale: isClaimed ? 1 : 0.98 }}
          className={`
            mt-6 rounded-lg font-semibold py-3 px-6 w-full max-w-full 
            transition-all duration-300 cursor-not-allowed select-none
            relative overflow-hidden border text-center justify-center items-center flex
            ${
              isClaimed
                ? "" //"bg-green-600/90 border-green-500 text-white cursor-not-allowed backdrop-blur-xl"
                : "bg-stone-800/20 border-stone-700 text-white hover:bg-stone-800/40 backdrop-blur-2xl hover:border-stone-600"
            }
          `}
          aria-label={
            isClaimed
              ? "V-Bucks claimed successfully"
              : "Click to claim V-Bucks"
          }
        >
          {!isClaimed && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          )}

          <span className="relative z-10 flex items-center justify-center gap-2">
            {/*isClaimed ? (
              <>
                <span>
                  <Check size={20} />
                </span>
                Claimed!
              </>
            ) : (
              <>
                <span>
                  <Gift size={20} />
                </span>
                Claim
              </>
            )*/}
            Unavailable
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
