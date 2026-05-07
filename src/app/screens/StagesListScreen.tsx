import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Lock, ChevronRight, CheckCircle, FileText, Zap, X } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { BottomNav } from "../components/BottomNav";
import { useApp } from "../context/AppContext";
import { stages } from "../data/gameData";
import { AppIcon } from "../components/ui/AppIcon";
import { playNavigate, playClick } from "../utils/sounds";

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
        <div className="flex-1 overflow-y-auto pb-20" style={{ background: "#f8fafc" }}>

          {/* Header */}
          <div
            className="px-5 pt-12 pb-6"
            style={{ background: "linear-gradient(160deg, #1e3a5f 0%, #1a2d5a 100%)" }}
          >
            <h1 style={{ color: "white", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.3px" }}>
              Las 6 etapas
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>
              Tu camino hacia el proyecto de videojuego completo
            </p>
          </div>

          {/* Timeline stages */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex flex-col gap-0">
              {stages.map((stage, index) => {
                const status = state.stageStatuses[stage.id]?.status || "locked";
                const isLocked = status === "locked";
                const isCurrent = status === "current";
                const isCompleted = status === "completed";
                const quizScore = state.stageStatuses[stage.id]?.quizScore || 0;
                const quizTotal = stage.quiz.length;
                const activitiesDone = state.stageStatuses[stage.id]?.activitiesCompleted.length || 0;

                return (
                  <div key={stage.id} className="flex gap-3">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center" style={{ width: "32px" }}>
                      <div
                        className="rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{
                          width: "32px",
                          height: "32px",
                          background: isCompleted ? "#10b981" : isCurrent ? stage.color : "#e2e8f0",
                          border: isCurrent ? `3px solid ${stage.color}40` : "none",
                          marginTop: "16px",
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle size={16} color="white" strokeWidth={2.5} />
                        ) : isLocked ? (
                          <Lock size={14} color="#94a3b8" />
                        ) : (
                          <span style={{ color: "white", fontWeight: 800, fontSize: "12px" }}>{stage.id}</span>
                        )}
                      </div>
                      {index < stages.length - 1 && (
                        <div
                          className="flex-1 w-0.5 my-1"
                          style={{
                            background: isCompleted ? "#10b981" : "#e2e8f0",
                            minHeight: "20px",
                          }}
                        />
                      )}
                    </div>

                    {/* Stage card */}
                    <motion.button
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.07 }}
                      onClick={() => handleStageClick(stage.id, isLocked)}
                      disabled={isLocked}
                      className="flex-1 rounded-3xl p-4 mb-3 text-left transition-all active:scale-98"
                      style={{
                        background: isLocked ? "#f1f5f9" : isCompleted ? "#ecfdf5" : "white",
                        border: isCurrent ? `2px solid ${stage.color}` : isCompleted ? "1.5px solid #a7f3d0" : "1.5px solid #e2e8f0",
                        boxShadow: isLocked ? "none" : "0 2px 12px rgba(0,0,0,0.06)",
                        opacity: isLocked ? 0.65 : 1,
                        cursor: isLocked ? "not-allowed" : "pointer",
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              width: "36px",
                              height: "36px",
                              background: isLocked ? "#e2e8f0" : isCompleted ? "#ecfdf5" : stage.bgColor,
                              filter: isLocked ? "grayscale(0.5)" : "none",
                            }}
                          >
                            {isLocked ? (
                              <Lock size={16} color="#94a3b8" />
                            ) : (
                              <AppIcon iconKey={stage.icon} size={18} color={isCompleted ? "#10b981" : stage.color} strokeWidth={1.75} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p style={{ color: "#64748b", fontSize: "11px", fontWeight: 500 }}>
                                Etapa {stage.id}
                              </p>
                              {isCurrent && (
                                <span
                                  className="px-1.5 py-0.5 rounded-md"
                                  style={{ background: stage.color, color: "white", fontSize: "9px", fontWeight: 700 }}
                                >
                                  ACTUAL
                                </span>
                              )}
                              {isCompleted && (
                                <span
                                  className="px-1.5 py-0.5 rounded-md"
                                  style={{ background: "#10b981", color: "white", fontSize: "9px", fontWeight: 700 }}
                                >
                                  ✓ LISTA
                                </span>
                              )}
                            </div>
                            <p style={{
                              color: isLocked ? "#94a3b8" : "#0f172a",
                              fontSize: "15px",
                              fontWeight: 700,
                            }}>
                              {stage.title}
                            </p>
                          </div>
                        </div>
                        {!isLocked && <ChevronRight size={18} color={isCompleted ? "#10b981" : stage.color} />}
                      </div>

                      <p style={{ color: "#64748b", fontSize: "13px", lineHeight: 1.4, marginBottom: "10px" }}>
                        {stage.subtitle}
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <FileText size={12} color="#94a3b8" strokeWidth={1.75} />
                          <span style={{ color: "#64748b", fontSize: "12px" }}>
                            {activitiesDone}/{stage.activities.length} actividades
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Zap size={12} color="#f59e0b" strokeWidth={1.75} fill="#f59e0b" />
                          <span style={{ color: "#64748b", fontSize: "12px" }}>
                            {stage.xpReward} XP
                          </span>
                        </div>
                        {isCompleted && quizTotal > 0 && (
                          <div className="flex items-center gap-1">
                            <CheckCircle size={12} color="#10b981" />
                            <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 600 }}>
                              {quizScore}/{quizTotal} quiz
                            </span>
                          </div>
                        )}
                      </div>

                      {!isLocked && stage.activities.length > 0 && (
                        <div className="mt-2 h-1.5 rounded-full" style={{ background: isCompleted ? "#d1fae5" : `${stage.color}20` }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: isCompleted ? "100%" : `${(activitiesDone / stage.activities.length) * 100}%`,
                              background: isCompleted ? "#10b981" : stage.color,
                            }}
                          />
                        </div>
                      )}
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </MobileLayout>
  );
}