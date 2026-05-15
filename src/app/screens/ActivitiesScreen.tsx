import React from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Star,
  Target,
  ClipboardList,
  FileText,
  Lightbulb,
  CheckSquare,
  Link2,
  Type,
  Grid3X3,
  ChevronRight,
} from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { BottomNav } from "../components/BottomNav";
import { AppIcon } from "../components/ui/AppIcon";
import { useApp } from "../context/AppContext";
import { stages, ActivityType } from "../data/gameData";
import { playNavigate, playClick } from "../utils/sounds";

/* ─── Configuración visual por tipo de actividad ─────────────────────────── */
const TYPE_CONFIG: Record<ActivityType, { icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; color: string; bg: string }> = {
  "multiple-choice":  { icon: Target,        color: "#ef4444", bg: "#fee2e2" },
  "order-steps":      { icon: ClipboardList, color: "#3b82f6", bg: "#dbeafe" },
  "fill-blank":       { icon: FileText,      color: "#8b5cf6", bg: "#ede9fe" },
  "reflection":       { icon: Lightbulb,     color: "#f59e0b", bg: "#fef3c7" },
  "true-false":       { icon: CheckSquare,   color: "#10b981", bg: "#d1fae5" },
  "connect-concepts": { icon: Link2,         color: "#06b6d4", bg: "#cffafe" },
  "word-scramble":    { icon: Type,          color: "#ec4899", bg: "#fce7f3" },
  "crossword":        { icon: Grid3X3,       color: "#6366f1", bg: "#e0e7ff" },
};

const TYPE_LABELS: Record<ActivityType, string> = {
  "multiple-choice":  "Selección múltiple",
  "order-steps":      "Ordenar pasos",
  "fill-blank":       "Completar frase",
  "reflection":       "Reflexión guiada",
  "true-false":       "Verdadero o Falso",
  "connect-concepts": "Conectar conceptos",
  "word-scramble":    "Adivinar palabra",
  "crossword":        "Crucigrama",
};

