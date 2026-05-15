import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, Circle, Lock, Play, BookOpen, Target, Layers, FileText, ClipboardList, Volume2 } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { useApp } from "../context/AppContext";
import { stages } from "../data/gameData";
import { AppIcon } from "../components/ui/AppIcon";

const STAGE_ACHIEVEMENTS: Record<number, { title: string; description: string }> = {
  1: { title: "Ideador", description: "Aprueba el quiz de Concepto e Idea" },
  2: { title: "Diseñador de Mecánicas", description: "Completa la etapa de Diseño de Mecánicas" },
  3: { title: "Narrador de Mundos", description: "Completa la etapa de Narrativa y Mundo" },
  4: { title: "Planificador Maestro", description: "Completa la etapa de Planificación del Proyecto" },
  5: { title: "Prototipador Ágil", description: "Completa la etapa de Prototipado y Pruebas" },
  6: { title: "Game Presenter", description: "Completa todas las etapas del viaje" },
};

function TreasureChest() {
  return (
    <svg viewBox="0 0 100 90" width="90" height="82" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="50" cy="87" rx="33" ry="5" fill="rgba(0,0,0,0.13)" />
      {/* Chest body */}
      <rect x="8" y="46" width="84" height="40" rx="5" fill="#8B5A2B" />
      <rect x="8" y="46" width="84" height="11" rx="4" fill="#9C6535" />
      {/* Lid */}
      <rect x="8" y="17" width="84" height="32" rx="13" fill="#9C6535" />
      <rect x="12" y="19" width="76" height="16" rx="10" fill="#B07945" />
      {/* Shine on lid */}
      <ellipse cx="38" cy="26" rx="15" ry="4.5" fill="rgba(255,255,255,0.17)" transform="rotate(-8 38 26)" />
      {/* Gold band lid-body joint */}
      <rect x="8" y="43" width="84" height="8" rx="0" fill="#D4A030" />
      <rect x="8" y="43" width="84" height="3" rx="0" fill="#E8B840" />
      {/* Mid band on body */}
      <rect x="8" y="63" width="84" height="4" fill="#C89020" />
      <rect x="8" y="63" width="84" height="2" fill="#E0AA30" />
      {/* Lock plate */}
      <rect x="37" y="49" width="26" height="17" rx="4" fill="#E8B840" />
      <rect x="38.5" y="50.5" width="23" height="14" rx="3" fill="#D09828" />
      {/* Keyhole */}
      <circle cx="50" cy="55.5" r="3.5" fill="#6B3810" />
      <rect x="48.5" y="57.5" width="3" height="5" rx="1" fill="#6B3810" />
      {/* Corner rivets */}
      <circle cx="19" cy="49" r="3.8" fill="#E8B840" />
      <circle cx="81" cy="49" r="3.8" fill="#E8B840" />
      <circle cx="19" cy="75" r="3.8" fill="#E8B840" />
      <circle cx="81" cy="75" r="3.8" fill="#E8B840" />
      {/* Lid corner rivets */}
      <circle cx="19" cy="24" r="3" fill="#E8B840" />
      <circle cx="81" cy="24" r="3" fill="#E8B840" />
      {/* Sparkles */}
      <g opacity="0.85">
        <line x1="94" y1="10" x2="94" y2="18" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
        <line x1="90" y1="14" x2="98" y2="14" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
        <line x1="91.5" y1="11.5" x2="96.5" y2="16.5" stroke="#FFD700" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="96.5" y1="11.5" x2="91.5" y2="16.5" stroke="#FFD700" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      <g opacity="0.65">
        <line x1="5" y1="5" x2="5" y2="11" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="8" x2="8" y2="8" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

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
            onClick={() => navigate("/home")}
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
              className="rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{
                width: "124px",
                height: "124px",
                background: stage.bgColor,
                border: `1.5px solid ${stage.borderColor}`,
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}imagenesetapas/Etapa ${stageId}.png`}
                alt={`Etapa ${stageId}`}
                style={{ width: "130%", height: "130%", objectFit: "cover", transform: "scale(1.3)" }}
              />
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
              <p style={{ color: stage.color, fontSize: "12px", fontWeight: 700 }}>OBJETIVO</p>
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

          {/* Rewards card */}
          {(() => {
            const achievement = STAGE_ACHIEVEMENTS[stageId];
            const nextStage = stages.find(s => s.id === stageId + 1);
            const totalActivitiesXp = stage.activities.reduce((sum, a) => sum + a.xp, 0);
            const totalXp = totalActivitiesXp + stage.xpReward;
            return (
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 60%, #fde68a44 100%)",
                  border: "1.5px solid #fde68a",
                  boxShadow: "0 4px 16px rgba(234,179,8,0.12)",
                }}
              >
                {/* Header strip */}
                <div className="px-4 pt-4 pb-2">
                  <p style={{ color: "#92400e", fontSize: "11px", fontWeight: 800, letterSpacing: "0.6px", textTransform: "uppercase" }}>
                    Recompensa por superar
                  </p>
                </div>

                {/* Body: rewards left, chest right */}
                <div className="flex items-end px-4 pb-4 gap-2">
                  {/* Reward rows */}
                  <div className="flex-1 flex flex-col gap-2.5">

                    {/* XP */}
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ width: "30px", height: "30px", background: "#fef08a" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M13 2L4.09 12.5H11L10 22L19.91 11.5H13L13 2Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.4" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span style={{ color: "#78350f", fontSize: "15px", fontWeight: 800 }}>+{totalXp} XP</span>
                    </div>

                    {/* Achievement */}
                    {achievement && (
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ width: "30px", height: "30px", background: "#fef08a" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                              fill="#f59e0b" stroke="#d97706" strokeWidth="1.4" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <span style={{ color: "#78350f", fontSize: "14px", fontWeight: 700 }}>+1 Insignia</span>
                          <span style={{ color: "#a16207", fontSize: "12px", fontWeight: 500 }}> · {achievement.title}</span>
                        </div>
                      </div>
                    )}

                    {/* Next stage */}
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ width: "30px", height: "30px", background: "#fef08a" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                            fill="none" stroke="#d97706" strokeWidth="1.6" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span style={{ color: "#78350f", fontSize: "14px", fontWeight: 700 }}>
                        {nextStage ? `Acceso a Etapa ${nextStage.id}` : "¡Juego Completado!"}
                      </span>
                    </div>

                  </div>

                  {/* Chest illustration */}
                  <div className="flex-shrink-0" style={{ marginBottom: "-4px" }}>
                    <TreasureChest />
                  </div>
                </div>
              </div>
            );
          })()}

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