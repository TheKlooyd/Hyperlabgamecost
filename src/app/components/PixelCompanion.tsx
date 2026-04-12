import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { PixelCharacter } from "./PixelCharacter";
import { useChatbot } from "../context/ChatbotContext";

/* ═══════════════════════════════════════════════════════════════════════════
   PIXEL COMPANION - PERSONAJE GUÍA INTEGRADO
   
   NO es un chatbot tradicional con panel lateral.
   ES un personaje que vive DENTRO de la experiencia educativa.
═══════════════════════════════════════════════════════════════════════════ */

type PixelPosition = "corner" | "center" | "left-side" | "top" | "bottom" | "floating";

interface PixelCompanionProps {
  position?: PixelPosition;
  forceShow?: boolean;
  context?: string;
}

export function PixelCompanion({ 
  position = "corner", 
  forceShow = false,
  context
}: PixelCompanionProps) {
  
  const { currentNotification, dismissNotification, notifications } = useChatbot();
  const [isVisible, setIsVisible] = useState(forceShow);
  const [hasInteracted, setHasInteracted] = useState(false);

  /* ═══════════════════════════════════════════════════════════════════════
     MOSTRAR PIXEL CUANDO HAY NOTIFICACIONES O FORZADO
  ═══════════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    if (currentNotification && currentNotification.showBubble) {
      setIsVisible(true);
      setHasInteracted(false);
    } else if (forceShow) {
      setIsVisible(true);
    }
  }, [currentNotification, forceShow]);

  /* ═══════════════════════════════════════════════════════════════════════
     CERRAR BURBUJA
  ═══════════════════════════════════════════════════════════════════════ */

  const handleClose = () => {
    setIsVisible(false);
    setHasInteracted(true);
    if (currentNotification) {
      dismissNotification(currentNotification.id);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════
     POSICIONAMIENTO SEGÚN CONTEXTO
  ═══════════════════════════════════════════════════════════════════════ */

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case "corner":
        return {
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 90,
        };
      
      case "center":
        return {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
        };
      
      case "left-side":
        return {
          position: "fixed",
          left: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 90,
        };
      
      case "top":
        return {
          position: "fixed",
          top: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 90,
        };
      
      case "bottom":
        return {
          position: "fixed",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 90,
        };
      
      case "floating":
        return {
          position: "fixed",
          bottom: "120px",
          right: "24px",
          zIndex: 90,
        };
      
      default:
        return {
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 90,
        };
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════
     ANIMACIÓN DE ENTRADA SEGÚN POSICIÓN
  ═══════════════════════════════════════════════════════════════════════ */

  const getAnimationVariants = () => {
    switch (position) {
      case "corner":
      case "floating":
        return {
          initial: { opacity: 0, scale: 0.3, x: 100, y: 100 },
          animate: { opacity: 1, scale: 1, x: 0, y: 0 },
          exit: { opacity: 0, scale: 0.5, x: 50, y: 50 },
        };
      
      case "center":
        return {
          initial: { opacity: 0, scale: 0.5, y: 50 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.8, y: 20 },
        };
      
      case "left-side":
        return {
          initial: { opacity: 0, x: -100 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -50 },
        };
      
      case "top":
        return {
          initial: { opacity: 0, y: -100 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -50 },
        };
      
      case "bottom":
        return {
          initial: { opacity: 0, y: 100 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 50 },
        };
      
      default:
        return {
          initial: { opacity: 0, scale: 0.5 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.5 },
        };
    }
  };

  const variants = getAnimationVariants();

  /* ═══════════════════════════════════════════════════════════════════════
     SI NO HAY NOTIFICACIÓN Y NO ES FORZADO, MOSTRAR PRESENCIA SUTIL
  ═══════════════════════════════════════════════════════════════════════ */

  if (!isVisible && !currentNotification && !forceShow) {
    return (
      <motion.div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 80,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 300 }}
      >
        <motion.button
          onClick={() => setIsVisible(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            border: "3px solid white",
            boxShadow: "0 8px 24px rgba(59,130,246,0.4), 0 0 0 0 rgba(59,130,246,0.4)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            animation: "pulse 2s infinite",
          }}
        >
          {/* Mini Pixel */}
          <div style={{ width: "48px", height: "48px" }}>
            <PixelCharacter size={48} state="idle" mood="neutral" />
          </div>
          
          {/* Indicador de notificaciones pendientes */}
          {notifications.length > 0 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "#ef4444",
                border: "2px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 700,
                color: "white",
              }}
            >
              {notifications.length}
            </motion.div>
          )}
        </motion.button>
      </motion.div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════
     PIXEL VISIBLE CON MENSAJE
  ═══════════════════════════════════════════════════════════════════════ */

  const pixelState = currentNotification?.pixelState || "idle";
  const pixelMood = currentNotification?.mood || "neutral";
  const message = currentNotification?.message || "";
  const priority = currentNotification?.priority || "normal";

  // Tamaño según prioridad
  const pixelSize = priority === "high" ? 100 : priority === "normal" ? 80 : 70;
  const isLargeMessage = message.length > 120;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay sutil para mensajes de alta prioridad centrados */}
          {position === "center" && priority === "high" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)",
                zIndex: 95,
              }}
            />
          )}

          {/* Contenedor de Pixel + Mensaje */}
          <motion.div
            {...variants}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              ...getPositionStyles(),
              display: "flex",
              flexDirection: position === "left-side" ? "row" : "column",
              alignItems: position === "center" ? "center" : "flex-end",
              gap: "16px",
              maxWidth: position === "center" ? "90vw" : "380px",
            }}
          >
            {/* BURBUJA DE DIÁLOGO INTEGRADA */}
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  position: "relative",
                  background: "white",
                  borderRadius: position === "center" ? "24px" : "20px",
                  padding: position === "center" ? "32px 28px" : "20px 20px",
                  boxShadow: priority === "high" 
                    ? "0 20px 60px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.15)"
                    : "0 12px 40px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.1)",
                  border: "2px solid #e2e8f0",
                  maxWidth: position === "center" ? "460px" : "320px",
                  order: position === "left-side" ? 2 : 1,
                }}
              >
                {/* Cabecera con nombre de Pixel */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}>
                  <div style={{
                    fontSize: position === "center" ? "13px" : "12px",
                    fontWeight: 800,
                    color: "#8b5cf6",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}>
                    Pixel te acompaña
                  </div>
                  
                  {/* Botón cerrar */}
                  <button
                    onClick={handleClose}
                    style={{
                      width: "28px",
                      height: "28px",
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
                    <X size={16} color="#64748b" />
                  </button>
                </div>

                {/* Mensaje */}
                <p style={{
                  fontSize: position === "center" ? "16px" : isLargeMessage ? "14px" : "15px",
                  color: "#334155",
                  margin: 0,
                  lineHeight: 1.7,
                }}>
                  {message}
                </p>

                {/* Cola de la burbuja (apuntando a Pixel) */}
                {position !== "center" && (
                  <div style={{
                    position: "absolute",
                    bottom: position === "left-side" ? "50%" : "-8px",
                    right: position === "left-side" ? "-8px" : "40px",
                    transform: position === "left-side" ? "translateY(50%) rotate(45deg)" : "rotate(45deg)",
                    width: "16px",
                    height: "16px",
                    background: "white",
                    border: "2px solid #e2e8f0",
                    borderTop: "none",
                    borderLeft: "none",
                  }} />
                )}

                {/* Indicador de tipo de notificación */}
                {currentNotification?.type && (
                  <div style={{
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}>
                    <div style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: priority === "high" ? "#ef4444" : priority === "normal" ? "#3b82f6" : "#94a3b8",
                    }} />
                    <span style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      fontWeight: 500,
                    }}>
                      {currentNotification.type === "stage-intro" && "Introducción"}
                      {currentNotification.type === "success-celebration" && "Celebración"}
                      {currentNotification.type === "error-support" && "Apoyo"}
                      {currentNotification.type === "activity-hint" && "Pista"}
                      {currentNotification.type === "stage-complete" && "Completado"}
                      {currentNotification.type === "inactivity" && "Recordatorio"}
                      {currentNotification.type === "welcome" && "Bienvenida"}
                      {currentNotification.type === "milestone" && "Hito"}
                      {currentNotification.type === "encouragement" && "Ánimo"}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* PERSONAJE PIXEL ANIMADO */}
            <motion.div
              animate={{ 
                y: [0, -6, 0],
                rotate: pixelState === "correct" ? [-5, 5, -5] : [0, 0, 0],
              }}
              transition={{ 
                duration: pixelState === "correct" ? 0.6 : 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "relative",
                flexShrink: 0,
                order: position === "left-side" ? 1 : 2,
              }}
            >
              <PixelCharacter 
                state={pixelState}
                mood={pixelMood}
                size={pixelSize}
                detailed={priority === "high"}
              />

              {/* Resplandor según estado */}
              <motion.div
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: `${pixelSize * 1.4}px`,
                  height: `${pixelSize * 1.4}px`,
                  borderRadius: "50%",
                  background: pixelState === "correct" 
                    ? "radial-gradient(circle, rgba(16,185,129,0.3), transparent 70%)"
                    : pixelState === "encouraging"
                    ? "radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)"
                    : pixelState === "completed"
                    ? "radial-gradient(circle, rgba(236,72,153,0.3), transparent 70%)"
                    : "radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)",
                  filter: "blur(20px)",
                  pointerEvents: "none",
                  zIndex: -1,
                }}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ESTILOS DE ANIMACIÓN GLOBAL
═══════════════════════════════════════════════════════════════════════════ */

// Añadir al documento
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 8px 24px rgba(59,130,246,0.4), 0 0 0 0 rgba(59,130,246,0.4);
      }
      50% {
        box-shadow: 0 8px 24px rgba(59,130,246,0.4), 0 0 0 8px rgba(59,130,246,0);
      }
    }
  `;
  document.head.appendChild(style);
}
