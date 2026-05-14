import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Flame, Trophy, ChevronRight, Lock, CheckCircle2, Circle, Bell, X, Luggage, Bus, Plane, Map as MapIcon, Tent, Cloud, Gamepad2, PartyPopper } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { BottomNav } from "../components/BottomNav";
import { PixelTutorialModal } from "../components/PixelTutorialModal";
import { useApp } from "../context/AppContext";
import { stages, achievementsList } from "../data/gameData";
import { AppIcon } from "../components/ui/AppIcon";
import { playNavigate } from "../utils/sounds";

const STAGE_VIDEOS: Record<number, string> = {
  1: `${import.meta.env.BASE_URL}videosetapas/concepto.mp4`,
  2: `${import.meta.env.BASE_URL}videosetapas/Alcance.mp4`,
  3: `${import.meta.env.BASE_URL}videosetapas/equipo.mp4`,
};

// Zonas clickeables rectangulares para cada etapa en la imagen del mapa
const HOME_STAGE_POSITIONS = [
  { left: "0%",  top: "0%",   width: "55%", height: "18%" }, // Etapa 1
  { left: "45%", top: "18%",  width: "55%", height: "18%" }, // Etapa 2
  { left: "0%",  top: "36%",  width: "55%", height: "18%" }, // Etapa 3
  { left: "45%", top: "54%",  width: "55%", height: "17%" }, // Etapa 4
  { left: "0%",  top: "67%",  width: "55%", height: "17%" }, // Etapa 5
  { left: "45%", top: "82%",  width: "55%", height: "18%" }, // Etapa 6
];

type JourneyIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
const JOURNEY_STAGES: Record<number, { icon: JourneyIcon; name: string; sub: string }> = {
  1: { icon: Luggage, name: "Preparamos las maletas", sub: "Concepto e Idea" },
  2: { icon: Bus, name: "Agarramos el bus", sub: "Diseño de Mecánicas" },
  3: { icon: Plane, name: "Subimos al avión", sub: "Narrativa y Mundo" },
  4: { icon: MapIcon, name: "Exploramos el mapa", sub: "Planificación del Proyecto" },
  5: { icon: Tent, name: "Montamos el campamento", sub: "Prototipado y Pruebas" },
  6: { icon: Trophy, name: "¡Llegamos al destino!", sub: "Presentación del Proyecto" },
};

