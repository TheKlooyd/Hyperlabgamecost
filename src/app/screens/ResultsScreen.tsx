import React from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, Share2, Trophy, Zap, Award, Lock } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { useApp } from "../context/AppContext";
import { stages } from "../data/gameData";
import { AppIcon } from "../components/ui/AppIcon";

const stageSummaries = [
  {
    stageId: 1,
    iconKey: "lightbulb",
    color: "#3b82f6",
    title: "Tu Concepto",
    summary:
      "Has definido la visión base de tu videojuego: el género, el público objetivo, la propuesta de valor y la sinopsis que comunicará tu idea al mundo.",
  },
  {
    stageId: 2,
    iconKey: "maximize",
    color: "#8b5cf6",
    title: "Tu Alcance",
    summary:
      "Has definido qué tan grande será tu proyecto, identificado qué características tienen mayor impacto en el presupuesto y aprendido a delimitar el alcance para que sea viable.",
  },
  {
    stageId: 3,
    iconKey: "users",
    color: "#f97316",
    title: "Tu Equipo y Recursos",
    summary:
      "Has identificado los roles necesarios, evaluado los costos del talento humano y elegido las herramientas adecuadas para desarrollar tu juego dentro del presupuesto.",
  },
  {
    stageId: 4,
    iconKey: "banknote",
    color: "#ec4899",
    title: "Tus Costos de Producción",
    summary:
      "Has aprendido a distinguir costos fijos de variables, priorizar gastos según su impacto en la experiencia del jugador y detectar costos ocultos que suelen sorprender a los equipos novatos.",
  },
  {
    stageId: 5,
    iconKey: "bar-chart",
    color: "#14b8a6",
    title: "Tu Presupuesto",
    summary:
      "Has construido una estimación de presupuesto estructurada, evaluado la viabilidad real de tu proyecto y aplicado estrategias para ajustar el plan cuando los costos superan los recursos.",
  },
  {
    stageId: 6,
    iconKey: "trending-up",
    color: "#f59e0b",
    title: "Tu Pitch Financiero",
    summary:
      "Has aprendido a justificar tus decisiones presupuestales, comunicar el alcance con honestidad y presentar un pitch financiero que genera confianza en evaluadores e inversores.",
  },
];

