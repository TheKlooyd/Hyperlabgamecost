import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, SkipForward, RotateCcw } from "lucide-react";
import { PixelCharacter } from "../components/PixelCharacter";
import { useApp } from "../context/AppContext";

/* ═══════════════════════════════════════════════════════════════════════════
   PIXEL TUTORIAL MODAL - Tutorial automático de primer ingreso
═══════════════════════════════════════════════════════════════════════════ */

type TutorialStep = 
  | "welcome"
  | "intro-stage"
  | "hint"
  | "correct"
  | "incorrect"
  | "complete"
  | "always-here";

interface StepConfig {
  id: TutorialStep;
  title: string;
  pixelState: "welcome" | "explaining" | "correct" | "encouraging" | "completed" | "idle";
  message: string;
  submessage?: string;
}

interface PixelTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PixelTutorialModal({ isOpen, onClose }: PixelTutorialModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { markPixelTutorialAsSeen } = useApp();

  const steps: StepConfig[] = [
    {
      id: "welcome",
      title: "¡Hola! Soy Pixel",
      pixelState: "welcome",
      message: "Soy tu compañero guía en este viaje de aprendizaje sobre presupuestación de videojuegos.",
      submessage: "Estaré contigo en cada paso del camino.",
    },
    {
      id: "intro-stage",
      title: "Explico Cada Etapa",
      pixelState: "explaining",
      message: "Antes de comenzar cada etapa, te explicaré qué aprenderás y por qué es importante.",
      submessage: "Así sabrás qué esperar y estarás mejor preparado.",
    },
    {
      id: "hint",
      title: "Doy Pistas Cuando Las Necesitas",
      pixelState: "explaining",
      message: "Si llevas tiempo sin responder una pregunta, apareceré para darte una pista útil.",
      submessage: "No estás solo, estoy aquí para ayudarte.",
    },
    {
      id: "correct",
      title: "Celebro Tus Aciertos",
      pixelState: "correct",
      message: "¡Cuando respondas correctamente, celebraré contigo! Cada logro merece reconocimiento.",
      submessage: "Tu progreso es importante.",
    },
    {
      id: "incorrect",
      title: "Te Apoyo en los Errores",
      pixelState: "encouraging",
      message: "Si te equivocas, no te preocupes. Te explicaré con empatía y te animaré a intentarlo de nuevo.",
      submessage: "Los errores son oportunidades para aprender.",
    },
    {
      id: "complete",
      title: "Celebramos Juntos los Hitos",
      pixelState: "completed",
      message: "Al completar etapas y logros importantes, estaré ahí para celebrar tu esfuerzo.",
      submessage: "Cada hito es un paso más hacia tu meta.",
    },
    {
      id: "always-here",
      title: "Siempre Estaré Contigo",
      pixelState: "idle",
      message: "Me encontrarás en la esquina inferior derecha. Puedes hacerme clic en cualquier momento si necesitas ayuda.",
      submessage: "¡Comencemos esta aventura juntos!",
    },
  ];

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  /* ═══════════════════════════════════════════════════════════════════════
     HANDLERS
  ═══════════════════════════════════════════════════════════════════════ */

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    markPixelTutorialAsSeen();
    onClose();
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
  };

  /* ═══════════════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════════════ */

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleSkip}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "24px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
              maxWidth: "420px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "24px 24px 16px 24px",
              borderBottom: "1px solid #f1f5f9",
              position: "relative",
            }}>
              {/* Progress dots */}
              <div style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                marginBottom: "16px",
              }}>
                {steps.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: index === currentStepIndex ? "24px" : "8px",
                      height: "8px",
                      borderRadius: "4px",
                      background: index === currentStepIndex 
                        ? "linear-gradient(90deg, #8b5cf6, #6366f1)"
                        : index < currentStepIndex
                        ? "#cbd5e1"
                        : "#e2e8f0",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>

              {/* Close button */}
              <button
                onClick={handleSkip}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#f1f5f9",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                }}
              >
                <X size={18} color="#64748b" />
              </button>

              {/* Step indicator */}
              <div style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#8b5cf6",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                {currentStepIndex + 1} de {steps.length}
              </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{
                  padding: "24px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  flex: 1,
                  overflowY: "auto",
                }}
              >
                {/* Pixel Character */}
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: currentStep.pixelState === "correct" ? [-5, 5, -5] : [0, 0, 0],
                  }}
                  transition={{ 
                    duration: currentStep.pixelState === "correct" ? 0.6 : 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ marginBottom: "16px", flexShrink: 0 }}
                >
                  <PixelCharacter 
                    state={currentStep.pixelState}
                    size={120}
                    mood="happy"
                    detailed={true}
                  />
                </motion.div>

                {/* Title */}
                <h2 style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 16px 0",
                  lineHeight: 1.3,
                }}>
                  {currentStep.title}
                </h2>

                {/* Message */}
                <p style={{
                  fontSize: "15px",
                  color: "#334155",
                  margin: "0 0 12px 0",
                  lineHeight: 1.7,
                }}>
                  {currentStep.message}
                </p>

                {/* Submessage */}
                {currentStep.submessage && (
                  <p style={{
                    fontSize: "14px",
                    color: "#64748b",
                    margin: 0,
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}>
                    {currentStep.submessage}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div style={{
              padding: "20px 24px",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              gap: "12px",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              {/* Botón Saltar (solo si no es último paso) */}
              {!isLastStep && (
                <button
                  onClick={handleSkip}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    background: "white",
                    border: "2px solid #e2e8f0",
                    color: "#64748b",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#cbd5e1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  <SkipForward size={16} />
                  Saltar
                </button>
              )}

              {/* Botón Reiniciar (solo en último paso) */}
              {isLastStep && (
                <button
                  onClick={handleRestart}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    background: "white",
                    border: "2px solid #e2e8f0",
                    color: "#64748b",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#cbd5e1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  <RotateCcw size={16} />
                  Reiniciar
                </button>
              )}

              <div style={{ display: "flex", gap: "12px", marginLeft: "auto" }}>
                {/* Botón Anterior */}
                {!isFirstStep && (
                  <button
                    onClick={handlePrevious}
                    style={{
                      padding: "12px 20px",
                      borderRadius: "10px",
                      background: "white",
                      border: "2px solid #e2e8f0",
                      color: "#64748b",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#cbd5e1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }}
                  >
                    Anterior
                  </button>
                )}

                {/* Botón Siguiente/Comenzar */}
                <button
                  onClick={handleNext}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                    border: "none",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(139,92,246,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(139,92,246,0.3)";
                  }}
                >
                  {isLastStep ? "Comenzar" : "Siguiente"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}