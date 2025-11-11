import "./App.css";
import { Frame } from "@/components/core/frame";
import { Sidebar } from "@/components/core/sidebar";
import { Auth } from "@/components/views/credentials";
import { Home } from "@/components/views/home";
import { Library } from "@/components/views/library";
import { Settings } from "@/components/views/settings";
import { Shop } from "@/components/views/shop.tsx";
import { Routes, Route } from "react-router-dom";
import { Background } from "./components/core/background";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      setLoggedIn(true);
    }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <main className="bg-[#000000] text-white min-h-screen min-w-screen flex overflow-hidden">
        <Background mousePosition={mousePosition} />

        {!isLoggedIn ? (
          <div className="flex-1 relative">
            <Frame />
            <div className="p-4 flex items-center justify-center w-full h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/app/creds" element={<Auth />} />
                  <Route path="*" element={<Navigate to={"/app/creds"} />} />
                </Routes>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <>
            <Sidebar />
            <div className="flex-1 relative">
              <Frame />
              <div className="pt-12 p-4 z-0 overflow-hidden">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route
                      path="/app/creds"
                      element={<Navigate to="/app/home" />}
                    />
                    <Route path="/app/home" element={<Home />} />
                    <Route path="/app/library" element={<Library />} />
                    <Route path="/app/settings" element={<Settings />} />
                    <Route path="/app/shop" element={<Shop />} />
                    <Route path="*" element={<Navigate to={"/app/home"} />} />
                  </Routes>
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </main>
    </AnimatePresence>
  );
}

export default App;
