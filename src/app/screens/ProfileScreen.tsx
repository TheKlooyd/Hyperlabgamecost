import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Zap, Flame, Target, BookOpen, ArrowRight, Trophy, CheckCircle, Star, Gamepad2, HelpCircle } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { BottomNav } from "../components/BottomNav";
import { PixelTutorialModal } from "../components/PixelTutorialModal";
import { useApp } from "../context/AppContext";
import { stages, achievementsList } from "../data/gameData";
import { AppIcon } from "../components/ui/AppIcon";

export function ProfileScreen() {
  const navigate = useNavigate();
  const { state, getTotalProgress, getCompletedStages } = useApp();
  const [showTutorial, setShowTutorial] = useState(false);

  const totalProgress = getTotalProgress();
  const completedStages = getCompletedStages();
  const xpLevel = Math.floor(state.xp / 500) + 1;
  const xpInLevel = state.xp % 500;
  const xpProgress = (xpInLevel / 500) * 100;

  const allAchievements = achievementsList.map(a => ({
    ...a,
    earned: state.earnedAchievements.includes(a.id),
  }));

  const completedStagesList = stages.filter(
    s => state.stageStatuses[s.id]?.status === "completed"
  );

  const topicsLearned = completedStagesList.flatMap(s => s.topics);

  const strengths = completedStagesList.map(s => s.title);
  const pendingStages = stages.filter(
    s => state.stageStatuses[s.id]?.status !== "completed"
  );

  const stats = [
    { label: "XP Total", value: state.xp.toLocaleString(), iconKey: "zap" as const, color: "#f59e0b" },
    { label: "Nivel", value: `${xpLevel}`, iconKey: "award" as const, color: "#8b5cf6" },
    { label: "Etapas completadas", value: `${completedStages}/6`, iconKey: "check" as const, color: "#10b981" },
    { label: "Logros ganados", value: `${state.earnedAchievements.length}/${achievementsList.length}`, iconKey: "trophy" as const, color: "#3b82f6" },
    { label: "Actividades totales", value: `${state.totalActivitiesCompleted}`, iconKey: "file-text" as const, color: "#ec4899" },
    { label: "Racha actual", value: `${state.streak} días`, iconKey: "flame" as const, color: "#ef4444" },
  ];

  const iconComponents: Record<string, React.ReactNode> = {
    zap: <Zap size={18} color="#f59e0b" fill="#f59e0b" strokeWidth={1.5} />,
    award: <AppIcon iconKey="award" size={18} color="#8b5cf6" strokeWidth={1.75} />,
    check: <CheckCircle size={18} color="#10b981" strokeWidth={1.75} />,
    trophy: <Trophy size={18} color="#3b82f6" strokeWidth={1.75} />,
    "file-text": <AppIcon iconKey="file-text" size={18} color="#ec4899" strokeWidth={1.75} />,
    flame: <Flame size={18} color="#ef4444" strokeWidth={1.75} />,
  };

  return (
    <MobileLayout noPadding>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 overflow-y-auto pb-20" style={{ background: "#f8fafc" }}>

          {/* Header */}
          <div
            className="px-5 pt-12 pb-8 flex flex-col items-center gap-4"
            style={{ background: "linear-gradient(160deg, #1e3a5f 0%, #1a2d5a 100%)" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="rounded-full flex items-center justify-center"
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                border: "3px solid rgba(255,255,255,0.2)",
              }}
            >
              <Gamepad2 size={36} color="white" strokeWidth={1.5} />
            </motion.div>
            <div className="text-center">
              <h1 style={{ color: "white", fontSize: "22px", fontWeight: 800 }}>
                {state.userName}
              </h1>
              <p style={{ color: "#94a3b8", fontSize: "13px" }}>
                Game Designer en formación
              </p>
            </div>

            {/* Level progress */}
            <div
              className="w-full rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap size={16} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ color: "white", fontSize: "13px", fontWeight: 700 }}>
                    Nivel {xpLevel}
                  </span>
                </div>
                <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                  {xpInLevel}/500 XP
                </span>
              </div>
              <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #f59e0b, #f97316)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p style={{ color: "#64748b", fontSize: "11px", marginTop: "4px" }}>
                {500 - xpInLevel} XP para el Nivel {xpLevel + 1}
              </p>
            </div>
          </div>

          <div className="px-5 flex flex-col gap-5 pt-5">

            {/* Botón para volver a ver el tutorial de Pixel */}
            <button
              onClick={() => setShowTutorial(true)}
              className="rounded-3xl p-4 flex items-center gap-3 w-full transition-all active:scale-98"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                boxShadow: "0 4px 16px rgba(139,92,246,0.3)",
              }}
            >
              <div
                className="rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ width: "44px", height: "44px", background: "rgba(255,255,255,0.2)" }}
              >
                <HelpCircle size={22} color="white" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <p style={{ color: "white", fontSize: "15px", fontWeight: 700, marginBottom: "2px" }}>
                  ¿Cómo funciona Pixel?
                </p>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>
                  Ver tutorial de acompañamiento
                </p>
              </div>
              <ArrowRight size={18} color="white" />
            </button>

            {/* Progress overview */}
            <div
              className="rounded-3xl p-4"
              style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target size={16} color="#3b82f6" />
                  <p style={{ color: "#0f172a", fontSize: "14px", fontWeight: 700 }}>
                    Progreso del viaje
                  </p>
                </div>
                <span style={{ color: "#3b82f6", fontSize: "22px", fontWeight: 800 }}>
                  {totalProgress}%
                </span>
              </div>
              <div className="h-3 rounded-full" style={{ background: "#f1f5f9" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #3b82f6, #10b981)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${totalProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <p style={{ color: "#94a3b8", fontSize: "12px" }}>
                  {completedStages} de 6 etapas completadas
                </p>
                {completedStages === 6 && (
                  <button
                    onClick={() => navigate("/results")}
                    className="flex items-center gap-1"
                    style={{ color: "#3b82f6", fontSize: "12px", fontWeight: 600 }}
                  >
                    Ver proyecto <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Stats grid */}
            <div>
              <h3 style={{ color: "#0f172a", fontSize: "15px", fontWeight: 700, marginBottom: "12px" }}>
                Estadísticas
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-2xl p-3.5 flex items-center gap-3"
                    style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                  >
                    <div
                      className="rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ width: "38px", height: "38px", background: `${stat.color}15` }}
                    >
                      {iconComponents[stat.iconKey]}
                    </div>
                    <div>
                      <p style={{ color: stat.color, fontSize: "16px", fontWeight: 800 }}>{stat.value}</p>
                      <p style={{ color: "#94a3b8", fontSize: "11px" }}>{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            {strengths.length > 0 && (
              <div
                className="rounded-3xl p-4"
                style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={16} color="#10b981" />
                  <p style={{ color: "#0f172a", fontSize: "14px", fontWeight: 700 }}>
                    Fortalezas detectadas
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {strengths.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full flex items-center gap-1"
                      style={{
                        background: "#ecfdf5",
                        color: "#059669",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "1px solid #a7f3d0",
                      }}
                    >
                      <CheckCircle size={11} color="#059669" strokeWidth={2.5} /> {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pending topics */}
            {pendingStages.length > 0 && (
              <div
                className="rounded-3xl p-4"
                style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Flame size={16} color="#f97316" />
                  <p style={{ color: "#0f172a", fontSize: "14px", fontWeight: 700 }}>
                    Por explorar
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pendingStages.map((stage, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
                      style={{
                        background: "#fff7ed",
                        color: "#ea580c",
                        fontSize: "12px",
                        fontWeight: 500,
                        border: "1px solid #fed7aa",
                      }}
                    >
                      <AppIcon iconKey={stage.icon} size={12} color="#ea580c" strokeWidth={2} /> {stage.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ color: "#0f172a", fontSize: "15px", fontWeight: 700 }}>
                  Logros
                </h3>
                <span style={{ color: "#64748b", fontSize: "13px" }}>
                  {state.earnedAchievements.length}/{achievementsList.length}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {allAchievements.map((achievement, i) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-2xl p-3.5 flex items-center gap-3"
                    style={{
                      background: achievement.earned ? "#fffbeb" : "#f8fafc",
                      border: achievement.earned ? "1.5px solid #fde68a" : "1.5px solid #e2e8f0",
                      opacity: achievement.earned ? 1 : 0.6,
                    }}
                  >
                    <div
                      className="rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        width: "44px",
                        height: "44px",
                        background: achievement.earned ? "#fef3c7" : "#f1f5f9",
                        filter: achievement.earned ? "none" : "grayscale(1)",
                      }}
                    >
                      <AppIcon
                        iconKey={achievement.icon}
                        size={22}
                        color={achievement.earned ? "#d97706" : "#94a3b8"}
                        strokeWidth={1.75}
                      />
                    </div>
                    <div className="flex-1">
                      <p style={{ color: achievement.earned ? "#0f172a" : "#94a3b8", fontSize: "14px", fontWeight: 700 }}>
                        {achievement.title}
                      </p>
                      <p style={{ color: "#94a3b8", fontSize: "12px" }}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <Star size={16} color="#f59e0b" fill="#f59e0b" strokeWidth={1.5} />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
      
      {/* Tutorial Modal */}
      <PixelTutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </MobileLayout>
  );
}