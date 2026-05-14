import React from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Target, Clock, ChevronRight, Sparkles } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { PixelCharacter } from "../components/PixelCharacter";
import { useApp } from "../context/AppContext";
import { stages } from "../data/gameData";
import { AppIcon } from "../components/ui/AppIcon";
import { playNavigate, playBack } from "../utils/sounds";

/* ═══════════════════════════════════════════════════════════════════════════
   STAGE INTRO SCREEN — Explicación contextual antes de las actividades
═══════════════════════════════════════════════════════════════════════════ */

export function StageIntroScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { markStageIntroSeen } = useApp();

  const stageId = Number(id);
  const stage = stages.find(s => s.id === stageId);

  if (!stage || !stage.intro) {
    navigate(`/stage/${stageId}`, { replace: true });
    return null;
  }

  const { intro } = stage;

  const handleBegin = () => {
    playNavigate();
    markStageIntroSeen(stageId);
    navigate(`/stage/${stageId}`);
  };

  const handleBack = () => {
    playBack();
    navigate("/home");
  };

  const activityTypeIcons: Record<string, string> = {
    "multiple-choice": "Selección múltiple",
    "order-steps": "Ordenar pasos",
    "true-false": "Verdadero o Falso",
    "connect-concepts": "Conectar conceptos",
    "word-scramble": "Adivinar palabra",
    "crossword": "Crucigrama",
    "reflection": "Reflexión guiada",
  };

  const activityTypeCounts: Record<string, number> = {};
  stage.activities.forEach(a => {
    activityTypeCounts[a.type] = (activityTypeCounts[a.type] || 0) + 1;
  });

  return (
    <MobileLayout noPadding>
      <div className="flex flex-col min-h-screen" style={{ background: "#f8fafc" }}>

        {/* Hero */}
        <div
          className="relative px-5 pt-12 pb-6"
          style={{
            background: `linear-gradient(160deg, ${stage.color}18, ${stage.color}06)`,
            borderBottom: `1px solid ${stage.borderColor}`,
          }}
        >
          <div
            className="absolute inset-0 opacity-8"
            style={{
              background: `radial-gradient(circle at 85% 15%, ${stage.color}, transparent 55%)`,
              pointerEvents: "none",
            }}
          />
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 mb-5 rounded-xl px-3 py-2"
            style={{
              position: "relative",
              zIndex: 10,
              color: stage.color,
              fontWeight: 600,
              fontSize: "13px",
              background: `${stage.color}12`,
              border: `1px solid ${stage.color}25`,
              minHeight: "40px",
            }}
          >
            <ArrowLeft size={16} />
            Volver
          </button>

          <div className="flex items-start gap-4" style={{ position: "relative", zIndex: 10 }}>
            <div
              className="rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                width: "64px",
                height: "64px",
                background: stage.bgColor,
                border: `2px solid ${stage.borderColor}`,
                boxShadow: `0 4px 16px ${stage.color}20`,
              }}
            >
              <AppIcon iconKey={stage.icon} size={30} color={stage.color} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p style={{ color: stage.color, fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px" }}>
                ETAPA {stage.id} · INTRODUCCIÓN
              </p>
              <h1 style={{ color: "#0f172a", fontSize: "23px", fontWeight: 800, letterSpacing: "-0.4px", marginTop: "2px", lineHeight: 1.15 }}>
                {stage.title}
              </h1>
              <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px", lineHeight: 1.4 }}>
                {stage.subtitle}
              </p>
            </div>
          </div>

          {/* Metadata row */}
          <div className="flex items-center gap-4 mt-4" style={{ position: "relative", zIndex: 10 }}>
            <div className="flex items-center gap-1.5">
              <Clock size={13} color="#64748b" />
              <span style={{ color: "#64748b", fontSize: "12px" }}>~{intro.estimatedMinutes} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen size={13} color="#64748b" />
              <span style={{ color: "#64748b", fontSize: "12px" }}>{stage.activities.length} actividades</span>
            </div>
            <div
              className="px-2 py-0.5 rounded-full"
              style={{ background: `${stage.color}15`, border: `1px solid ${stage.color}30` }}
            >
              <span style={{ color: stage.color, fontSize: "11px", fontWeight: 700 }}>+{stage.xpReward} XP</span>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-32 pt-5 flex flex-col gap-4">

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl p-5"
            style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Target size={15} color={stage.color} />
              <p style={{ color: stage.color, fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
                DE QUE TRATA ESTA ETAPA
              </p>
            </div>
            <p style={{ color: "#1e293b", fontSize: "14px", lineHeight: 1.7 }}>
              {intro.summary}
            </p>
          </motion.div>

          {/* Key Points */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl p-5"
            style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={15} color={stage.color} />
              <p style={{ color: stage.color, fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
                CONCEPTOS CLAVE
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              {intro.keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 rounded-lg flex items-center justify-center"
                    style={{
                      width: "22px",
                      height: "22px",
                      background: `${stage.color}15`,
                      border: `1px solid ${stage.color}30`,
                      marginTop: "1px",
                    }}
                  >
                    <span style={{ color: stage.color, fontSize: "10px", fontWeight: 800 }}>
                      {i + 1}
                    </span>
                  </div>
                  <p style={{ color: "#334155", fontSize: "13px", lineHeight: 1.55, flex: 1 }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Real World Context */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl p-5"
            style={{
              background: `linear-gradient(135deg, ${stage.color}08, ${stage.color}03)`,
              border: `1.5px solid ${stage.color}20`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={15} color={stage.color} />
              <p style={{ color: stage.color, fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
                EN EL MUNDO REAL
              </p>
            </div>
            <p style={{ color: "#334155", fontSize: "13px", lineHeight: 1.7 }}>
              {intro.realWorldContext}
            </p>
          </motion.div>

          {/* Activity Types Preview */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl p-5"
            style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <p style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "12px" }}>
              TIPOS DE ACTIVIDADES
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(activityTypeCounts).map(([type, count]) => (
                <div
                  key={type}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                  style={{
                    background: stage.bgColor,
                    border: `1px solid ${stage.borderColor}`,
                  }}
                >
                  <span style={{ color: stage.color, fontSize: "12px", fontWeight: 600 }}>
                    {activityTypeIcons[type] || type}
                  </span>
                  {count > 1 && (
                    <span
                      className="px-1.5 py-0.5 rounded-full"
                      style={{ background: stage.color, color: "white", fontSize: "10px", fontWeight: 700 }}
                    >
                      ×{count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pixel Tip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-3xl p-5"
            style={{ background: "#fffbeb", border: "1.5px solid #fde68a" }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <PixelCharacter state="explaining" size={52} mood="happy" detailed={false} />
              </div>
              <div className="flex-1">
                <p style={{ color: "#92400e", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "6px" }}>
                  CONSEJO DE PIXEL
                </p>
                <p style={{ color: "#78350f", fontSize: "13px", lineHeight: 1.6 }}>
                  {intro.pixelTip}
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* CTA Button */}
        <div
          className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4"
          style={{
            background: "linear-gradient(to top, #f8fafc 75%, transparent)",
            maxWidth: "430px",
            margin: "0 auto",
          }}
        >
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBegin}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${stage.color}, ${stage.color}cc)`,
              color: "white",
              fontSize: "16px",
              fontWeight: 700,
              border: "none",
              boxShadow: `0 8px 28px ${stage.color}40`,
              cursor: "pointer",
            }}
          >
            Comenzar actividades
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>
    </MobileLayout>
  );
}
