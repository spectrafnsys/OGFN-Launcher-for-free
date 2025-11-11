"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShopItem {
  id: string;
  name: string;
  price: number;
  images: {
    featured?: string;
    icon: string;
  };
  rarity: {
    value: string;
    displayValue: string;
  };
}

export function SmallShop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchShop();
  }, []);

  useEffect(() => {
    if (!items.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items]);

  useEffect(() => {
    if (!items.length) return;

    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 100);

    return () => clearInterval(progressInterval);
  }, [index, items]);

  const fetchShop = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:3551/fortnite/api/storefront/v2/catalog"
      );
      const json = await res.json();
      const brStore = json.storefronts.find(
        (s: any) => s.name === "BRSeasonStorefront"
      );
      if (!brStore) return setLoading(false);

      const loaded: ShopItem[] = [];

      let selectedStores = json.storefronts.find(
        (s: any) => s.name === "BRSeasonStorefront"
      )?.catalogEntries;

      if (!selectedStores) {
        const daily = json.storefronts.find((s: any) => s.name === "BRDailyStorefront")?.catalogEntries || [];
        const weekly = json.storefronts.find((s: any) => s.name === "BRWeeklyStorefront")?.catalogEntries || [];
        selectedStores = [...daily, ...weekly];
      }

      if (!selectedStores || selectedStores.length === 0) {
        setLoading(false);
        return;
      }

      for (const entry of selectedStores) {
        const price = entry.prices?.[0]?.finalPrice;
        const id = entry.itemGrants?.[0]?.templateId?.split(":")[1];
        if (!price || !id) continue;

        try {
          const res = await fetch(`https://fortnite-api.com/v2/cosmetics/br/${id}`);
          const data = await res.json();
          if (data.status === 200) {
            loaded.push({
              id: data.data.id,
              name: data.data.name,
              price,
              images: {
                featured: data.data.images.featured,
                icon: data.data.images.icon,
              },
              rarity: data.data.rarity,
            });
          }
        } catch {}
      }

      setItems(loaded.slice(0, 6));
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "from-zinc-400 to-zinc-600";
      case "uncommon":
        return "from-lime-400 to-lime-600";
      case "rare":
        return "from-sky-400 to-sky-600";
      case "epic":
        return "from-fuchsia-500 to-fuchsia-700";
      case "legendary":
        return "from-amber-400 to-amber-600";
      case "mythic":
        return "from-yellow-300 to-yellow-500";
      default:
        return "from-neutral-500 to-neutral-700";
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full h-64 bg-stone-900 flex items-center justify-center rounded-lg min-w-75"
      >
        <span className="text-white text-sm">Loading shop...</span>
      </motion.div>
    );
  }

  if (!items.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full h-64 bg-stone-900 flex items-center justify-center rounded-lg min-w-75"
      >
        <span className="text-white text-sm">No items found.</span>
      </motion.div>
    );
  }

  const item = items[index];

  return (
    <AnimatePresence>
      <motion.div
        key="small-shop-wrapper"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative w-full h-64 bg-stone-900 rounded-lg border-stone-900 border overflow-hidden min-w-75"
      >
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${getRarityGradient(
            item.rarity.value
          )} opacity-20`}
          key={`bg-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 0.5 }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={`image-${index}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              src={item.images.featured || item.images.icon}
              alt={item.name}
              className="max-h-full max-w-full min-w-60 min-h-60"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = item.images.icon;
              }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
          <motion.div
            key={`info-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm uppercase font-semibold text-gray-200 mb-1">
              {item.rarity.displayValue}
            </p>
            <h3 className="text-xl font-bold">{item.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-300">
              <img
                src="https://image.fnbr.co/price/icon_vbucks_50x.png"
                alt="vb"
                className="w-4 h-4"
              />
              {item.price}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="w-full h-1 bg-stone-700">
            <motion.div
              className="h-full bg-white"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
