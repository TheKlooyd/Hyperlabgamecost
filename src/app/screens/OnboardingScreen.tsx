import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, Zap, Flame, Trophy,
  Lightbulb, Users, Banknote, BarChart2, TrendingUp,
  Map, Check, Maximize2, BookOpen,
} from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";

/* ── Map background SVG (inline, no emoji) ─────────────────────────────────── */
function MapBackground({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <svg
      viewBox="0 0 430 800"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      {/* Grid lines */}
      {[80, 160, 240, 320, 400].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="800" stroke="currentColor" strokeWidth="0.5" strokeOpacity={opacity * 2} strokeDasharray="4 8" />
      ))}
      {[100, 200, 300, 400, 500, 600, 700].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="430" y2={y} stroke="currentColor" strokeWidth="0.5" strokeOpacity={opacity * 2} strokeDasharray="4 8" />
      ))}
      {/* Compass rose */}
      <g transform="translate(370, 100)" opacity={opacity * 6}>
        <circle cx="0" cy="0" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="0" cy="0" r="16" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <polygon points="0,-20 3,-3 0,-8 -3,-3" fill="currentColor" />
        <polygon points="0,20 3,3 0,8 -3,3" fill="currentColor" opacity="0.4" />
        <polygon points="-20,0 -3,-3 -8,0 -3,3" fill="currentColor" opacity="0.4" />
        <polygon points="20,0 3,-3 8,0 3,3" fill="currentColor" opacity="0.4" />
        <text x="0" y="-26" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="700">N</text>
      </g>
      {/* Dotted path connecting stages */}
      <path
        d="M 60 680 Q 120 600 80 520 Q 60 460 130 400 Q 200 340 160 260 Q 130 200 200 150 Q 270 100 340 130"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="6 10"
        strokeOpacity={opacity * 5}
        strokeLinecap="round"
      />
      {/* Stage pins on path */}
      {[
        { cx: 60, cy: 680 },
        { cx: 90, cy: 510 },
        { cx: 160, cy: 400 },
        { cx: 170, cy: 260 },
        { cx: 220, cy: 150 },
        { cx: 340, cy: 130 },
      ].map((pt, i) => (
        <g key={i} transform={`translate(${pt.cx},${pt.cy})`} opacity={opacity * 8}>
          <circle cx="0" cy="0" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3" fill="currentColor" />
        </g>
      ))}
      {/* Decorative terrain shapes */}
      <ellipse cx="300" cy="550" rx="55" ry="30" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity={opacity * 4} />
      <ellipse cx="100" cy="320" rx="40" ry="22" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity={opacity * 4} />
      <ellipse cx="380" cy="420" rx="28" ry="16" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity={opacity * 3} />
    </svg>
  );
}

/* ── Stage icons for visual strip ──────────────────────────────────────────── */
const stageIcons = [
  { Icon: Lightbulb, color: "#3b82f6", bg: "#eff6ff", label: "Concepto" },
  { Icon: Maximize2, color: "#8b5cf6", bg: "#f5f3ff", label: "Alcance" },
  { Icon: Users, color: "#f97316", bg: "#fff7ed", label: "Equipo" },
  { Icon: Banknote, color: "#ec4899", bg: "#fdf2f8", label: "Costos" },
  { Icon: BarChart2, color: "#14b8a6", bg: "#f0fdfa", label: "Presupuesto" },
  { Icon: TrendingUp, color: "#f59e0b", bg: "#fffbeb", label: "Pitch" },
];

/* ── Slide data ─────────────────────────────────────────────────────────────── */
const slides = [
  {
    id: "journey",
    accentColor: "#3b82f6",
    darkBg: "linear-gradient(160deg, #1e3a5f 0%, #1a2d5a 60%, #0f172a 100%)",
    title: "Tu viaje en 6 etapas",
    subtitle: "EL MAPA DEL DISEÑO",
    description:
      "Sigue el camino que recorren los desarrolladores reales. Cada etapa es un punto en el mapa que te acerca al proyecto terminado.",
    highlight: "Cada etapa desbloquea la siguiente.",
  },
  {
    id: "progress",
    accentColor: "#f59e0b",
    darkBg: "linear-gradient(160deg, #1e3a5f 0%, #1a2d5a 60%, #0f172a 100%)",
    title: "Progreso y recompensas",
    subtitle: "EL SISTEMA DE XP",
    description:
      "Gana XP por cada actividad, mantén tu racha y desbloquea logros. Sin atajos: el conocimiento construye el progreso.",
    highlight: "La constancia es tu mejor habilidad.",
  },
  {
    id: "feedback",
    accentColor: "#10b981",
    darkBg: "linear-gradient(160deg, #1e3a5f 0%, #1a2d5a 60%, #0f172a 100%)",
    title: "Aprende del error",
    subtitle: "FEEDBACK INTELIGENTE",
    description:
      "Cuando te equivocas no ves solo «incorrecto». Recibes una explicación clara y una pista para el siguiente intento.",
    highlight: "No necesitas saberlo todo desde el inicio.",
  },
];

