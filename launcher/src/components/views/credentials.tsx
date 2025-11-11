"use client";
import { useAuth } from "@/stores/user";
import { useState, useEffect } from "react";
import { Config } from "@/exports/exports";
import { Loader2, LogIn } from "lucide-react";
import { open } from "@tauri-apps/plugin-shell";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import {
  setupDeepLinkListener,
  cleanupDeepLinkListener,
} from "@/helpers/deepLinkListener";

export function Auth() {
  const [loading, setLoading] = useState(false);
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const authUser = localStorage.getItem("authUser");
        if (authUser) {
          const userData = JSON.parse(authUser);
          if (userData && userData.token) {
            console.log("[Auth] Found existing auth, navigating to app");
            navigate("/app/home");
            return;
          }
        }
      } catch (err) {
        console.error("[Auth] Error checking existing auth:", err);
      }
    };

    checkExistingAuth();
  }, []);

  useEffect(() => {
    setupDeepLinkListener(async (payload) => {
      console.log("[Auth] Deep link payload:", payload);

      if (!payload.startsWith("luna://")) return;

      const token = payload.replace("luna://", "");
      try {
        const decoded: any = jwtDecode(token);

        if (decoded?.type === "launcher") {
          login({
            discordId: decoded.discordId,
            email: decoded.email,
            username: decoded.username,
            password: decoded.password,
            vbucks: decoded.vbucks,
            favorite_character: decoded.favorite_character,
            role: decoded.role,
            accountId: decoded.accountId,
            token,
          });

          setLoading(false);
          navigate("/app/home");
        }
      } catch (err) {
        console.error("[Auth] Invalid token:", err);
        setLoading(false);
      }
    });

    return () => {
      cleanupDeepLinkListener();
    };
  }, [login, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log(
        "[Auth] Opening OAuth URL:",
        `${Config.URL}/oauth/redirectoauth`
      );
      await open(`${Config.URL}/oauth/redirectoauth`);
    } catch (err) {
      console.error("Login failed", err);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-transparent rounded-2xl flex items-center justify-center shadow-2xl shadow-[#5865F2]/25 transform hover:scale-105 transition-transform duration-300">
              <img src="/mega color.png" className="w-20 h-20 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#e0e7ff] to-[#c7d2fe] bg-clip-text text-transparent">
              Welcome to Luna
            </h1>
            <p className="text-[#b9bbbe] text-lg font-medium">
              Connect with Discord to get started
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`relative cursor-pointer group flex items-center gap-3 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 min-w-[240px] justify-center
              ${
                loading
                  ? "bg-[#4752c4] cursor-not-allowed"
                  : "bg-gradient-to-r from-[#5865F2] to-[#7289da] hover:from-[#4752c4] hover:to-[#677bc4] shadow-lg shadow-[#5865F2]/25 hover:shadow-xl hover:shadow-[#5865F2]/40"
              }`}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5865F2] to-[#7289da] rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

            <div className="relative flex items-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-lg">Redirecting...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  <span className="text-lg">Login with Discord</span>
                </>
              )}
            </div>
          </button>
        </div>

        <p className="text-[#72767d] text-sm text-center max-w-sm leading-relaxed">
          Need help? Join our{" "}
          <a
            className="transition-all duration-200 hover:underline hover:text-blue-400 cursor-pointer"
            onClick={() => window.open("https://discord.gg/megamp")}
          >
            Discord Server.
          </a>
        </p>
      </div>
    </div>
  );
}
