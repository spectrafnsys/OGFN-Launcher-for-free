import { Home, ShoppingCart, Library, Settings } from "lucide-react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeRoute = location.pathname;

  const navItems = [
    { route: "/app/home", icon: <Home size={20} /> },
    { route: "/app/library", icon: <Library size={20} /> },
    { route: "/app/shop", icon: <ShoppingCart size={20} /> },
    /*{
      route: "/app/leaderboard",
      icon: <Trophy size={20} />,
      label: "Leaderboard",
    },*/
    { route: "/app/settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-full max-w-18 h-screen bg-stone-950 text-white p-2 shadow-md flex flex-col items-center gap-1.5 select-none z-10">
      <img
        alt={"icon"}
        className={"h-15 object-cover rounded-xl"}
        src={"/mega color.png"}
      />
      {navItems.slice(0, 3).map(({ route, icon }) => (
        <NavIcon
          key={route}
          route={route}
          icon={icon}
          active={activeRoute === route}
          onClick={() => {
            navigate(route);
          }}
        />
      ))}

      <div className="h-full flex-1" />

      <NavIcon
        route="/app/settings"
        icon={<Settings size={20} />}
        active={activeRoute === "/app/settings"}
        onClick={() => navigate("/app/settings")}
      />
    </aside>
  );
}

function NavIcon({
  icon,
  active,
  onClick,
}: {
  route: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full h-10 flex items-center justify-center gap-2 px-3 text-center
        transition-colors duration-200 ease-in-out
        text-sm font-medium
        rounded-md
        focus:outline-none cursor-pointer border border-stone-800
        ${
          active
            ? "bg-stone-900 text-white"
            : "text-stone-400 hover:bg-stone-800 hover:text-white"
        }
      `}
    >
      {icon}
    </button>
  );
}
