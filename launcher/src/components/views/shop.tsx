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

export function Shop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  useEffect(() => {
    if (!items.length) return;

    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items]);

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

  if (loading)
    return (
      <div className="h-72 flex items-center justify-center text-white text-lg">
        Loading...
      </div>
    );

  if (!items.length)
    return (
      <div className="h-72 flex items-center justify-center text-white text-lg">
        No items found.
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto p-6 space-y-8 text-white select-none"
    >
      <div className="flex items-center gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Item Shop</h2>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={items[featuredIndex].id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className={`relative rounded-2xl shadow-lg overflow-hidden max-h-100 bg-gradient-to-br ${getRarityGradient(
            items[featuredIndex].rarity.value
          )}`}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative flex flex-col md:flex-row items-center gap-6 p-8">
            <img
              src={
                items[featuredIndex].images.featured ||
                items[featuredIndex].images.icon
              }
              alt={items[featuredIndex].name}
              onError={(e) =>
                (e.currentTarget.src = items[featuredIndex].images.icon)
              }
              className="w-full md:w-96 object-contain rounded-xl drop-shadow-lg"
            />
            <div className="flex flex-col flex-grow space-y-3 text-white">
              <p className="uppercase font-semibold text-lg tracking-wide">
                {items[featuredIndex].rarity.displayValue}
              </p>
              <h3 className="text-4xl font-extrabold">
                {items[featuredIndex].name}
              </h3>
              <div className="flex items-center gap-3 text-2xl font-semibold">
                <img
                  src="https://image.fnbr.co/price/icon_vbucks_50x.png"
                  alt="V-Bucks"
                  className="w-8 h-8"
                />
                {items[featuredIndex].price}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div>
        <h3 className="mb-3 font-semibold text-xl ml-3">More Items</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 p-3">
          {items.map((item, i) => {
            const isActive = i === featuredIndex;
            return (
              <motion.div
                key={item.id}
                onClick={() => setFeaturedIndex(i)}
                whileHover={{ scale: 1.05 }}
                className={`flex-shrink-0 w-36 cursor-pointer rounded-xl border-2 ${
                  isActive
                    ? "border-blue-500 shadow-lg"
                    : "border-transparent hover:border-stone-500"
                } bg-stone-900/90 relative overflow-hidden`}
              >
                <img
                  src={item.images.icon}
                  alt={item.name}
                  onError={(e) => (e.currentTarget.src = item.images.icon)}
                  className="w-full h-36 object-contain p-2"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-2 text-xs text-white font-semibold">
                  {item.name}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