export function OnboardingScreen() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      localStorage.setItem("vgp-onboarded", "true");
      navigate("/home");
    }
  };

  const slide = slides[current];

  return (
    <MobileLayout noPadding hideAssistant>
      <div
        className="flex flex-col min-h-screen relative overflow-hidden"
        style={{ background: slide.darkBg }}
      >
        {/* Map background */}
        <div style={{ position: "absolute", inset: 0, color: "white", pointerEvents: "none" }}>
          <MapBackground opacity={0.055} />
        </div>

        {/* Ambient glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: "320px",
            height: "320px",
            background: slide.accentColor,
            opacity: 0.08,
            filter: "blur(80px)",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />

        {/* Header: dots + skip */}
        <div className="flex items-center justify-between px-6 pt-10 pb-4 relative z-10">
          <div className="flex gap-1.5 items-center">
            {slides.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === current ? "24px" : "6px",
                  height: "6px",
                  borderRadius: i === current ? "3px" : "50%",
                  background: i === current ? slide.accentColor : "rgba(255,255,255,0.25)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
          {current < slides.length - 1 && (
            <button
              onClick={() => {
                localStorage.setItem("vgp-onboarded", "true");
                navigate("/home");
              }}
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "13px",
                fontWeight: 500,
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              Saltar
            </button>
          )}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.32 }}
            className="flex flex-col flex-1 relative z-10"
          >
            {/* ── Slide 0: Journey map + controller image ── */}
            {slide.id === "journey" && (
              <>
                {/* Hero image area */}
                <div className="relative flex justify-center px-6 pt-2">
                  <div
                    className="relative rounded-3xl overflow-hidden"
                    style={{ width: "100%", maxWidth: "340px", height: "200px" }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1543328011-1c0d628fae09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb250cm9sbGVyJTIwZGFyayUyMG5lb258ZW58MXx8fHwxNzc0NTUwMDMwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Controlador de videojuego"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        borderRadius: "24px",
                      }}
                    />
                    {/* Dark overlay for readability */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(15,23,42,0.75) 0%, rgba(15,23,42,0.15) 60%, transparent 100%)",
                        borderRadius: "24px",
                      }}
                    />
                    {/* Badge: etapas */}
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: "#3b82f6",
                        borderRadius: "12px",
                        padding: "5px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        boxShadow: "0 4px 12px rgba(59,130,246,0.5)",
                      }}
                    >
                      <Map size={12} color="white" />
                      <span style={{ color: "white", fontSize: "11px", fontWeight: 700 }}>6 etapas</span>
                    </motion.div>
                    {/* Badge: XP */}
                    <motion.div
                      animate={{ y: [0, -7, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        left: "12px",
                        background: "#f59e0b",
                        borderRadius: "12px",
                        padding: "5px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        boxShadow: "0 4px 12px rgba(245,158,11,0.5)",
                      }}
                    >
                      <Zap size={12} color="white" fill="white" />
                      <span style={{ color: "white", fontSize: "11px", fontWeight: 700 }}>+XP por etapa</span>
                    </motion.div>
                  </div>
                </div>

                {/* Label */}
                <div className="px-6 pt-5">
                  <p style={{ color: slide.accentColor, fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px" }}>
                    {slide.subtitle}
                  </p>
                  <h1 style={{ color: "white", fontSize: "26px", fontWeight: 800, lineHeight: 1.2, marginTop: "6px", letterSpacing: "-0.3px" }}>
                    {slide.title}
                  </h1>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.6, marginTop: "8px" }}>
                    {slide.description}
                  </p>
                </div>

                {/* Stage icons strip */}
                <div className="px-6 pt-5">
                  <div className="flex gap-2">
                    {stageIcons.map(({ Icon, color, bg, label }, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.07 }}
                        className="flex-1 flex flex-col items-center gap-1.5"
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon size={18} color={color} strokeWidth={1.75} />
                        </div>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>
                          {label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── Slide 1: XP / progress ── */}
            {slide.id === "progress" && (
              <>
                {/* Illustration */}
                <div className="px-6 pt-2 flex justify-center">
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "340px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "24px",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    {/* XP bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          background: "rgba(245,158,11,0.15)",
                          border: "1px solid rgba(245,158,11,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Zap size={20} color="#f59e0b" fill="#f59e0b" strokeWidth={1.5} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "white", fontSize: "13px", fontWeight: 600 }}>+30 XP ganados</span>
                          <span style={{ color: "#f59e0b", fontSize: "12px", fontWeight: 700 }}>Nivel 2</span>
                        </div>
                        <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.08)" }}>
                          <motion.div
                            style={{ height: "100%", borderRadius: "3px", background: "linear-gradient(90deg, #f59e0b, #f97316)" }}
                            initial={{ width: 0 }}
                            animate={{ width: "65%" }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Racha + Logros */}
                    <div style={{ display: "flex", gap: "10px" }}>
                      {[
                        { Icon: Flame, color: "#ef4444", label: "Racha", value: "5 días", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)" },
                        { Icon: Trophy, color: "#3b82f6", label: "Logros", value: "3/9", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)" },
                      ].map(({ Icon, color, label, value, bg, border }) => (
                        <div
                          key={label}
                          style={{
                            flex: 1,
                            borderRadius: "14px",
                            padding: "12px",
                            background: bg,
                            border: `1px solid ${border}`,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Icon size={18} color={color} strokeWidth={1.75} />
                          <div>
                            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>{label}</div>
                            <div style={{ color: "white", fontSize: "15px", fontWeight: 700 }}>{value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Map path preview */}
                    <div
                      style={{
                        borderRadius: "14px",
                        padding: "12px 14px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              background: n <= 2 ? "#10b981" : n === 3 ? "#3b82f6" : "rgba(255,255,255,0.1)",
                              border: n === 3 ? "2px solid #3b82f6" : "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {n <= 2 ? (
                              <Check size={12} color="white" strokeWidth={2.5} />
                            ) : (
                              <span style={{ color: n === 3 ? "white" : "rgba(255,255,255,0.3)", fontSize: "10px", fontWeight: 700 }}>{n}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pt-5">
                  <p style={{ color: slide.accentColor, fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px" }}>
                    {slide.subtitle}
                  </p>
                  <h1 style={{ color: "white", fontSize: "26px", fontWeight: 800, lineHeight: 1.2, marginTop: "6px", letterSpacing: "-0.3px" }}>
                    {slide.title}
                  </h1>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.6, marginTop: "8px" }}>
                    {slide.description}
                  </p>
                  <div
                    style={{
                      marginTop: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "rgba(245,158,11,0.12)",
                      border: "1px solid rgba(245,158,11,0.25)",
                      borderRadius: "10px",
                      padding: "6px 12px",
                    }}
                  >
                    <Zap size={13} color="#f59e0b" strokeWidth={2} />
                    <span style={{ color: "#f59e0b", fontSize: "12px", fontWeight: 600 }}>{slide.highlight}</span>
                  </div>
                </div>
              </>
            )}

            {/* ── Slide 2: Feedback ── */}
            {slide.id === "feedback" && (
              <>
                <div className="px-6 pt-2 flex justify-center">
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "340px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {/* Correct answer */}
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      style={{
                        borderRadius: "18px",
                        padding: "14px 16px",
                        background: "rgba(16,185,129,0.1)",
                        border: "1px solid rgba(16,185,129,0.25)",
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "#10b981",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Check size={16} color="white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <div style={{ color: "white", fontSize: "13px", fontWeight: 600, lineHeight: 1.4 }}>
                          Identificaste la mecánica principal correctamente.
                        </div>
                        <div style={{ color: "#10b981", fontSize: "11px", marginTop: "4px", fontWeight: 600 }}>+30 XP</div>
                      </div>
                    </motion.div>

                    {/* Wrong answer */}
                    <motion.div
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      style={{
                        borderRadius: "18px",
                        padding: "14px 16px",
                        background: "rgba(249,115,22,0.1)",
                        border: "1px solid rgba(249,115,22,0.25)",
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "#f97316",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Lightbulb size={14} color="white" strokeWidth={2} />
                      </div>
                      <div>
                        <div style={{ color: "white", fontSize: "13px", fontWeight: 600, lineHeight: 1.4 }}>
                          Casi lo tienes. Revisa la diferencia entre mecánica y narrativa.
                        </div>
                        <div style={{ color: "#f97316", fontSize: "11px", marginTop: "4px", fontWeight: 600 }}>Pista disponible</div>
                      </div>
                    </motion.div>

                    {/* Explanation teaser */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      style={{
                        borderRadius: "18px",
                        padding: "14px 16px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <BookOpen size={18} color="rgba(255,255,255,0.4)" strokeWidth={1.75} />
                      <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", lineHeight: 1.5 }}>
                        Cada error viene con una explicación detallada que refuerza el aprendizaje.
                      </span>
                    </motion.div>
                  </div>
                </div>

                <div className="px-6 pt-5">
                  <p style={{ color: slide.accentColor, fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px" }}>
                    {slide.subtitle}
                  </p>
                  <h1 style={{ color: "white", fontSize: "26px", fontWeight: 800, lineHeight: 1.2, marginTop: "6px", letterSpacing: "-0.3px" }}>
                    {slide.title}
                  </h1>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.6, marginTop: "8px" }}>
                    {slide.description}
                  </p>
                  <div
                    style={{
                      marginTop: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "rgba(16,185,129,0.12)",
                      border: "1px solid rgba(16,185,129,0.25)",
                      borderRadius: "10px",
                      padding: "6px 12px",
                    }}
                  >
                    <Check size={13} color="#10b981" strokeWidth={2.5} />
                    <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 600 }}>{slide.highlight}</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div className="px-6 pb-12 pt-6 relative z-10">
          <motion.button
            onClick={handleNext}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
            style={{
              background: slide.accentColor,
              color: "white",
              fontSize: "16px",
              fontWeight: 700,
              border: "none",
              boxShadow: `0 8px 28px ${slide.accentColor}55`,
              cursor: "pointer",
            }}
          >
            {current < slides.length - 1 ? (
              <>
                Siguiente <ChevronRight size={18} />
              </>
            ) : (
              <>
                Empezar el viaje <ChevronRight size={18} />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </MobileLayout>
  );
}