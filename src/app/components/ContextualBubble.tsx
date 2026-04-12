import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { PixelCharacter } from "./PixelCharacter";
import type { ChatbotNotification } from "../context/ChatbotContext";

interface ContextualBubbleProps {
  notification: ChatbotNotification;
  onDismiss: () => void;
}

/* ═══════════════════════════════════════════════════════════════════════════
   BURBUJA CONTEXTUAL - Aparece automáticamente sin bloquear
═══════════════════════════════════════════════════════════════════════════ */

export function ContextualBubble({ notification, onDismiss }: ContextualBubbleProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-dismiss después de cierto tiempo según prioridad
  useEffect(() => {
    const duration = notification.priority === "high" ? 8000 : notification.priority === "normal" ? 5000 : 3000;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Esperar a que termine la animaci��n
    }, duration);

    return () => clearTimeout(timer);
  }, [notification.priority, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  // Usar pixelState si existe, sino usar mood
  const pixelState = notification.pixelState || "idle";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            position: "fixed",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            maxWidth: "340px",
            width: "calc(100% - 32px)",
          }}
        >
          {/* Contenedor de la burbuja */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "14px 16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.16), 0 2px 12px rgba(0,0,0,0.08)",
              border: "1.5px solid #e2e8f0",
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              position: "relative",
            }}
          >
            {/* Pixel mini con estado visual */}
            <motion.div
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                flexShrink: 0,
                width: "40px",
                height: "40px",
              }}
            >
              <PixelCharacter mood={notification.mood} size={40} isIdle={false} state={pixelState} />
            </motion.div>

            {/* Contenido */}
            <div style={{ flex: 1, paddingTop: "2px" }}>
              <p
                style={{
                  color: "#334155",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {notification.message}
              </p>

              {/* Acciones si las hay */}
              {notification.actions && notification.actions.length > 0 && (
                <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
                  {notification.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        action.onClick();
                        handleDismiss();
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        color: "#1e40af",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#dbeafe";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#eff6ff";
                      }}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botón cerrar */}
            <button
              onClick={handleDismiss}
              style={{
                flexShrink: 0,
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "#f1f5f9",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            >
              <X size={12} color="#64748b" />
            </button>
          </div>

          {/* Puntero hacia abajo */}
          <div
            style={{
              position: "absolute",
              bottom: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "10px solid white",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}