export function ResultsScreen() {
  const navigate = useNavigate();
  const { state, getTotalProgress } = useApp();
  const totalProgress = getTotalProgress();

  const completedStages = stages.filter(
    s => state.stageStatuses[s.id]?.status === "completed"
  );

  return (
    <MobileLayout noPadding hideAssistant>
      <div className="flex flex-col min-h-screen" style={{ background: "#f8fafc" }}>
        <div className="flex-1 overflow-y-auto pb-8">

          {/* Hero */}
          <div
            className="px-5 pt-12 pb-8 relative overflow-hidden"
            style={{ background: "linear-gradient(160deg, #1e3a5f 0%, #0f172a 100%)" }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
              style={{ background: "#3b82f6", filter: "blur(60px)", transform: "translate(30%, -30%)", pointerEvents: "none" }}
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
              style={{ background: "#8b5cf6", filter: "blur(50px)", transform: "translateX(-30%)", pointerEvents: "none" }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex flex-col items-center text-center gap-4"
            >
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: "80px",
                  height: "80px",
                  background: "rgba(245,158,11,0.15)",
                  border: "2px solid rgba(245,158,11,0.3)",
                }}
              >
                <Trophy size={40} color="#f59e0b" strokeWidth={1.25} />
              </div>
              <div>
                <p style={{ color: "#f59e0b", fontSize: "12px", fontWeight: 700, letterSpacing: "1px" }}>
                  PROYECTO COMPLETADO
                </p>
                <h1
                  style={{
                    color: "white",
                    fontSize: "26px",
                    fontWeight: 800,
                    letterSpacing: "-0.3px",
                    lineHeight: 1.2,
                    marginTop: "6px",
                  }}
                >
                  Tu videojuego
                  <br />
                  está planificado
                </h1>
                <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "8px", lineHeight: 1.5 }}>
                  Completaste el viaje del diseño de videojuego. Tu proyecto va tomando forma.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="px-4 py-2 rounded-2xl flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <Zap size={16} color="#f59e0b" fill="#f59e0b" strokeWidth={1.5} />
                  <span style={{ color: "#f59e0b", fontSize: "16px", fontWeight: 800 }}>
                    {state.xp.toLocaleString()} XP
                  </span>
                </div>
                <div
                  className="px-4 py-2 rounded-2xl flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <Award size={16} color="#a78bfa" strokeWidth={1.75} />
                  <span style={{ color: "#a78bfa", fontSize: "16px", fontWeight: 800 }}>
                    {completedStages.length}/{stages.length} etapas
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="px-5 pt-5 flex flex-col gap-4">

            {/* Overall progress */}
            <div
              className="rounded-3xl p-4"
              style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              <p style={{ color: "#0f172a", fontSize: "14px", fontWeight: 700, marginBottom: "10px" }}>
                Resumen del viaje
              </p>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-3 rounded-full" style={{ background: "#f1f5f9" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #3b82f6, #10b981)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${totalProgress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
                <span style={{ color: "#3b82f6", fontSize: "16px", fontWeight: 800 }}>{totalProgress}%</span>
              </div>
              <div className="flex items-center justify-between">
                <p style={{ color: "#64748b", fontSize: "12px" }}>
                  {state.totalActivitiesCompleted} actividades completadas
                </p>
                <p style={{ color: "#64748b", fontSize: "12px" }}>
                  {state.earnedAchievements.length} logros ganados
                </p>
              </div>
            </div>

            {/* Title */}
            <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: 700 }}>
              Lo que construiste en cada etapa
            </h3>

            {/* Stage summary cards */}
            {stageSummaries.map((summary, index) => {
              const stage = stages.find(s => s.id === summary.stageId);
              const stageStatus = state.stageStatuses[summary.stageId];
              const isCompleted = stageStatus?.status === "completed";
              const isPending = stageStatus?.status !== "completed";

              return (
                <motion.div
                  key={summary.stageId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-3xl p-4"
                  style={{
                    background: isCompleted ? "white" : "#f8fafc",
                    boxShadow: isCompleted ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
                    border: isCompleted ? "1.5px solid #e2e8f0" : "1.5px dashed #e2e8f0",
                    opacity: isPending ? 0.65 : 1,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        width: "48px",
                        height: "48px",
                        background: isCompleted ? `${summary.color}15` : "#e2e8f0",
                      }}
                    >
                      {isPending ? (
                        <Lock size={20} color="#94a3b8" />
                      ) : (
                        <AppIcon iconKey={summary.iconKey} size={22} color={summary.color} strokeWidth={1.75} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p style={{ color: summary.color, fontSize: "11px", fontWeight: 700 }}>
                          ETAPA {summary.stageId}
                        </p>
                        {isCompleted && (
                          <span style={{ color: "#10b981", fontSize: "11px", fontWeight: 700 }}>✓ COMPLETADA</span>
                        )}
                      </div>
                      <p style={{ color: isCompleted ? "#0f172a" : "#94a3b8", fontSize: "15px", fontWeight: 700 }}>
                        {summary.title}
                      </p>
                      <p style={{ color: "#64748b", fontSize: "13px", lineHeight: 1.5, marginTop: "4px" }}>
                        {isPending ? "Completa esta etapa para ver tu progreso aquí." : summary.summary}
                      </p>

                      {isCompleted && stage && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {stage.topics.slice(0, 3).map((topic, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-lg"
                              style={{
                                background: `${summary.color}10`,
                                color: summary.color,
                                fontSize: "11px",
                                fontWeight: 500,
                              }}
                            >
                              {topic}
                            </span>
                          ))}
                          {stage.topics.length > 3 && (
                            <span
                              className="px-2 py-0.5 rounded-lg"
                              style={{ background: "#f1f5f9", color: "#64748b", fontSize: "11px" }}
                            >
                              +{stage.topics.length - 3} más
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Closing message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="rounded-3xl p-6 text-center"
              style={{
                background: "linear-gradient(135deg, #1e3a5f, #1a2d5a)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              }}
            >
              <div
                className="rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ width: "56px", height: "56px", background: "rgba(59,130,246,0.2)", border: "1.5px solid rgba(59,130,246,0.3)" }}
              >
                <Trophy size={28} color="#60a5fa" strokeWidth={1.5} />
              </div>
              <h3 style={{ color: "white", fontSize: "18px", fontWeight: 800, marginTop: "10px" }}>
                Tu proyecto de videojuego tiene presupuesto
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "6px", lineHeight: 1.6 }}>
                Ahora sabes cuánto cuesta hacer un videojuego, qué decisiones impactan el presupuesto y cómo comunicar un plan financiero convincente. Ese conocimiento es tu mayor activo.
              </p>
            </motion.div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 mt-2 pb-6">
              <button
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 700,
                  border: "none",
                  boxShadow: "0 8px 24px rgba(59,130,246,0.35)",
                }}
              >
                <Share2 size={16} />
                Compartir mi proyecto
              </button>
              <button
                onClick={() => navigate("/home")}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                  background: "white",
                  color: "#3b82f6",
                  fontSize: "15px",
                  fontWeight: 700,
                  border: "2px solid #bfdbfe",
                }}
              >
                Volver al inicio <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
