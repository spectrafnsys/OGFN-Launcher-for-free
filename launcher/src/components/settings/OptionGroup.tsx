import { motion } from "framer-motion";
import { Option } from "./Option";
import { LucideIcon } from "lucide-react";

interface OptionData {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  defaultValue: boolean;
}

interface OptionGroupProps {
  title: string;
  description: string;
  options: OptionData[];
}

export function OptionGroup({ title, description, options }: OptionGroupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-xl p-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
        <p className="text-sm text-stone-400">{description}</p>
      </div>

      <div className="space-y-4">
        {options.map((option, index) => (
          <Option
            key={option.id}
            {...option}
            isLast={index === options.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
}
