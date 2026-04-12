import React, { useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, Star, Check, Zap, Gem, Trophy, Unlock } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { stages } from "../data/gameData";
import { AppIcon } from "../components/ui/AppIcon";
import confetti from "canvas-confetti";

export function StageUnlockScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stageId } = useParams<{ stageId: string }>();

  const completedStage = stages.find(s => s.id === Number(stageId));
  const nextStage = stages.find(s => s.id === Number(stageId) + 1);
  const quizState = location.state as { score: number; total: number } | null;

  const score = quizState?.score || 0;
  const total = quizState?.total || 5;
  const percentage = Math.round((score / total) * 100);
  const isPerfect = score === total;
  const isAllDone = !nextStage;

  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.3 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"],
        disableForReducedMotion: true,
      });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (!completedStage) {
    navigate("/home");
    return null;
  }

  const completedTopics = completedStage.topics;

  return (
    <MobileLayout noPadding hideAssistant>
      <div
        className="flex flex-col min-h-screen relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${completedStage.color}20 0%, #f8fafc 50%, ${completedStage.color}10 100%)`,
        }}
      >
        {/* Background decoration */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-15"
          style={{
            background: completedStage.color,
            filter: "blur(80px)",
            transform: "translate(40%, -40%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="absolute bottom-20 left-0 w-60 h-60 rounded-full opacity-10"
          style={{
            background: completedStage.color,
            filter: "blur(60px)",
            transform: "translateX(-40%)",
            pointerEvents: "none",
          }}
        />

        <div className="flex flex-col flex-1 relative">
          {/* Header celebration */}
          <div className="flex justify-center pt-16 pb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 }}
            >
              <div className="relative">
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: "110px",
                    height: "110px",
                    background: completedStage.bgColor,
                    border: `3px solid ${completedStage.color}`,
                    boxShadow: `0 12px 40px ${completedStage.color}40`,
                  }}
                >
                  <AppIcon
                    iconKey={completedStage.icon}
                    size={52}
                    color={completedStage.color}
                    strokeWidth={1.25}
                  />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "#10b981",
                    border: "3px solid white",
                  }}
                >
                  <Check size={18} color="white" strokeWidth={2.5} />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Floating stars */}
          {[...Array(isPerfect ? 5 : 3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${15 + i * 8}%`,
                left: i % 2 === 0 ? `${10 + i * 5}%` : undefined,
                right: i % 2 !== 0 ? `${10 + i * 5}%` : undefined,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: [0, 20, -20, 0] }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
            >
              <Star
                size={16 + i * 2}
                color={completedStage.color}
                fill={completedStage.color}
                style={{ opacity: 0.6 }}
              />
            </motion.div>
          ))}

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center px-6 mb-4"
          >
            <p style={{ color: completedStage.color, fontSize: "12px", fontWeight: 700, letterSpacing: "1px" }}>
              {isAllDone ? "VIAJE COMPLETADO" : "ETAPA COMPLETADA"}
            </p>
            <h1
              style={{
                color: "#0f172a",
                fontSize: "28px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
                marginTop: "6px",
              }}
            >
              {isAllDone ? "Completaste todo el viaje" : completedStage.title}
            </h1>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "6px", lineHeight: 1.5 }}>
              {isAllDone
                ? "Tu proyecto de videojuego está completo. Eres un Game Designer."
                : "Tu proyecto va tomando forma. Sigue construyendo."}
            </p>
          </motion.div>

          {/* Score card */}
          <div className="px-6 mb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="rounded-3xl p-5"
              style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <p style={{ color: "#64748b", fontSize: "13px", fontWeight: 600 }}>Resultado del quiz</p>
                <div
                  className="px-3 py-1 rounded-xl"
                  style={{ background: completedStage.bgColor }}
                >
                  <span style={{ color: completedStage.color, fontSize: "14px", fontWeight: 800 }}>
                    {score}/{total} correctas
                  </span>
                </div>
              </div>

              <div className="h-3 rounded-full mb-2" style={{ background: "#f1f5f9" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: completedStage.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span style={{ color: "#94a3b8", fontSize: "12px" }}>{percentage}% de aciertos</span>
                <div className="flex items-center gap-1.5">
                  <Zap size={14} color="#f59e0b" fill="#f59e0b" strokeWidth={1.5} />
                  <span style={{ color: "#f59e0b", fontSize: "13px", fontWeight: 700 }}>
                    +{completedStage.xpReward + score * 20} XP
                  </span>
                </div>
              </div>

              {isPerfect && (
                <div
                  className="mt-3 rounded-xl px-3 py-2 flex items-center gap-2"
                  style={{ background: "#fffbeb", border: "1.5px solid #fde68a" }}
                >
                  <Gem size={18} color="#d97706" strokeWidth={1.75} />
                  <p style={{ color: "#92400e", fontSize: "13px", fontWeight: 700 }}>
                    Perfecto. Ganaste el logro «Sin Errores»
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Topics learned */}
          <div className="px-6 mb-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="rounded-3xl p-4"
              style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>
                Lo que construiste en esta etapa:
              </p>
              <div className="flex flex-wrap gap-2">
                {completedTopics.map((topic, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.06 }}
                    className="px-3 py-1 rounded-full flex items-center gap-1"
                    style={{
                      background: completedStage.bgColor,
                      color: completedStage.color,
                      fontSize: "12px",
                      fontWeight: 500,
                      border: `1px solid ${completedStage.borderColor}`,
                    }}
                  >
                    <Check size={10} strokeWidth={2.5} /> {topic}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Next stage preview */}
          {nextStage && (
            <div className="px-6 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="rounded-3xl p-4 flex items-center gap-3"
                style={{
                  background: `${nextStage.color}10`,
                  border: `2px solid ${nextStage.color}30`,
                }}
              >
                <div
                  className="rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ width: "48px", height: "48px", background: nextStage.bgColor }}
                >
                  <AppIcon iconKey={nextStage.icon} size={22} color={nextStage.color} strokeWidth={1.75} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Unlock size={11} color={nextStage.color} strokeWidth={2} />
                    <p style={{ color: nextStage.color, fontSize: "11px", fontWeight: 700 }}>
                      NUEVO STAGE DESBLOQUEADO
                    </p>
                  </div>
                  <p style={{ color: "#0f172a", fontSize: "15px", fontWeight: 700 }}>
                    Etapa {nextStage.id}: {nextStage.title}
                  </p>
                  <p style={{ color: "#64748b", fontSize: "12px" }}>{nextStage.subtitle}</p>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="px-6 pb-12 flex flex-col gap-3"
        >
          {isAllDone ? (
            <button
              onClick={() => navigate("/results")}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{
                background: completedStage.color,
                color: "white",
                fontSize: "16px",
                fontWeight: 700,
                border: "none",
                boxShadow: `0 8px 24px ${completedStage.color}40`,
              }}
            >
              <Trophy size={18} color="white" /> Ver mi proyecto completo
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate(nextStage ? `/stage/${nextStage.id}` : "/home")}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                  background: nextStage ? nextStage.color : completedStage.color,
                  color: "white",
                  fontSize: "16px",
                  fontWeight: 700,
                  border: "none",
                  boxShadow: `0 8px 24px ${(nextStage || completedStage).color}40`,
                }}
              >
                Comenzar Etapa {nextStage?.id} <ChevronRight size={18} />
              </button>
              <button
                onClick={() => navigate("/home")}
                style={{ color: "#64748b", fontSize: "14px", fontWeight: 500, background: "transparent", border: "none" }}
              >
                Volver al inicio
              </button>
            </>
          )}
        </motion.div>
      </div>
    </MobileLayout>
  );
}
