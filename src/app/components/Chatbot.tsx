import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Star,
  Lightbulb,
  Target,
  MessageCircle,
  BookOpen,
  Home,
  Award,
  Trophy,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useChatbot } from "../context/ChatbotContext";
import { stages } from "../data/gameData";
import { PixelCharacter } from "./PixelCharacter";
import { ContextualBubble } from "./ContextualBubble";

/* ═══════════════════════════════════════════════════════════════════════════
   TIPOS DE MENSAJES Y ESTADOS DEL CHATBOT
═══════════════════════════════════════════════════════════════════════════ */

type MessageType = "welcome" | "tip" | "motivation" | "celebration" | "help" | "contextual";
type BotMood = "happy" | "thinking" | "celebrating" | "helping" | "neutral" | "excited";

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface ChatMessage {
  type: MessageType;
  content: string;
  icon?: React.ReactNode;
  mood?: BotMood;
  actions?: QuickAction[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   MENSAJES CONTEXTUALES POR RUTA (mismo código que antes)
═══════════════════════════════════════════════════════════════════════════ */

const getContextualMessages = (
  contextKey: string,
  xp: number,
  completedStages: number,
  consecutiveCorrect: number,
  earnedAchievements: string[],
  navigate: (path: string) => void
): ChatMessage[] => {
  const baseMessages: Record<string, ChatMessage[]> = {
    welcome: [
      {
        type: "welcome",
        content: "¡Hola! Soy Pixel, tu compañero en este viaje de aprendizaje. Estoy aquí para acompañarte en cada paso y responder tus dudas.",
        mood: "happy",
      },
    ],
    home: [
      {
        type: "tip",
        content: "Las 6 etapas se desbloquean en orden. Completa las actividades y el quiz de cada una para avanzar hacia la siguiente.",
        mood: "helping",
        actions: [
          {
            label: "Ver etapas",
            icon: <BookOpen size={14} />,
            onClick: () => navigate("/stages"),
          },
        ],
      },
    ],
  };

  return baseMessages[contextKey] || baseMessages.home;
};

function getContextKey(pathname: string): string {
  if (pathname === "/home") return "home";
  if (pathname === "/stages") return "stages";
  return "home";
}

const getMessageIcon = (type: MessageType) => {
  switch (type) {
    case "welcome":
      return <Sparkles size={14} />;
    case "celebration":
      return <Star size={14} />;
    case "motivation":
      return <Heart size={14} />;
    case "tip":
      return <Lightbulb size={14} />;
    case "help":
      return <Target size={14} />;
    default:
      return <MessageCircle size={14} />;
  }
};

const getMoodColors = (mood: BotMood = "neutral") => {
  switch (mood) {
    case "happy":
      return {
        primary: "#3b82f6",
        secondary: "#dbeafe",
      };
    case "celebrating":
      return {
        primary: "#f59e0b",
        secondary: "#fef3c7",
      };
    case "helping":
      return {
        primary: "#8b5cf6",
        secondary: "#ede9fe",
      };
    case "thinking":
      return {
        primary: "#06b6d4",
        secondary: "#cffafe",
      };
    case "excited":
      return {
        primary: "#ec4899",
        secondary: "#fce7f3",
      };
    default:
      return {
        primary: "#3b82f6",
        secondary: "#dbeafe",
      };
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTES
═══════════════════════════════════════════════════════════════════════════ */

const PIXEL_SIZE = 140; // Más grande
const PANEL_WIDTH = 320;
const PANEL_MAX_HEIGHT = 420;

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL - REDISEÑADO
═══════════════════════════════════════════════════════════════════════════ */

export function Chatbot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();
  const { 
    notifications, 
    currentNotification, 
    dismissNotification, 
    shouldAutoOpen, 
    setShouldAutoOpen,
  } = useChatbot();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  /* Posición fija en la esquina */
  const [initialized, setInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ═══════════════════════════════════════════════════════════════════════
     ABRIR AUTOMÁTICAMENTE SI HAY NOTIFICACIÓN DE ALTA PRIORIDAD
  ═══════════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    if (shouldAutoOpen && currentNotification?.autoOpen) {
      setIsOpen(true);
      setHasBeenSeen(true);
      setShouldAutoOpen(false);
    }
  }, [shouldAutoOpen, currentNotification, setShouldAutoOpen]);

  /* ═══════════════════════════════════════════════════════════════════════
     INICIALIZAR
  ═══════════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
    }
  }, [initialized]);

  /* ═══════════════════════════════════════════════════════════════════════
     RESET AL CAMBIAR DE RUTA
  ═══════════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    setMessageIndex(0);
    setIsOpen(false);
    setHasBeenSeen(false);
  }, [location.pathname]);

  /* ═══════════════════════════════════════════════════════════════════════
     OBTENER MENSAJES PARA EL CONTEXTO ACTUAL
  ═══════════════════════════════════════════════════════════════════════ */

  const contextKey = getContextKey(location.pathname);
  let currentMessages = getContextualMessages(
    contextKey,
    state.xp,
    state.stageStatuses ? Object.values(state.stageStatuses).filter(s => s.status === "completed").length : 0,
    state.consecutiveCorrect,
    state.earnedAchievements,
    navigate
  );

  const safeIndex = messageIndex % currentMessages.length;
  const currentMessage = currentMessages[safeIndex];

  // MAPEAR MOOD A STATE DEL PERSONAJE
  const getPixelState = (mood?: BotMood, type?: MessageType) => {
    // Si hay notificación actual con pixelState, usarlo
    if (currentNotification?.pixelState) {
      return currentNotification.pixelState;
    }

    if (type === "welcome") return "welcome";
    if (type === "celebration") return "correct";
    if (type === "tip" || type === "help") return "explaining";
    
    switch (mood) {
      case "celebrating":
        return "completed";
      case "helping":
        return "encouraging";
      case "thinking":
        return "explaining";
      case "excited":
        return "correct";
      case "happy":
        return "welcome";
      default:
        return "idle";
    }
  };

  const pixelState = getPixelState(currentMessage.mood, currentMessage.type);

  /* ═══════════════════════════════════════════════════════════════════════
     HANDLERS
  ═══════════════════════════════════════════════════════════════════════ */

  const handleToggle = () => {
    setIsOpen((prev) => {
      if (!prev) setHasBeenSeen(true);
      return !prev;
    });
  };

  const handleNext = () => {
    setIsTyping(true);
    setTimeout(() => {
      setMessageIndex((p) => (p + 1) % currentMessages.length);
      setIsTyping(false);
    }, 150);
  };

  const handlePrev = () => {
    setIsTyping(true);
    setTimeout(() => {
      setMessageIndex((p) => (p - 1 + currentMessages.length) % currentMessages.length);
      setIsTyping(false);
    }, 150);
  };

  const handleClose = () => setIsOpen(false);

  if (!initialized) return null;

  const moodColors = getMoodColors(currentMessage.mood);

  /* ═══════════════════════════════════════════════════════════════════════
     RENDERIZADO - DISEÑO COMPLETAMENTE NUEVO
  ═══════════════════════════════════════════════════════════════════════ */

  return (
    <>
      {/* Burbujas contextuales pequeñas */}
      {notifications
        .filter((n) => n.showBubble && !isOpen)
        .map((notification) => (
          <ContextualBubble
            key={notification.id}
            notification={notification}
            onDismiss={() => dismissNotification(notification.id)}
          />
        ))}

      {/* Contenedor del chatbot fijo */}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        {/* Panel de chat que aparece detrás de Pixel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              style={{
                position: "absolute",
                bottom: `${PIXEL_SIZE / 2 - 20}px`, // Panel detrás de Pixel
                right: 0,
                width: `${PANEL_WIDTH}px`,
                maxHeight: `${PANEL_MAX_HEIGHT}px`,
                background: "white",
                borderRadius: "24px",
                boxShadow: "0 16px 48px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.12)",
                border: "2px solid #f1f5f9",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                pointerEvents: "auto",
              }}
            >
              {/* Header con información de Pixel */}
              <div
                style={{
                  padding: "20px 20px 16px 20px",
                  borderBottom: "1.5px solid #f1f5f9",
                  background: `linear-gradient(135deg, ${moodColors.secondary}, white)`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, paddingTop: "4px" }}>
                    <h3 style={{ 
                      color: "#0f172a", 
                      fontSize: "18px", 
                      fontWeight: 700, 
                      margin: 0,
                      lineHeight: 1.2,
                    }}>
                      Pixel
                    </h3>
                    <p style={{ 
                      color: "#64748b", 
                      fontSize: "12px", 
                      margin: "4px 0 0 0",
                      lineHeight: 1.3,
                    }}>
                      Tu compañero de viaje educativo
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "12px",
                      background: "white",
                      border: "1.5px solid #e2e8f0",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.borderColor = "#cbd5e1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }}
                  >
                    <X size={18} color="#64748b" />
                  </button>
                </div>
              </div>

              {/* Contenido del mensaje */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "24px 20px",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={safeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isTyping ? 0.5 : 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Badge del tipo de mensaje */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        borderRadius: "10px",
                        background: moodColors.secondary,
                        color: moodColors.primary,
                        fontSize: "12px",
                        fontWeight: 600,
                        marginBottom: "14px",
                      }}
                    >
                      {getMessageIcon(currentMessage.type)}
                      <span style={{ textTransform: "capitalize" }}>
                        {currentMessage.type === "tip" ? "Consejo" :
                         currentMessage.type === "welcome" ? "Bienvenida" :
                         currentMessage.type === "help" ? "Ayuda" :
                         currentMessage.type === "motivation" ? "Motivación" :
                         currentMessage.type === "celebration" ? "Celebración" : "Mensaje"}
                      </span>
                    </div>

                    {/* Contenido del mensaje */}
                    <p
                      style={{
                        color: "#334155",
                        fontSize: "15px",
                        lineHeight: 1.7,
                        marginBottom: "18px",
                      }}
                    >
                      {currentMessage.content}
                    </p>

                    {/* Botones de acción */}
                    {currentMessage.actions && currentMessage.actions.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                        {currentMessage.actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={action.onClick}
                            style={{
                              padding: "12px 16px",
                              borderRadius: "12px",
                              background: "white",
                              border: `2px solid ${moodColors.secondary}`,
                              color: moodColors.primary,
                              fontSize: "14px",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = moodColors.secondary;
                              e.currentTarget.style.transform = "translateY(-1px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "white";
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                          >
                            {action.icon}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navegación */}
              {currentMessages.length > 1 && (
                <div
                  style={{
                    padding: "16px 20px",
                    borderTop: "1.5px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "white",
                  }}
                >
                  <button
                    onClick={handlePrev}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "12px",
                      background: "#f8fafc",
                      border: "1.5px solid #e2e8f0",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f1f5f9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#f8fafc";
                    }}
                  >
                    <ChevronLeft size={18} color="#64748b" />
                  </button>

                  {/* Indicadores de página */}
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    {currentMessages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setIsTyping(true);
                          setTimeout(() => {
                            setMessageIndex(i);
                            setIsTyping(false);
                          }, 150);
                        }}
                        style={{
                          width: i === safeIndex ? "28px" : "8px",
                          height: "8px",
                          borderRadius: i === safeIndex ? "4px" : "50%",
                          background: i === safeIndex ? moodColors.primary : "#cbd5e1",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          padding: 0,
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "12px",
                      background: "#f8fafc",
                      border: "1.5px solid #e2e8f0",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f1f5f9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#f8fafc";
                    }}
                  >
                    <ChevronRight size={18} color="#64748b" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PIXEL - EL PERSONAJE PROTAGONISTA QUE SOBRESALE */}
        <motion.div
          onClick={handleToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={
            !isOpen && !hasBeenSeen
              ? {
                  y: [0, -8, 0],
                }
              : { y: 0 }
          }
          transition={
            !isOpen && !hasBeenSeen
              ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1,
                }
              : { duration: 0.2 }
          }
          style={{
            position: "relative",
            width: `${PIXEL_SIZE}px`,
            height: `${PIXEL_SIZE}px`,
            cursor: "pointer",
            pointerEvents: "auto",
            zIndex: 10,
          }}
        >
          {/* Sombra del personaje */}
          <div
            style={{
              position: "absolute",
              bottom: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "8px",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(0,0,0,0.25), transparent)",
              filter: "blur(6px)",
            }}
          />

          {/* El personaje Pixel */}
          <div style={{ 
            position: "relative", 
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.15))",
          }}>
            <PixelCharacter 
              mood={isOpen ? currentMessage.mood : "neutral"}
              size={PIXEL_SIZE}
              isIdle={!isOpen}
              showSparkles={isOpen && currentMessage.mood === "celebrating"}
              detailed={true}
              state={pixelState}
            />
          </div>

          {/* Badge de notificación */}
          {!hasBeenSeen && !isOpen && (
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f59e0b, #f97316)",
                border: "3px solid white",
                boxShadow: "0 4px 12px rgba(245,158,11,0.6)",
              }}
            />
          )}

          {/* Indicador de click */}
          {!isOpen && (
            <motion.div
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: "absolute",
                bottom: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "11px",
                color: "#94a3b8",
                fontWeight: 600,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              Toca para hablar
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}