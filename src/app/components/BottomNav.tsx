import React from "react";
import { useNavigate, useLocation } from "react-router";
import { Home, Layers, User } from "lucide-react";
import { playNavigate } from "../utils/sounds";

const navItems = [
  { path: "/home", icon: Home, label: "Inicio" },
  { path: "/stages", icon: Layers, label: "Etapas" },
  { path: "/profile", icon: User, label: "Perfil" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="flex items-center justify-around py-2 px-4 border-t"
      style={{
        background: "#ffffff",
        borderColor: "#e2e8f0",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
      }}
    >
      {navItems.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path || (path === "/home" && location.pathname === "/");
        return (
          <button
            key={path}
            onClick={() => { playNavigate(); navigate(path); }}
            className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all"
            style={{
              color: isActive ? "#3b82f6" : "#94a3b8",
              background: isActive ? "#eff6ff" : "transparent",
              minWidth: "64px",
            }}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span style={{ fontSize: "11px", fontWeight: isActive ? 600 : 400 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