/* ═══════════════════════════════════════════════════════════════════════════
   ACTIVITIES SCREEN — Muestra las actividades de la etapa actual
═══════════════════════════════════════════════════════════════════════════ */
export function ActivitiesScreen() {
  const navigate = useNavigate();
  const { state } = useApp();

  // Buscar la etapa actual ("current"), si todas están completadas usar la última
  const currentEntry = Object.entries(state.stageStatuses).find(([, s]) => s.status === "current");
  const currentStageId = currentEntry
    ? Number(currentEntry[0])
    : Math.max(
        ...Object.entries(state.stageStatuses)
          .filter(([, s]) => s.status === "completed")
          .map(([id]) => Number(id)),
        1
      );

  const stage = stages.find((s) => s.id === currentStageId);
  const stageStatus = state.stageStatuses[currentStageId];

  if (!stage || !stageStatus) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <p style={{ color: "#64748b" }}>No hay etapa activa.</p>
        </div>
      </MobileLayout>
    );
  }

  const activitiesDone = stageStatus.activitiesCompleted.length;
  const activitiesTotal = stage.activities.length;
  const canTakeQuiz = activitiesDone >= activitiesTotal && activitiesTotal > 0;

  const handleContinue = () => {
    playNavigate();
    if (canTakeQuiz && !stageStatus.quizPassed) {
      navigate(`/quiz/${stage.id}`);
    } else {
      navigate(`/stage/${stage.id}`);
    }
  };

  const handleActivityClick = (activityIndex: number, isLocked: boolean) => {
    if (isLocked) return;
    playNavigate();
    navigate(`/activity/${stage.id}/${stage.activities[activityIndex].id}`);
  };

  return (
    <MobileLayout noPadding>
      <div className="flex flex-col min-h-screen" style={{ background: "#f8fafc" }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 pt-12 pb-4"
          style={{ background: "white", borderBottom: "1px solid #e2e8f0" }}
        >
          <button
            onClick={() => { playClick(); navigate(-1); }}
            className="flex items-center justify-center rounded-xl"
            style={{ width: 38, height: 38, color: "#0f172a" }}
          >
            <ArrowLeft size={22} />
          </button>
          <h1 style={{ color: "#0f172a", fontSize: "17px", fontWeight: 700 }}>Actividades</h1>
          <div style={{ width: 38 }} />
        </div>

        {/* ── Stage banner ─────────────────────────────────────────────────── */}
        <div
          className="px-5 py-4 flex items-center gap-3"
          style={{
            background: `linear-gradient(135deg, ${stage.color}18, ${stage.color}06)`,
            borderBottom: `1px solid ${stage.color}25`,
          }}
        >
          <div
            className="rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              background: stage.bgColor,
              border: `1.5px solid ${stage.borderColor}`,
            }}
          >
            <AppIcon iconKey={stage.icon} size={24} color={stage.color} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ color: stage.color, fontSize: "11px", fontWeight: 700, letterSpacing: "0.4px" }}>
              ETAPA {stage.id} · {stageStatus.status === "completed" ? "COMPLETADA ✓" : "EN PROGRESO"}
            </p>
            <p
              style={{
                color: "#0f172a",
                fontSize: "14px",
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {stage.title}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p style={{ color: stage.color, fontSize: "14px", fontWeight: 700 }}>
              {activitiesDone}/{activitiesTotal}
            </p>
            <p style={{ color: "#94a3b8", fontSize: "11px" }}>completadas</p>
          </div>
        </div>

        {/* ── Progress bar ─────────────────────────────────────────────────── */}
        <div className="px-5 py-3" style={{ background: "white", borderBottom: "1px solid #f1f5f9" }}>
          <div className="h-2 rounded-full" style={{ background: `${stage.color}20` }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: stage.color }}
              initial={{ width: 0 }}
              animate={{
                width: activitiesTotal > 0 ? `${(activitiesDone / activitiesTotal) * 100}%` : "0%",
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* ── Activity list (grouped) ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-36 flex flex-col gap-5">
          <p
            style={{
              color: "#94a3b8",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.6px",
              marginBottom: "0px",
            }}
          >
            LISTADO DE ACTIVIDADES
          </p>

          {/* Chunk activities into groups of 3 */}
          {Array.from(
            { length: Math.ceil(stage.activities.length / 3) },
            (_, groupIndex) => {
              const groupActivities = stage.activities.slice(
                groupIndex * 3,
                groupIndex * 3 + 3
              );
              const groupStartIndex = groupIndex * 3;
              const groupDoneCount = groupActivities.filter((a) =>
                stageStatus.activitiesCompleted.includes(a.id)
              ).length;
              const groupComplete = groupDoneCount === groupActivities.length;
              const groupLabel =
                stage.activityGroupTitles?.[groupIndex] ??
                `Módulo ${groupIndex + 1}`;

              return (
                <motion.div
                  key={groupIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.08 }}
                  className="rounded-3xl overflow-hidden"
                  style={{
                    background: "white",
                    border: `1.5px solid ${groupComplete ? "#a7f3d0" : stage.color + "30"}`,
                    boxShadow: `0 3px 12px ${stage.color}12`,
                  }}
                >
                  {/* ── Group header ── */}
                  <div
                    className="flex items-center gap-4 px-4 pt-4 pb-3"
                    style={{
                      borderBottom: `1px solid ${groupComplete ? "#a7f3d0" : stage.color + "20"}`,
                      background: groupComplete
                        ? "linear-gradient(135deg, #ecfdf5, #d1fae510)"
                        : `linear-gradient(135deg, ${stage.color}12, ${stage.color}04)`,
                    }}
                  >
                    {/* Group icon */}
                    <div
                      className="flex-shrink-0 relative rounded-2xl flex items-center justify-center overflow-visible"
                      style={{
                        width: 90,
                        height: 90,
                        background: groupComplete ? "#d1fae5" : stage.bgColor,
                        border: `2px solid ${groupComplete ? "#a7f3d0" : stage.borderColor}`,
                      }}
                    >
                      {stage.activityGroupIcons?.[groupIndex] ? (
                        <img
                          src={`${import.meta.env.BASE_URL}${stage.activityGroupIcons[groupIndex].replace(/^\//, '')}`}
                          alt=""
                          style={{ width: 72, height: 72, objectFit: "contain" }}
                        />
                      ) : (
                        <Lightbulb size={30} color={stage.color} strokeWidth={1.75} />
                      )}
                      {/* Small completion badge */}
                      {groupComplete && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: -4,
                            right: -4,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "#10b981",
                            border: "2px solid white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CheckCircle2 size={12} color="white" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>

                    {/* Group info */}
                    <div className="flex-1 min-w-0">
                      <p
                        style={{
                          color: groupComplete ? "#065f46" : stage.color,
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.5px",
                          marginBottom: "2px",
                        }}
                      >
                        GRUPO {groupIndex + 1} · {groupDoneCount}/{groupActivities.length} completadas
                      </p>
                      <p
                        style={{
                          color: groupComplete ? "#065f46" : "#0f172a",
                          fontSize: "15px",
                          fontWeight: 700,
                          lineHeight: 1.25,
                        }}
                      >
                        {groupLabel}
                      </p>
                    </div>
                  </div>

                  {/* ── Activity rows inside the group ── */}
                  <div className="flex flex-col">
                    {groupActivities.map((activity, localIdx) => {
                      const index = groupStartIndex + localIdx;
                      const done = stageStatus.activitiesCompleted.includes(activity.id);
                      const isNextToComplete =
                        !done && stageStatus.activitiesCompleted.length === index;
                      const activityLocked =
                        stageStatus.status === "locked" ||
                        (index > 0 &&
                          !stageStatus.activitiesCompleted.includes(
                            stage.activities[index - 1].id
                          ));

                      const cfg =
                        TYPE_CONFIG[activity.type] ?? TYPE_CONFIG["multiple-choice"];
                      const TypeIcon = cfg.icon;
                      const isLast = localIdx === groupActivities.length - 1;

                      return (
                        <motion.button
                          key={activity.id}
                          whileTap={{ scale: activityLocked ? 1 : 0.98 }}
                          onClick={() => handleActivityClick(index, activityLocked)}
                          disabled={activityLocked}
                          className="flex items-center gap-3 w-full text-left px-4 py-3"
                          style={{
                            background: done ? "#f0fdf4" : "transparent",
                            borderBottom: isLast ? "none" : `1px solid ${stage.color}15`,
                            opacity: activityLocked ? 0.5 : 1,
                            cursor: activityLocked ? "not-allowed" : "pointer",
                          }}
                        >
                          {/* Activity type icon */}
                          <div
                            className="flex-shrink-0 rounded-xl flex items-center justify-center"
                            style={{
                              width: 40,
                              height: 40,
                              background: done
                                ? "#d1fae5"
                                : activityLocked
                                ? "#f1f5f9"
                                : cfg.bg,
                            }}
                          >
                            {done ? (
                              <CheckCircle2 size={20} color="#10b981" />
                            ) : activityLocked ? (
                              <Lock size={16} color="#94a3b8" />
                            ) : (
                              <TypeIcon size={20} color={cfg.color} strokeWidth={1.75} />
                            )}
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p
                              style={{
                                color: done
                                  ? "#065f46"
                                  : activityLocked
                                  ? "#94a3b8"
                                  : "#0f172a",
                                fontSize: "13px",
                                fontWeight: 600,
                                lineHeight: 1.3,
                              }}
                            >
                              {activity.title}
                            </p>
                            <p
                              style={{
                                color: done ? "#059669" : "#94a3b8",
                                fontSize: "11px",
                                marginTop: "1px",
                              }}
                            >
                              {TYPE_LABELS[activity.type]} · +{activity.xp} XP
                            </p>
                            {isNextToComplete && (
                              <div className="flex items-center gap-2 mt-1.5">
                                <div
                                  className="flex-1 h-1 rounded-full"
                                  style={{ background: `${stage.color}25` }}
                                />
                                <Star size={10} color={stage.color} />
                              </div>
                            )}
                          </div>

                          {/* Right state */}
                          {done && (
                            <div
                              className="flex items-center gap-1 px-2 py-1 rounded-full flex-shrink-0"
                              style={{
                                background: "#d1fae5",
                                border: "1px solid #a7f3d0",
                              }}
                            >
                              <CheckCircle2 size={12} color="#10b981" />
                              <span
                                style={{
                                  color: "#059669",
                                  fontSize: "10px",
                                  fontWeight: 600,
                                }}
                              >
                                Completada
                              </span>
                            </div>
                          )}
                          {!done && !activityLocked && (
                            <ChevronRight size={16} color={stage.color} className="flex-shrink-0" />
                          )}
                          {activityLocked && (
                            <Lock size={14} color="#cbd5e1" className="flex-shrink-0" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            }
          )}
        </div>

        {/* ── Continuar etapa button ───────────────────────────────────────── */}
        <div
          className="fixed bottom-0 left-1/2"
          style={{
            transform: "translateX(-50%)",
            width: "min(430px, 100vw)",
            padding: "12px 20px",
            paddingBottom: "max(12px, env(safe-area-inset-bottom))",
            background: "white",
            borderTop: "1px solid #e2e8f0",
            zIndex: 50,
          }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${stage.color}, ${stage.color}cc)`,
              color: "white",
              fontSize: "16px",
              fontWeight: 700,
              boxShadow: `0 4px 16px ${stage.color}40`,
              border: "none",
              cursor: "pointer",
            }}
          >
            {canTakeQuiz && !stageStatus.quizPassed ? "Ir al Quiz Final →" : "Continuar etapa →"}
          </motion.button>
        </div>

        <BottomNav />
      </div>
    </MobileLayout>
  );
}
