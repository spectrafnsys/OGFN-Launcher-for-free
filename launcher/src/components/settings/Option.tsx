import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { ToggleModal } from "./modals/toggle";

interface OptionProps {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  defaultValue: boolean;
  isLast?: boolean;
}

export function Option({
  label,
  description,
  icon: Icon,
  defaultValue,
  isLast,
}: OptionProps) {
  const [isEnabled, setIsEnabled] = useState(defaultValue);
  const [showToggleModal, setShowToggleModal] = useState(false);

  const handleToggle = () => {
    setShowToggleModal(true);
  };

  const confirmToggle = () => {
    setIsEnabled(!isEnabled);
    setShowToggleModal(false);
    console.log(`${label} ${!isEnabled ? "enabled" : "disabled"}`);
  };

  return (
    <>
      <div
        className={`flex items-center justify-between py-4 ${
          !isLast ? "border-b border-stone-800/50" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-stone-800/50 rounded-lg">
            <Icon size={18} className="text-stone-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">{label}</h3>
            <p className="text-sm text-stone-400">{description}</p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${
            isEnabled
              ? "bg-gradient-to-r from-purple-500 to-pink-500"
              : "bg-stone-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              isEnabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <ToggleModal
        isOpen={showToggleModal}
        onClose={() => setShowToggleModal(false)}
        onConfirm={confirmToggle}
        optionName={label}
        currentState={isEnabled}
      />
    </>
  );
}
