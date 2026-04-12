import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { CheckCircle, XCircle, Lightbulb, ChevronRight, RotateCcw, PenLine, Zap } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { PixelCompanion } from "../components/PixelCompanion";
import { useChatbot } from "../context/ChatbotContext";
import confetti from "canvas-confetti";

interface FeedbackState {
  correct: boolean;
  xp: number;
  explanation: string;
  hint: string;
  stageId: number;
  activityId: string;
  nextPath: string;
  isReflection?: boolean;
}

export function FeedbackScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as FeedbackState;
  const { addNotification } = useChatbot();

  useEffect(() => {
    if (state?.correct && !state?.isReflection) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"],
        disableForReducedMotion: true,
      });

      // Pixel celebra
      addNotification({
        type: "success-celebration",
        message: `¡Exacto! Identificaste la respuesta correcta. Has ganado +${state.xp} XP. Tu comprensión está creciendo.`,
        mood: "celebrating",
        pixelState: "correct",
        priority: "high",
        showBubble: true,
      });
    } else if (!state?.correct && !state?.isReflection) {
      // Pixel da apoyo
      addNotification({
        type: "error-support",
        message: `No te preocupes, es parte del aprendizaje. ${state?.hint || "Revisa la explicación y vuelve a intentarlo."} Cada error te ayuda a mejorar.`,
        mood: "helping",
        pixelState: "encouraging",
        priority: "high",
        showBubble: true,
      });
    } else if (state?.isReflection) {
      // Pixel reconoce la reflexión
      addNotification({
        type: "encouragement",
        message: "Excelente reflexión. Tomarte el tiempo para pensar profundamente es clave para aprender de verdad.",
        mood: "happy",
        pixelState: "welcome",
        priority: "normal",
        showBubble: true,
      });
    }
  }, [state, addNotification]);

  if (!state) {
    navigate("/home");
    return null;
  }

  const { correct, xp, explanation, hint, stageId, activityId, nextPath, isReflection } = state;

  const handleRetry = () => {
    navigate(`/activity/${stageId}/${activityId}`);
  };

  const handleContinue = () => {
    navigate(nextPath || `/stage/${stageId}`);
  };

  return (
    <MobileLayout noPadding hideAssistant>
      {/* PIXEL COMPANION - Centro para alta prioridad */}
      <PixelCompanion 
        position="left-side" 
        forceShow={true}
        context="feedback" 
      />
      
      <div
        className="flex flex-col min-h-screen"
        style={{
          background: isReflection
            ? "linear-gradient(160deg, #eff6ff 0%, #f8fafc 100%)"
            : correct
            ? "linear-gradient(160deg, #ecfdf5 0%, #f8fafc 100%)"
            : "linear-gradient(160deg, #fff7ed 0%, #f8fafc 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-30"
          style={{
            background: isReflection ? "#3b82f6" : correct ? "#10b981" : "#f97316",
            filter: "blur(80px)",
            transform: "translate(30%, -30%)",
          }}
        />

        <div className="flex flex-col flex-1 items-center justify-center px-6 py-12 gap-6 relative">
          {/* Result icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex items-center justify-center rounded-full"
            style={{
              width: "100px",
              height: "100px",
              background: isReflection ? "#eff6ff" : correct ? "#ecfdf5" : "#fff7ed",
              border: `3px solid ${isReflection ? "#3b82f6" : correct ? "#10b981" : "#f97316"}`,
            }}
          >
            {isReflection ? (
              <PenLine size={52} color="#3b82f6" strokeWidth={1.25} />
            ) : correct ? (
              <CheckCircle size={52} color="#10b981" strokeWidth={1.5} />
            ) : (
              <XCircle size={52} color="#f97316" strokeWidth={1.5} />
            )}
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center flex flex-col gap-2"
          >
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 800,
                color: isReflection ? "#1e40af" : correct ? "#065f46" : "#9a3412",
                letterSpacing: "-0.3px",
              }}
            >
              {isReflection
                ? "Reflexión guardada"
                : correct
                ? "Muy bien"
                : "Casi lo logras"}
            </h1>
            <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.5 }}>
              {isReflection
                ? "Tu reflexión ha sido registrada. Sigue construyendo tu proyecto."
                : correct
                ? "Identificaste correctamente la respuesta. Sigue así."
                : "No pasa nada. Aprender del error es parte del proceso."}
            </p>
          </motion.div>

          {/* XP badge */}
          {xp > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl"
              style={{
                background: "#fffbeb",
                border: "2px solid #fde68a",
                boxShadow: "0 4px 16px rgba(245,158,11,0.2)",
              }}
            >
              <Zap size={22} color="#d97706" fill="#f59e0b" strokeWidth={1.5} />
              <span style={{ color: "#d97706", fontSize: "18px", fontWeight: 800 }}>+{xp} XP ganados</span>
            </motion.div>
          )}

          {/* Explanation card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full rounded-3xl p-5"
            style={{
              background: "white",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              border: `1.5px solid ${isReflection ? "#bfdbfe" : correct ? "#a7f3d0" : "#fed7aa"}`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="rounded-lg flex items-center justify-center"
                style={{
                  width: "32px",
                  height: "32px",
                  background: isReflection ? "#eff6ff" : correct ? "#ecfdf5" : "#fff7ed",
                }}
              >
                {isReflection ? (
                  <Lightbulb size={16} color="#3b82f6" />
                ) : correct ? (
                  <CheckCircle size={18} color="#10b981" />
                ) : (
                  <Lightbulb size={18} color="#f97316" />
                )}
              </div>
              <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: 700 }}>
                {isReflection ? "¿Por qué es importante esto?" : correct ? "¿Por qué esta respuesta?" : "Entendiendo el error"}
              </p>
            </div>
            <p style={{ color: "#475569", fontSize: "13px", lineHeight: 1.6 }}>
              {explanation}
            </p>
          </motion.div>

          {/* Hint card for incorrect */}
          {!correct && !isReflection && hint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="w-full rounded-2xl p-4 flex gap-3"
              style={{ background: "#fffbeb", border: "1.5px solid #fde68a" }}
            >
              <Lightbulb size={18} color="#f59e0b" className="flex-shrink-0 mt-0.5" />
              <div>
                <p style={{ color: "#92400e", fontSize: "12px", fontWeight: 700, marginBottom: "2px" }}>
                  PISTA PARA PRÓXIMO INTENTO
                </p>
                <p style={{ color: "#78350f", fontSize: "13px", lineHeight: 1.5 }}>{hint}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="px-6 pb-12 flex flex-col gap-3"
        >
          {!correct && !isReflection && (
            <button
              onClick={handleRetry}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{
                background: "white",
                color: "#f97316",
                fontSize: "15px",
                fontWeight: 700,
                border: "2px solid #fed7aa",
              }}
            >
              <RotateCcw size={16} />
              Intentar de nuevo
            </button>
          )}
          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              background: isReflection
                ? "#3b82f6"
                : correct
                ? "#10b981"
                : "#f97316",
              color: "white",
              fontSize: "15px",
              fontWeight: 700,
              border: "none",
              boxShadow: `0 8px 24px ${isReflection ? "#3b82f640" : correct ? "#10b98140" : "#f9731640"}`,
            }}
          >
            Continuar <ChevronRight size={18} />
          </button>
        </motion.div>
      </div>
    </MobileLayout>
  );
}