import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { BottomNav } from "../components/BottomNav";
import { useApp } from "../context/AppContext";
import { stages } from "../data/gameData";
import { playNavigate, playClick } from "../utils/sounds";

// Zonas clickeables rectangulares para cada etapa (% del contenedor de la imagen)
// left/top: esquina superior izquierda del rectángulo | width/height: tamaño del área
const STAGE_POSITIONS = [
  { left: "0%",   top: "0%",    width: "55%", height: "18%" }, // Etapa 1
  { left: "45%",  top: "18%",   width: "55%", height: "18%" }, // Etapa 2
  { left: "0%",   top: "36%",   width: "55%", height: "18%" }, // Etapa 3
  { left: "45%",  top: "54%",   width: "55%", height: "17%" }, // Etapa 4
  { left: "0%",   top: "67%",   width: "55%", height: "17%" }, // Etapa 5
  { left: "45%",  top: "82%",   width: "55%", height: "18%" }, // Etapa 6
];

const STAGE_VIDEOS: Record<number, string> = {
  1: `${import.meta.env.BASE_URL}videosetapas/concepto.mp4`,
  2: `${import.meta.env.BASE_URL}videosetapas/Alcance.mp4`,
  3: `${import.meta.env.BASE_URL}videosetapas/equipo.mp4`,
};

export function StagesListScreen() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [videoStage, setVideoStage] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStageClick = (stageId: number, isLocked: boolean) => {
    if (isLocked) { playClick(); return; }
    if (STAGE_VIDEOS[stageId]) {
      playNavigate();
      setVideoStage(stageId);
    } else {
      playNavigate();
      navigate(`/stage/${stageId}`);
    }
  };

  const handleCloseVideo = () => {
    if (videoRef.current) videoRef.current.pause();
    const stageId = videoStage;
    setVideoStage(null);
    if (stageId !== null) navigate(`/stage/${stageId}`);
  };

  const handleStartStage = () => {
    if (videoRef.current) videoRef.current.pause();
    const stageId = videoStage;
    setVideoStage(null);
    if (stageId !== null) { playNavigate(); navigate(`/stage/${stageId}`); }
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
                {/* Close button */}
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
        <div className="flex-1 overflow-y-auto pb-20" style={{ background: "#0d1b2a" }}>

          {/* Header */}
          <div
            className="px-5 pt-12 pb-5"
            style={{ background: "linear-gradient(160deg, #1e3a5f 0%, #1a2d5a 100%)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 style={{ color: "white", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.3px" }}>
                  Las etapas del viaje
                </h1>
                <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "3px" }}>
                  ¡El viaje comienza aquí!
                </p>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.12)" }}
              >
                <span style={{ color: "white", fontSize: "13px", fontWeight: 700 }}>
                  {stages.filter(s => (state.stageStatuses[s.id]?.status || "locked") === "completed").length}/{stages.length}
                </span>
              </div>
            </div>
          </div>

          {/* Mapa de etapas con imagen de fondo */}
          <div style={{ position: "relative", width: "100%" }}>
            <img
              src={`${import.meta.env.BASE_URL}questions_img/Homelevesimage.png`}
              alt="Mapa de las etapas del viaje"
              style={{ width: "100%", display: "block" }}
            />

            {/* Zonas clickeables transparentes sobre cada etapa */}
            {stages.map((stage, index) => {
              const status = state.stageStatuses[stage.id]?.status || "locked";
              const isLocked = status === "locked";
              const pos = STAGE_POSITIONS[index];

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
        </div>

        <BottomNav />
      </div>
    </MobileLayout>
  );
}