import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, X, Play, RotateCcw } from "lucide-react";
import { PixelCharacter } from "../components/PixelCharacter";

/* ═══════════════════════════════════════════════════════════════════════════
   TIPOS Y ESTADOS
═══════════════════════════════════════════════════════════════════════════ */

type FlowStep = 
  | "stage-intro"       // Antes de iniciar etapa
  | "activity-hint"     // Apoyo durante actividad
  | "answer-correct"    // Respuesta correcta
  | "answer-incorrect"  // Respuesta incorrecta
  | "stage-complete"    // Etapa completada
  | "inactivity"        // Inactividad del usuario
  | "idle";             // Sin interacción

interface FlowStepConfig {
  id: FlowStep;
  title: string;
  description: string;
  pixelState: "welcome" | "explaining" | "correct" | "encouraging" | "waiting" | "completed" | "idle";
  pixelMessage: string;
  backgroundColor: string;
  contentElement: React.ReactNode;
  autoOpenDelay?: number;
  bubblePosition?: "top" | "center" | "bottom";
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL - DEMO DE FLUJO PIXEL
═══════════════════════════════════════════════════════════════════════════ */

export default function PixelFlowDemo() {
  const [currentStep, setCurrentStep] = useState<FlowStep>("idle");
  const [showPixel, setShowPixel] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  /* ═══════════════════════════════════════════════════════════════════════
     CONFIGURACIÓN DE CADA PASO DEL FLUJO
  ═══════════════════════════════════════════════════════════════════════ */

  const flowSteps: FlowStepConfig[] = [
    {
      id: "stage-intro",
      title: "1. Introducción de Etapa",
      description: "Pixel aparece automáticamente cuando el usuario está por iniciar una nueva etapa",
      pixelState: "explaining",
      pixelMessage: "¡Vamos a comenzar la Etapa 2! Te voy a explicar qué aprenderás sobre Definición del Alcance. Entender bien el alcance es clave para un proyecto exitoso.",
      backgroundColor: "#f0f9ff",
      bubblePosition: "center",
      autoOpenDelay: 800,
      contentElement: (
        <div style={{ 
          background: "white", 
          borderRadius: "16px", 
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: "380px",
          margin: "0 auto",
        }}>
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #06b6d4, #0891b2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            color: "white",
            fontSize: "28px",
            fontWeight: 700,
          }}>
            2
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 8px 0", color: "#0f172a" }}>
            Definición del Alcance
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 20px 0", lineHeight: 1.6 }}>
            Define qué incluye tu videojuego y qué queda fuera. Aprende a establecer límites claros.
          </p>
          <button style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #06b6d4, #0891b2)",
            border: "none",
            color: "white",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}>
            Comenzar Etapa
            <ArrowRight size={18} />
          </button>
        </div>
      ),
    },
    {
      id: "activity-hint",
      title: "2. Pista Durante Actividad",
      description: "Pixel aparece con una pista cuando el usuario tarda en una pregunta",
      pixelState: "explaining",
      pixelMessage: "¿Necesitas ayuda? El alcance define qué características tendrá tu juego. Piensa en los límites de tu proyecto.",
      backgroundColor: "#fefce8",
      bubblePosition: "bottom",
      autoOpenDelay: 1200,
      contentElement: (
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: "380px",
          margin: "0 auto",
        }}>
          <div style={{
            padding: "10px 14px",
            background: "#fef3c7",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#92400e",
            marginBottom: "16px",
            display: "inline-block",
          }}>
            Pregunta 2 de 5
          </div>
          <h3 style={{ fontSize: "17px", fontWeight: 600, margin: "0 0 20px 0", color: "#0f172a", lineHeight: 1.5 }}>
            ¿Qué define el alcance de un proyecto?
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              "El presupuesto disponible",
              "Las características incluidas y excluidas",
              "El equipo de desarrollo",
              "La fecha de lanzamiento"
            ].map((option, i) => (
              <button
                key={i}
                style={{
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: "white",
                  border: "2px solid #e2e8f0",
                  color: "#334155",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "answer-correct",
      title: "3. Respuesta Correcta",
      description: "Pixel celebra y refuerza el conocimiento con energía positiva",
      pixelState: "correct",
      pixelMessage: "¡Exacto! Identificaste perfectamente que el alcance define las características incluidas y excluidas. Esto es fundamental para gestionar expectativas.",
      backgroundColor: "#f0fdf4",
      bubblePosition: "center",
      autoOpenDelay: 500,
      contentElement: (
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: "380px",
          margin: "0 auto",
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
            boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
          }}>
            <Check size={40} color="white" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 8px 0", color: "#0f172a", textAlign: "center" }}>
            ¡Respuesta Correcta!
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 20px 0", textAlign: "center", lineHeight: 1.6 }}>
            Has ganado +15 XP
          </p>
          <div style={{
            padding: "16px",
            background: "#f0fdf4",
            borderRadius: "12px",
            border: "2px solid #d1fae5",
          }}>
            <p style={{ fontSize: "14px", color: "#065f46", margin: 0, lineHeight: 1.6 }}>
              <strong>Concepto clave:</strong> El alcance establece límites claros entre lo que se incluye y lo que no, evitando desviaciones costosas.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "answer-incorrect",
      title: "4. Respuesta Incorrecta",
      description: "Pixel ofrece apoyo empático y explica el error sin juzgar",
      pixelState: "encouraging",
      pixelMessage: "No te preocupes, es común confundir estos conceptos. El presupuesto es importante, pero el alcance específicamente define QUÉ características tendrá tu juego. Inténtalo de nuevo.",
      backgroundColor: "#faf5ff",
      bubblePosition: "center",
      autoOpenDelay: 600,
      contentElement: (
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: "380px",
          margin: "0 auto",
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
            boxShadow: "0 8px 24px rgba(139,92,246,0.3)",
          }}>
            <X size={40} color="white" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 8px 0", color: "#0f172a", textAlign: "center" }}>
            Respuesta Incorrecta
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 20px 0", textAlign: "center", lineHeight: 1.6 }}>
            No hay problema, aprendamos juntos
          </p>
          <div style={{
            padding: "16px",
            background: "#faf5ff",
            borderRadius: "12px",
            border: "2px solid #ede9fe",
            marginBottom: "16px",
          }}>
            <p style={{ fontSize: "14px", color: "#6b21a8", margin: 0, lineHeight: 1.6 }}>
              <strong>Pista:</strong> El alcance se centra en definir las características del producto, no en aspectos como el presupuesto o el equipo.
            </p>
          </div>
          <button style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            border: "none",
            color: "white",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}>
            Intentar de Nuevo
            <RotateCcw size={18} />
          </button>
        </div>
      ),
    },
    {
      id: "stage-complete",
      title: "5. Etapa Completada",
      description: "Pixel celebra el logro con máxima energía y motiva a continuar",
      pixelState: "completed",
      pixelMessage: "¡Etapa 2 completada! Me siento muy orgulloso de tu esfuerzo. Ahora dominas la definición de alcance. ¡Sigamos adelante hacia la Etapa 3!",
      backgroundColor: "#fef2f2",
      bubblePosition: "center",
      autoOpenDelay: 700,
      contentElement: (
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px 24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: "380px",
          margin: "0 auto",
          textAlign: "center",
        }}>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
            style={{ fontSize: "64px", marginBottom: "16px" }}
          >
            🏆
          </motion.div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 12px 0", color: "#0f172a" }}>
            ¡Etapa Completada!
          </h2>
          <p style={{ fontSize: "15px", color: "#64748b", margin: "0 0 24px 0", lineHeight: 1.6 }}>
            Has dominado la Definición del Alcance
          </p>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "12px",
            marginBottom: "24px",
          }}>
            <div style={{
              padding: "16px",
              background: "#fef3c7",
              borderRadius: "12px",
            }}>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#92400e" }}>
                +50
              </div>
              <div style={{ fontSize: "12px", color: "#78350f", fontWeight: 600 }}>
                XP Ganados
              </div>
            </div>
            <div style={{
              padding: "16px",
              background: "#dbeafe",
              borderRadius: "12px",
            }}>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#1e40af" }}>
                5/5
              </div>
              <div style={{ fontSize: "12px", color: "#1e3a8a", fontWeight: 600 }}>
                Correctas
              </div>
            </div>
          </div>

          <button style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #ec4899, #db2777)",
            border: "none",
            color: "white",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}>
            Continuar a Etapa 3
            <ArrowRight size={18} />
          </button>
        </div>
      ),
    },
    {
      id: "inactivity",
      title: "6. Inactividad del Usuario",
      description: "Pixel invita gentilmente al usuario a continuar después de inactividad",
      pixelState: "waiting",
      pixelMessage: "¿Todo bien? Llevas un rato sin avanzar. Estoy aquí si necesitas ayuda para continuar. Tómate tu tiempo, no hay prisa.",
      backgroundColor: "#f8fafc",
      bubblePosition: "bottom",
      autoOpenDelay: 1500,
      contentElement: (
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: "380px",
          margin: "0 auto",
        }}>
          <div style={{
            padding: "10px 14px",
            background: "#f1f5f9",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#475569",
            marginBottom: "16px",
            display: "inline-block",
          }}>
            Etapa 2 · En progreso
          </div>
          <h3 style={{ fontSize: "17px", fontWeight: 600, margin: "0 0 16px 0", color: "#0f172a", lineHeight: 1.5 }}>
            Continúa donde lo dejaste
          </h3>
          <div style={{
            padding: "16px",
            background: "#f8fafc",
            borderRadius: "12px",
            border: "2px solid #e2e8f0",
            marginBottom: "20px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
                Progreso
              </span>
              <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: 600 }}>
                2 de 5 actividades
              </span>
            </div>
            <div style={{
              width: "100%",
              height: "8px",
              background: "#e2e8f0",
              borderRadius: "4px",
              overflow: "hidden",
            }}>
              <div style={{
                width: "40%",
                height: "100%",
                background: "linear-gradient(90deg, #06b6d4, #0891b2)",
              }} />
            </div>
          </div>
          <button style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #06b6d4, #0891b2)",
            border: "none",
            color: "white",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}>
            Continuar Aprendiendo
            <Play size={18} />
          </button>
        </div>
      ),
    },
  ];

  /* ═══════════════════════════════════════════════════════════════════════
     AUTO-PLAY DE LA SECUENCIA
  ═══════════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    if (isPlaying && currentStep === "idle") {
      // Iniciar secuencia
      setTimeout(() => {
        setCurrentStep("stage-intro");
      }, 500);
    }
  }, [isPlaying, currentStep]);

  useEffect(() => {
    if (currentStep !== "idle") {
      const currentConfig = flowSteps.find(s => s.id === currentStep);
      if (currentConfig?.autoOpenDelay) {
        const timer = setTimeout(() => {
          setShowPixel(true);
        }, currentConfig.autoOpenDelay);
        return () => clearTimeout(timer);
      }
    } else {
      setShowPixel(false);
    }
  }, [currentStep]);

  /* ═══════════════════════════════════════════════════════════════════════
     HANDLERS
  ═══════════════════════════════════════════════════════════════════════ */

  const handleStartDemo = () => {
    setIsPlaying(true);
    setCurrentStep("stage-intro");
  };

  const handleNextStep = () => {
    const currentIndex = flowSteps.findIndex(s => s.id === currentStep);
    if (currentIndex < flowSteps.length - 1) {
      setShowPixel(false);
      setTimeout(() => {
        setCurrentStep(flowSteps[currentIndex + 1].id);
      }, 300);
    } else {
      // Volver al inicio
      setShowPixel(false);
      setIsPlaying(false);
      setCurrentStep("idle");
    }
  };

  const handleReset = () => {
    setShowPixel(false);
    setIsPlaying(false);
    setCurrentStep("idle");
  };

  const currentConfig = flowSteps.find(s => s.id === currentStep);

  /* ═══════════════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════════════ */

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h1 style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "white",
            margin: "0 0 12px 0",
            textShadow: "0 2px 12px rgba(0,0,0,0.2)",
          }}>
            Secuencia de Acompañamiento de Pixel
          </h1>
          <p style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.9)",
            margin: 0,
            lineHeight: 1.6,
          }}>
            Demostración del flujo completo de intervención contextual
          </p>
        </motion.div>

        {/* Progress Bar */}
        {currentStep !== "idle" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "32px",
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", color: "white", fontWeight: 600 }}>
                {currentConfig?.title}
              </span>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                {flowSteps.findIndex(s => s.id === currentStep) + 1} de {flowSteps.length}
              </span>
            </div>
            <div style={{
              width: "100%",
              height: "8px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "4px",
              overflow: "hidden",
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((flowSteps.findIndex(s => s.id === currentStep) + 1) / flowSteps.length) * 100}%`
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
                  borderRadius: "4px",
                }}
              />
            </div>
            <p style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.8)",
              margin: "12px 0 0 0",
              lineHeight: 1.5,
            }}>
              {currentConfig?.description}
            </p>
          </motion.div>
        )}

        {/* Main Content Area */}
        <div style={{
          position: "relative",
          minHeight: "600px",
        }}>
          <AnimatePresence mode="wait">
            {currentStep === "idle" ? (
              // Landing State
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  background: "white",
                  borderRadius: "24px",
                  padding: "60px 40px",
                  textAlign: "center",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
              >
                <div style={{ marginBottom: "32px" }}>
                  <PixelCharacter state="welcome" size={160} mood="happy" detailed={true} />
                </div>
                <h2 style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 16px 0",
                }}>
                  Demostración Interactiva
                </h2>
                <p style={{
                  fontSize: "16px",
                  color: "#64748b",
                  margin: "0 0 32px 0",
                  lineHeight: 1.7,
                  maxWidth: "500px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}>
                  Descubre cómo Pixel acompaña al usuario en cada momento clave del curso.
                  Aparece contextualmente, ofrece apoyo y celebra cada logro.
                </p>
                <button
                  onClick={handleStartDemo}
                  style={{
                    padding: "16px 32px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    border: "none",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    boxShadow: "0 8px 24px rgba(102,126,234,0.4)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(102,126,234,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(102,126,234,0.4)";
                  }}
                >
                  <Play size={20} />
                  Iniciar Demostración
                </button>
              </motion.div>
            ) : (
              // Flow Step Display
              <motion.div
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: currentConfig?.backgroundColor || "white",
                  borderRadius: "24px",
                  padding: "48px 32px",
                  minHeight: "600px",
                  position: "relative",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {/* Content Element */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentConfig?.contentElement}
                </motion.div>

                {/* Pixel Bubble - Aparece contextualmente */}
                <AnimatePresence>
                  {showPixel && currentConfig && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      style={{
                        position: "absolute",
                        bottom: currentConfig.bubblePosition === "bottom" ? "32px" : 
                                currentConfig.bubblePosition === "top" ? "auto" : "50%",
                        top: currentConfig.bubblePosition === "top" ? "32px" : "auto",
                        left: "50%",
                        transform: currentConfig.bubblePosition === "center" ? 
                                   "translate(-50%, -50%)" : "translateX(-50%)",
                        zIndex: 10,
                        maxWidth: "420px",
                        width: "calc(100% - 64px)",
                      }}
                    >
                      <div style={{
                        background: "white",
                        borderRadius: "20px",
                        padding: "20px",
                        boxShadow: "0 12px 48px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1)",
                        border: "2px solid #e2e8f0",
                        display: "flex",
                        gap: "16px",
                        alignItems: "flex-start",
                      }}>
                        {/* Pixel Character */}
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          style={{ flexShrink: 0 }}
                        >
                          <PixelCharacter 
                            state={currentConfig.pixelState}
                            size={70}
                            mood="happy"
                            detailed={true}
                          />
                        </motion.div>

                        {/* Message */}
                        <div style={{ flex: 1, paddingTop: "8px" }}>
                          <div style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#8b5cf6",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}>
                            Pixel
                          </div>
                          <p style={{
                            fontSize: "14px",
                            color: "#334155",
                            margin: 0,
                            lineHeight: 1.7,
                          }}>
                            {currentConfig.pixelMessage}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Controls */}
                <div style={{
                  position: "absolute",
                  bottom: "24px",
                  right: "24px",
                  display: "flex",
                  gap: "12px",
                }}>
                  <button
                    onClick={handleReset}
                    style={{
                      padding: "12px 20px",
                      borderRadius: "12px",
                      background: "white",
                      border: "2px solid #e2e8f0",
                      color: "#64748b",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Reiniciar
                  </button>
                  <button
                    onClick={handleNextStep}
                    style={{
                      padding: "12px 20px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      border: "none",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {flowSteps.findIndex(s => s.id === currentStep) === flowSteps.length - 1 
                      ? "Volver al Inicio" 
                      : "Siguiente"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        {currentStep !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: "32px",
              padding: "20px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
            }}
          >
            <h4 style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "white",
              margin: "0 0 12px 0",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
              Momentos de Intervención
            </h4>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}>
              {flowSteps.map((step, i) => (
                <div
                  key={step.id}
                  style={{
                    padding: "12px",
                    background: currentStep === step.id 
                      ? "rgba(255,255,255,0.3)" 
                      : "rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    border: currentStep === step.id 
                      ? "2px solid rgba(255,255,255,0.5)" 
                      : "2px solid transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "white",
                    marginBottom: "4px",
                  }}>
                    {i + 1}. {step.title.split('. ')[1]}
                  </div>
                  <div style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.4,
                  }}>
                    Estado: {step.pixelState}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