export function HomeScreen() {
  const navigate = useNavigate();
  const { state, getTotalProgress, getCompletedStages } = useApp();
  const [showTutorial, setShowTutorial] = useState(false);
  const [videoStage, setVideoStage] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStageClick = (stageId: number, isLocked: boolean) => {
    if (isLocked) return;
    if (STAGE_VIDEOS[stageId]) {
      setVideoStage(stageId);
    } else {
      navigate(`/stage/${stageId}`);
    }
  };

  const handleCloseVideo = () => {
    if (videoRef.current) videoRef.current.pause();
    const stageId = videoStage;
    setVideoStage(null);
    if (stageId !== null) { playNavigate(); navigate(`/stage/${stageId}`); }
  };

  const handleStartStage = () => {
    if (videoRef.current) videoRef.current.pause();
    const stageId = videoStage;
    setVideoStage(null);
    if (stageId !== null) { playNavigate(); navigate(`/stage/${stageId}`); }
  };

  // Mostrar tutorial automáticamente en primera visita
  useEffect(() => {
    if (!state.hasSeenPixelTutorial) {
      // Pequeño delay para que la pantalla cargue primero
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [state.hasSeenPixelTutorial]);

  const totalProgress = getTotalProgress();
  const completedStages = getCompletedStages();

  // Find current stage
  const currentStageId = Object.entries(state.stageStatuses).find(
    ([, s]) => s.status === "current"
  )?.[0];
  const currentStage = stages.find(s => s.id === Number(currentStageId)) || stages[0];
  const currentStatus = state.stageStatuses[currentStage.id];

  const activitiesTotal = currentStage.activities.length;
  const activitiesDone = currentStatus?.activitiesCompleted.length || 0;
  const canTakeQuiz = activitiesDone >= activitiesTotal && activitiesTotal > 0;

  const xpLevel = Math.floor(state.xp / 500) + 1;
  const xpInLevel = state.xp % 500;

  const earnedAchievements = achievementsList.filter(a => state.earnedAchievements.includes(a.id));

  const handleContinue = () => {
    if (currentStageId) {
      playNavigate();
      navigate(`/stage/${currentStageId}`);
    }
  };

  return (
    <MobileLayout noPadding>
      <div className="flex flex-col min-h-screen">

        {/* Video modal */}
        <AnimatePresence>
          {videoStage !== null && (
            <motion.div
              key="video-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "rgba(0,0,0,0.92)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ position: "relative", width: "100%", maxWidth: "480px", padding: "0 16px" }}>
                <button
                  onClick={handleCloseVideo}
                  style={{
                    position: "absolute",
                    top: "-44px",
                    right: "16px",
                    zIndex: 10,
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X size={20} color="white" />
                </button>
                <video
                  ref={videoRef}
                  src={STAGE_VIDEOS[videoStage]}
                  controls
                  onEnded={handleStartStage}
                  style={{ width: "100%", borderRadius: "12px", display: "block" }}
                />
                <button
                  onClick={handleStartStage}
                  style={{
                    marginTop: "14px",
                    width: "100%",
                    padding: "14px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(59,130,246,0.45)",
                  }}
                >
                  Iniciar etapa
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-24" style={{ background: "#f8fafc" }}>
          {/* Header */}
          <div
            className="px-5 pt-12 pb-5"
            style={{
              background: "linear-gradient(160deg, #1e3a5f 0%, #1a2d5a 100%)",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 500 }}>
                  Bienvenido de nuevo
                </p>
                <p style={{ color: "white", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.3px", marginTop: "2px" }}>
                  {state.userName}
                </p>
              </div>
              <button className="relative">
                <div
                  className="rounded-xl flex items-center justify-center"
                  style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.1)" }}
                >
                  <Bell size={18} color="white" />
                </div>
              </button>
            </div>

            {/* XP & Stats row */}
            <div className="flex gap-2">
              <div
                className="flex-1 rounded-2xl p-3 flex items-center gap-2"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{ width: "32px", height: "32px", background: "#f59e0b20" }}
                >
                  <Zap size={16} color="#f59e0b" fill="#f59e0b" />
                </div>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: "10px" }}>XP Total</p>
                  <p style={{ color: "#f59e0b", fontSize: "16px", fontWeight: 800 }}>{state.xp.toLocaleString()}</p>
                </div>
              </div>
              <div
                className="flex-1 rounded-2xl p-3 flex items-center gap-2"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{ width: "32px", height: "32px", background: "#ef444420" }}
                >
                  <Flame size={16} color="#ef4444" fill="#ef4444" />
                </div>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: "10px" }}>Racha</p>
                  <p style={{ color: "#ef4444", fontSize: "16px", fontWeight: 800 }}>{state.streak} días</p>
                </div>
              </div>
              <div
                className="flex-1 rounded-2xl p-3 flex items-center gap-2"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{ width: "32px", height: "32px", background: "#3b82f620" }}
                >
                  <Trophy size={16} color="#3b82f6" fill="#3b82f6" />
                </div>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: "10px" }}>Logros</p>
                  <p style={{ color: "#3b82f6", fontSize: "16px", fontWeight: 800 }}>{earnedAchievements.length}/{achievementsList.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 flex flex-col gap-4 pt-4">

            {/* Overall Progress */}
            <div
              className="rounded-3xl p-4"
              style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p style={{ color: "#64748b", fontSize: "12px", fontWeight: 500 }}>Progreso general</p>
                  <h3 style={{ color: "#0f172a", fontSize: "18px", fontWeight: 800 }}>
                    {completedStages} de 6 etapas completadas
                  </h3>
                </div>
                <div
                  className="rounded-2xl flex items-center justify-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    background: totalProgress === 100 ? "#ecfdf5" : "#eff6ff",
                  }}
                >
                  <span style={{ fontSize: "26px", fontWeight: 800, color: totalProgress === 100 ? "#10b981" : "#3b82f6" }}>
                    {totalProgress}%
                  </span>
                </div>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #3b82f6, #10b981)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${totalProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p style={{ color: "#94a3b8", fontSize: "11px", marginTop: "6px" }}>
                Nivel {xpLevel} · {xpInLevel}/500 XP para el siguiente nivel
              </p>
            </div>

            {/* Current Mission */}
            <div
              className="rounded-3xl p-4 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${currentStage.color}15, ${currentStage.color}05)`,
                border: `1.5px solid ${currentStage.color}30`,
              }}
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
                style={{ background: currentStage.color, filter: "blur(20px)", transform: "translate(30%, -30%)", pointerEvents: "none" }}
              />
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="rounded-xl flex items-center justify-center"
                    style={{ width: "36px", height: "36px", background: `${currentStage.color}20` }}
                  >
                    <AppIcon iconKey={currentStage.icon} size={18} color={currentStage.color} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p style={{ color: currentStage.color, fontSize: "11px", fontWeight: 600 }}>
                      TU MISIÓN ACTUAL
                    </p>
                    <p style={{ color: "#0f172a", fontSize: "15px", fontWeight: 700 }}>
                      Etapa {currentStage.id}: {currentStage.title}
                    </p>
                  </div>
                </div>
              </div>

              <p style={{ color: "#475569", fontSize: "13px", lineHeight: 1.5, marginBottom: "12px" }}>
                {currentStage.subtitle}
              </p>

              {/* Activity checklist */}
              <div className="flex flex-col gap-1.5 mb-3">
                {currentStage.activities.slice(0, 3).map((activity, i) => {
                  const done = currentStatus?.activitiesCompleted.includes(activity.id);
                  return (
                    <div key={activity.id} className="flex items-center gap-2">
                      {done ? (
                        <CheckCircle2 size={16} color="#10b981" fill="#ecfdf5" />
                      ) : (
                        <Circle size={16} color="#94a3b8" />
                      )}
                      <span style={{ color: done ? "#10b981" : "#64748b", fontSize: "13px", fontWeight: done ? 600 : 400 }}>
                        {activity.title}
                      </span>
                    </div>
                  );
                })}
                <div className="flex items-center gap-2">
                  {canTakeQuiz ? (
                    <CheckCircle2 size={16} color="#10b981" fill="#ecfdf5" />
                  ) : (
                    <Circle size={16} color="#94a3b8" />
                  )}
                  <span style={{ color: canTakeQuiz ? "#10b981" : "#64748b", fontSize: "13px", fontWeight: canTakeQuiz ? 600 : 400 }}>
                    Quiz final de etapa
                  </span>
                </div>
              </div>

              {activitiesTotal > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-2 rounded-full" style={{ background: `${currentStage.color}20` }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(activitiesDone / activitiesTotal) * 100}%`, background: currentStage.color }}
                    />
                  </div>
                  <span style={{ color: currentStage.color, fontSize: "12px", fontWeight: 600 }}>
                    {activitiesDone}/{activitiesTotal}
                  </span>
                </div>
              )}

              {activitiesTotal > activitiesDone && (
                <p style={{ color: "#94a3b8", fontSize: "12px" }}>
                  Te falta{activitiesTotal - activitiesDone === 1 ? "" : "n"} {activitiesTotal - activitiesDone} actividad{activitiesTotal - activitiesDone === 1 ? "" : "es"} para desbloquear el quiz
                </p>
              )}
            </div>

            {/* Journey Map */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
            >
              {/* Header */}
              <div
                className="px-5 pt-5 pb-4"
                style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1a4a7a 100%)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-xl flex items-center justify-center" style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.12)" }}>
                      <MapIcon size={17} color="white" strokeWidth={1.75} />
                    </div>
                    <h3 style={{ color: "white", fontSize: "16px", fontWeight: 800 }}>Las etapas del viaje</h3>
                  </div>
                  <div
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  >
                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", fontWeight: 700 }}>{completedStages}/6</span>
                    <CheckCircle2 size={13} color="rgba(255,255,255,0.85)" strokeWidth={2.5} />
                  </div>
                </div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", marginTop: "4px" }}>
                  {completedStages === 0 ? "¡El viaje comienza aquí!" : completedStages === 6 ? "¡Destino alcanzado!" : `${completedStages} destino${completedStages === 1 ? "" : "s"} visitado${completedStages === 1 ? "" : "s"}`}
                </p>
              </div>

              {/* Imagen del mapa con zonas clickeables */}
              <div style={{ position: "relative", width: "100%" }}>
                <img
                  src={`${import.meta.env.BASE_URL}questions_img/Homelevesimage.png`}
                  alt="Mapa de las etapas del viaje"
                  style={{ width: "100%", display: "block" }}
                />
                {stages.map((stage, index) => {
                  const status = state.stageStatuses[stage.id]?.status || "locked";
                  const isLocked = status === "locked";
                  const pos = HOME_STAGE_POSITIONS[index];
                  return (
                    <button
                      key={stage.id}
                      onClick={() => handleStageClick(stage.id, isLocked)}
                      style={{
                        position: "absolute",
                        left: pos.left,
                        top: pos.top,
                        width: pos.width,
                        height: pos.height,
                        background: "transparent",
                        border: "none",
                        cursor: isLocked ? "not-allowed" : "pointer",
                        padding: 0,
                        outline: "none",
                      }}
                    />
                  );
                })}
              </div>

              {/* Footer */}
              <div
                className="px-5 py-3 flex items-center gap-3"
                style={{
                  background: completedStages === 6 ? "#ecfdf5" : "#f8fafc",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <div className="rounded-xl flex items-center justify-center" style={{ width: "32px", height: "32px", background: completedStages === 6 ? "#d1fae5" : "#e2e8f0", flexShrink: 0 }}>
                  <Gamepad2 size={17} color={completedStages === 6 ? "#059669" : "#64748b"} strokeWidth={1.75} />
                </div>
                <p style={{ color: completedStages === 6 ? "#059669" : "#64748b", fontSize: "12px", fontWeight: 600, flex: 1 }}>
                  {completedStages === 6 ? "¡Tu videojuego está completo!" : "Meta: tener tu videojuego presupuestado"}
                </p>
                {completedStages === 6 && (
                  <div className="rounded-lg flex items-center justify-center" style={{ width: "28px", height: "28px", background: "#d1fae5" }}>
                    <PartyPopper size={15} color="#059669" strokeWidth={1.75} />
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            {earnedAchievements.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: 700 }}>
                    Logros desbloqueados
                  </h3>
                  <button
                    onClick={() => navigate("/profile")}
                    style={{ color: "#3b82f6", fontSize: "13px", fontWeight: 600 }}
                  >
                    Ver todos
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  {earnedAchievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className="flex-shrink-0 rounded-2xl p-3 flex flex-col items-center gap-1.5"
                      style={{
                        width: "90px",
                        background: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        border: "1.5px solid #fde68a",
                      }}
                    >
                      <div
                        className="rounded-xl flex items-center justify-center"
                        style={{ width: "32px", height: "32px", background: "#fffbeb" }}
                      >
                        <AppIcon iconKey={achievement.icon} size={16} color="#f59e0b" strokeWidth={1.75} />
                      </div>
                      <p style={{ color: "#0f172a", fontSize: "11px", fontWeight: 600, textAlign: "center", lineHeight: 1.2 }}>
                        {achievement.title}
                      </p>
                    </div>
                  ))}
                  {/* Empty achievement slots */}
                  {achievementsList.filter(a => !state.earnedAchievements.includes(a.id)).slice(0, 2).map(achievement => (
                    <div
                      key={achievement.id}
                      className="flex-shrink-0 rounded-2xl p-3 flex flex-col items-center gap-1.5"
                      style={{
                        width: "90px",
                        background: "#f8fafc",
                        border: "1.5px dashed #e2e8f0",
                        opacity: 0.6,
                      }}
                    >
                      <div
                        className="rounded-xl flex items-center justify-center"
                        style={{ width: "32px", height: "32px", background: "#f1f5f9" }}
                      >
                        <AppIcon iconKey={achievement.icon} size={16} color="#cbd5e1" strokeWidth={1.75} />
                      </div>
                      <p style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>
                        {achievement.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Continue Button */}
        <div
          className="absolute bottom-16 left-0 right-0 px-5 py-3"
          style={{
            background: "linear-gradient(to top, #f8fafc 70%, transparent)",
            maxWidth: "430px",
            margin: "0 auto",
          }}
        >
          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${currentStage.color}, ${currentStage.color}cc)`,
              color: "white",
              fontSize: "16px",
              fontWeight: 700,
              border: "none",
              boxShadow: `0 8px 24px ${currentStage.color}40`,
              minHeight: "56px",
            }}
          >
            Continuar el viaje <ChevronRight size={18} />
          </button>
        </div>

        {/* Bottom nav */}
        <BottomNav />
      </div>
      <PixelTutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </MobileLayout>
  );
}