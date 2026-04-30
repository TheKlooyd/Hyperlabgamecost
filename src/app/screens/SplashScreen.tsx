import React from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Gamepad2, Zap, Target, ArrowRight } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { playStart } from "../utils/sounds";

export function SplashScreen() {
  const navigate = useNavigate();

  const handleStart = () => {
    playStart();
    const onboarded = localStorage.getItem("vgp-onboarded");
    if (onboarded === "true") {
      navigate("/home");
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <MobileLayout noPadding hideAssistant>
      <div
        className="flex flex-col min-h-screen relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1e3a5f 0%, #1a2d5a 40%, #0f172a 100%)",
        }}
      >
        {/* Background decorations */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "#3b82f6", filter: "blur(80px)", transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-32 left-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: "#8b5cf6", filter: "blur(60px)", transform: "translateX(-30%)" }}
        />
        <div
          className="absolute top-1/3 right-8 w-32 h-32 rounded-full opacity-5"
          style={{ background: "#10b981", filter: "blur(40px)" }}
        />

        {/* Floating dots decoration */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${4 + i * 2}px`,
              height: `${4 + i * 2}px`,
              background: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"][i],
              top: `${10 + i * 14}%`,
              left: `${8 + i * 13}%`,
              opacity: 0.6,
            }}
            animate={{ y: [0, -12, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Header */}
        <div className="flex justify-center pt-16 pb-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{ width: 52, height: 52, background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.3)" }}
            >
              <Gamepad2 size={26} color="#60a5fa" strokeWidth={1.5} />
            </div>
          </motion.div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 items-center justify-center px-8 text-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            <h1
              className="text-white"
              style={{ fontSize: "32px", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.5px" }}
            >
              El viaje del
              <br />
              <span style={{ color: "#60a5fa" }}>videojuego</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.5 }}>
              Aprende a planear tu proyecto de videojuego paso a paso
            </p>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                width: "260px",
                height: "200px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1772140067286-53a68cedf06e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb250cm9sbGVyJTIwY3JlYXRpdmUlMjBkZXNpZ258ZW58MXx8fHwxNzc0MzA3NTg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Creación de videojuegos"
                className="w-full h-full object-cover"
                style={{ opacity: 0.7 }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 60%)" }}
              />
            </div>

            {/* Floating stage badges */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -top-3 -right-3 rounded-2xl px-3 py-1.5 flex items-center gap-1.5"
              style={{ background: "#10b981", boxShadow: "0 4px 12px rgba(16,185,129,0.4)" }}
            >
              <Target size={14} color="white" strokeWidth={2} />
              <span style={{ color: "white", fontSize: "12px", fontWeight: 700 }}>6 Etapas</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-3 -left-3 rounded-2xl px-3 py-1.5 flex items-center gap-1.5"
              style={{ background: "#f59e0b", boxShadow: "0 4px 12px rgba(245,158,11,0.4)" }}
            >
              <Zap size={14} color="white" fill="white" strokeWidth={2} />
              <span style={{ color: "white", fontSize: "12px", fontWeight: 700 }}>+XP por etapa</span>
            </motion.div>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {["Progreso gamificado", "Quiz por etapa", "Feedback inmediato"].map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "#cbd5e1",
                  fontSize: "12px",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="px-8 pb-12 flex flex-col gap-3"
        >
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white",
              fontSize: "16px",
              fontWeight: 700,
              boxShadow: "0 8px 24px rgba(59,130,246,0.45)",
              border: "none",
            }}
          >
            Comenzar viaje <ArrowRight size={18} />
          </button>
          <p style={{ color: "#475569", fontSize: "12px", textAlign: "center" }}>
            Diseñado para estudiantes universitarios de diseño de videojuegos
          </p>
        </motion.div>
      </div>
    </MobileLayout>
  );
}