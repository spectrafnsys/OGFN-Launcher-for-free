import { Window } from "@tauri-apps/api/window";
import { Minus, X } from "lucide-react";

export function Frame() {
  return (
    <>
      <div
        data-tauri-drag-region
        className="w-full p-1 px-2 absolute top-0 flex items-center justify-between flex-row bg-transparent"
      >
        <div className="flex w-full relative" />
        <div className="flex flex-row gap-1 items-center justify-center px-1 pt-1 pb-1">
          <WindowOption
            Icon={Minus}
            onClick={() => {
              new Window("main").minimize();
            }}
          />
          <WindowOption
            Icon={X}
            onClick={() => {
              new Window("main").close();
            }}
          />
        </div>
      </div>
    </>
  );
}

function WindowOption({ Icon, onClick }: { Icon: any; onClick: () => void }) {
  return (
    <div
      className="flex flex-row gap-2 p-2 hover:bg-gray-800 transition-all rounded-lg items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <div className="w-4 h-4 text-white">
        <Icon size={16} />
      </div>
    </div>
  );
}
