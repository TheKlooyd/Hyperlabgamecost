import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, Circle, Lock, Play, BookOpen, Target, Layers, FileText, ClipboardList, Volume2 } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { useApp } from "../context/AppContext";
import { stages } from "../data/gameData";
import { AppIcon } from "../components/ui/AppIcon";

const STAGE_AUDIOS: Record<number, string> = {
  1: `${import.meta.env.BASE_URL}Audios/primeraetapa.mp3`,
  2: `${import.meta.env.BASE_URL}Audios/segundaetapa.mp3`,
  3: `${import.meta.env.BASE_URL}Audios/terceraetapa.mp3`,
  4: `${import.meta.env.BASE_URL}Audios/cuartaetapa.mp3`,
  5: `${import.meta.env.BASE_URL}Audios/quintaetapa.mp3`,
  6: `${import.meta.env.BASE_URL}Audios/sextaetapa.mp3`,
};

export function StageDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();

  const stageId = Number(id);
  const stage = stages.find(s => s.id === stageId);
  const stageStatus = state.stageStatuses[stageId];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    const src = STAGE_AUDIOS[stageId];
    if (!src) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [stageId]);

  // Navigate to intro if not yet seen and stage is accessible
  useEffect(() => {
    if (stage && stageStatus && stageStatus.status !== "locked") {
      const introSeen = (state.stagesIntroSeen ?? []).includes(stageId);
      if (!introSeen) {
        navigate(`/stage/${stageId}/intro`, { replace: true });
      }
    }
  }, [stageId, stage, stageStatus, state.stagesIntroSeen, navigate]);

  if (!stage || !stageStatus) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <p style={{ color: "#64748b" }}>Etapa no encontrada</p>
        </div>
      </MobileLayout>
    );
  }

  const isLocked = stageStatus.status === "locked";
  const isCompleted = stageStatus.status === "completed";
  const activitiesDone = stageStatus.activitiesCompleted.length;
  const activitiesTotal = stage.activities.length;
  const canTakeQuiz = activitiesDone >= activitiesTotal && activitiesTotal > 0;

  const handleStartActivity = (activityIndex: number) => {
    const activity = stage.activities[activityIndex];
    navigate(`/activity/${stage.id}/${activity.id}`);
  };

  const handleStartQuiz = () => {
    navigate(`/quiz/${stage.id}`);
  };

  return (
    <MobileLayout noPadding>
      <div className="flex flex-col min-h-screen" style={{ background: "#f8fafc" }}>

        {/* Hero header */}
        <div
          className="relative px-5 pt-12 pb-8"
          style={{ background: `linear-gradient(160deg, ${stage.color}20, ${stage.color}08)` }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(circle at 80% 20%, ${stage.color}, transparent 60%)`,
              pointerEvents: "none",
            }}
          />
          {/* Back button */}
          <button
            onClick={() => navigate("/stages")}
            className="flex items-center gap-1.5 mb-4 rounded-xl px-3 py-2"
            style={{
              position: "relative",
              zIndex: 10,
              color: stage.color,
              fontWeight: 600,
              fontSize: "14px",
              background: `${stage.color}15`,
              border: `1px solid ${stage.color}30`,
              minHeight: "44px",
            }}
          >
            <ArrowLeft size={18} />
            Volver a etapas
          </button>

          <div className="flex items-start gap-3" style={{ position: "relative", zIndex: 10 }}>
            <div
              className="rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                width: "60px",
                height: "60px",
                background: stage.bgColor,
                border: `1.5px solid ${stage.borderColor}`,
              }}
            >
              <AppIcon iconKey={stage.icon} size={28} color={stage.color} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p style={{ color: stage.color, fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
                ETAPA {stage.id} · {isCompleted ? "COMPLETADA ✓" : stageStatus.status === "current" ? "EN PROGRESO" : "BLOQUEADA"}
              </p>
              <h1 style={{ color: "#0f172a", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.3px", marginTop: "2px", lineHeight: 1.2 }}>
                {stage.title}
              </h1>
              <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>{stage.subtitle}</p>
            </div>
          </div>

          {/* Progress bar */}
          {!isLocked && activitiesTotal > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ color: "#64748b", fontSize: "12px" }}>Actividades</span>
                <span style={{ color: stage.color, fontSize: "12px", fontWeight: 700 }}>
                  {activitiesDone}/{activitiesTotal} completadas
                </span>
              </div>
              <div className="h-2 rounded-full" style={{ background: `${stage.color}20` }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: stage.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(activitiesDone / activitiesTotal) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Audio button */}
        {STAGE_AUDIOS[stageId] && !isLocked && (
          <div className="px-5 pt-2 pb-4 flex justify-center" style={{ background: `${stage.color}08` }}>
            <motion.button
              onClick={handlePlayAudio}
              animate={isPlaying ? { scale: 1 } : { scale: [1, 1.06, 1] }}
              transition={isPlaying ? {} : { repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-4 rounded-3xl px-6 py-4"
              style={{
                background: isPlaying
                  ? `linear-gradient(135deg, ${stage.color}, ${stage.color}cc)`
                  : `linear-gradient(135deg, ${stage.color}, ${stage.color}bb)`,
                boxShadow: isPlaying
                  ? `0 6px 24px ${stage.color}60, 0 2px 8px ${stage.color}30`
                  : `0 8px 28px ${stage.color}50, 0 2px 8px ${stage.color}25`,
                cursor: "pointer",
                border: "none",
                minWidth: "220px",
              }}
            >
              {/* Pulse ring behind icon */}
              <div className="relative flex items-center justify-center flex-shrink-0">
                {!isPlaying && (
                  <motion.div
                    className="absolute rounded-full"
                    style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.25)" }}
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeOut" }}
                  />
                )}
                <div
                  className="rounded-2xl flex items-center justify-center"
                  style={{ width: "44px", height: "44px", background: "rgba(255,255,255,0.22)" }}
                >
                  <Volume2 size={24} color="white" />
                </div>
              </div>

              <div className="flex-1 text-left">
                <p style={{ color: "white", fontSize: "15px", fontWeight: 800, letterSpacing: "-0.2px" }}>
                  {isPlaying ? "Reproduciendo..." : "¡Presióname!"}
                </p>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px", marginTop: "1px" }}>
                  {isPlaying ? "Escucha el resumen de esta etapa" : "Audio de esta etapa 🎧"}
                </p>
              </div>

              {isPlaying ? (
                <div className="flex items-end gap-1" style={{ height: "22px" }}>
                  {[0, 0.18, 0.36, 0.54].map((delay) => (
                    <motion.div
                      key={delay}
                      style={{ width: "3px", background: "rgba(255,255,255,0.9)", borderRadius: "2px" }}
                      animate={{ height: ["5px", "18px", "5px"] }}
                      transition={{ repeat: Infinity, duration: 0.75, delay }}
                    />
                  ))}
                </div>
              ) : (
                <motion.span
                  style={{ fontSize: "20px" }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                >
                  ▶
                </motion.span>
              )}
            </motion.button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-8 flex flex-col gap-4 pt-4">

          {/* Objective card */}
          <div
            className="rounded-3xl p-4"
            style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} color={stage.color} />
              <p style={{ color: stage.color, fontSize: "12px", fontWeight: 700 }}>OBJETIVO DE APRENDIZAJE</p>
            </div>
            <p style={{ color: "#1e293b", fontSize: "14px", lineHeight: 1.6 }}>
              {stage.objective}
            </p>
          </div>

          {/* Topics */}
          <div
            className="rounded-3xl p-4"
            style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} color={stage.color} />
              <p style={{ color: stage.color, fontSize: "12px", fontWeight: 700 }}>CONTENIDOS DE ESTA ETAPA</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {stage.topics.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full"
                  style={{
                    background: stage.bgColor,
                    color: stage.color,
                    fontSize: "12px",
                    fontWeight: 500,
                    border: `1px solid ${stage.borderColor}`,
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers size={16} color="#0f172a" />
              <h3 style={{ color: "#0f172a", fontSize: "15px", fontWeight: 700 }}>Actividades</h3>
            </div>
            <div className="flex flex-col gap-2.5">
              {stage.activities.map((activity, index) => {
                const done = stageStatus.activitiesCompleted.includes(activity.id);
                const isNextToComplete = !done && stageStatus.activitiesCompleted.length === index;
                const activityLocked = isLocked || (index > 0 && !stageStatus.activitiesCompleted.includes(stage.activities[index - 1].id));

                const typeLabels: Record<string, string> = {
                  "multiple-choice": "Selección múltiple",
                  "order-steps": "Ordenar pasos",
                  "fill-blank": "Completar frase",
                  "reflection": "Reflexión guiada",
                  "true-false": "Verdadero o Falso",
                  "connect-concepts": "Conectar conceptos",
                  "word-scramble": "Adivinar palabra",
                  "crossword": "Crucigrama",
                };

                return (
                  <motion.button
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    onClick={() => !activityLocked && handleStartActivity(index)}
                    disabled={activityLocked}
                    className="rounded-2xl p-4 flex items-center gap-3 w-full text-left transition-all active:scale-98"
                    style={{
                      background: done ? "#ecfdf5" : activityLocked ? "#f8fafc" : "white",
                      border: done ? "1.5px solid #a7f3d0" : isNextToComplete ? `2px solid ${stage.color}` : "1.5px solid #e2e8f0",
                      boxShadow: done || activityLocked ? "none" : "0 2px 8px rgba(0,0,0,0.06)",
                      opacity: activityLocked ? 0.6 : 1,
                      cursor: activityLocked ? "not-allowed" : "pointer",
                    }}
                  >
                    <div
                      className="flex-shrink-0 rounded-xl flex items-center justify-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: done ? "#d1fae5" : activityLocked ? "#e2e8f0" : stage.bgColor,
                      }}
                    >
                      {done ? (
                        <CheckCircle2 size={20} color="#10b981" />
                      ) : activityLocked ? (
                        <Lock size={16} color="#94a3b8" />
                      ) : (
                        <Play size={16} color={stage.color} fill={stage.color} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{
                        color: done ? "#065f46" : activityLocked ? "#94a3b8" : "#0f172a",
                        fontSize: "14px",
                        fontWeight: 600
                      }}>
                        {activity.title}
                      </p>
                      <p style={{ color: done ? "#059669" : "#94a3b8", fontSize: "12px" }}>
                        {typeLabels[activity.type]} · +{activity.xp} XP
                      </p>
                    </div>
                    {done && <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 700 }}>✓</span>}
                    {!done && !activityLocked && <span style={{ color: stage.color, fontSize: "18px" }}>›</span>}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Quiz CTA */}
          <div
            className="rounded-3xl p-4"
            style={{
              background: canTakeQuiz ? `linear-gradient(135deg, ${stage.color}15, ${stage.color}05)` : "#f1f5f9",
              border: canTakeQuiz ? `2px solid ${stage.color}40` : "2px dashed #e2e8f0",
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="rounded-xl flex items-center justify-center"
                style={{ width: "44px", height: "44px", background: canTakeQuiz ? stage.bgColor : "#e2e8f0" }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={22} color="#10b981" />
                ) : canTakeQuiz ? (
                  <ClipboardList size={22} color={stage.color} strokeWidth={1.75} />
                ) : (
                  <Lock size={18} color="#94a3b8" />
                )}
              </div>
              <div>
                <p style={{ color: canTakeQuiz ? stage.color : "#94a3b8", fontSize: "12px", fontWeight: 700 }}>
                  {isCompleted ? "QUIZ COMPLETADO" : "QUIZ FINAL DE ETAPA"}
                </p>
                <p style={{ color: canTakeQuiz ? "#0f172a" : "#94a3b8", fontSize: "14px", fontWeight: 700 }}>
                  {stage.quiz.length} preguntas · +{stage.xpReward} XP
                </p>
              </div>
            </div>
            <p style={{ color: canTakeQuiz ? "#475569" : "#94a3b8", fontSize: "13px", lineHeight: 1.5 }}>
              {isCompleted
                ? `Aprobaste con ${stageStatus.quizScore}/${stage.quiz.length} respuestas correctas. ¡Etapa completada!`
                : canTakeQuiz
                ? "¡Completaste todas las actividades! Ahora demuestra tu comprensión en el quiz final."
                : `Completa ${activitiesTotal - activitiesDone} actividad${activitiesTotal - activitiesDone === 1 ? "" : "es"} más para desbloquear el quiz.`}
            </p>
            {canTakeQuiz && !isCompleted && (
              <button
                onClick={handleStartQuiz}
                className="mt-3 w-full py-3 rounded-xl transition-all active:scale-95"
                style={{
                  background: stage.color,
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 700,
                  border: "none",
                }}
              >
                Iniciar quiz final →
              </button>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}