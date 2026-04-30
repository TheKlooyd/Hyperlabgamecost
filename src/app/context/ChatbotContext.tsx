import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   TIPOS DE NOTIFICACIONES
═══════════════════════════════════════════════════════════════════════════ */

export type NotificationType = 
  | "stage-intro"          // Antes de iniciar una etapa
  | "activity-hint"        // Durante una actividad (pista)
  | "success-celebration"  // Respuesta correcta
  | "error-support"        // Respuesta incorrecta
  | "stage-complete"       // Etapa completada
  | "inactivity"          // Usuario inactivo
  | "welcome"             // Bienvenida inicial
  | "milestone"           // Logro importante
  | "encouragement";      // Motivación general

export interface ChatbotNotification {
  id: string;
  type: NotificationType;
  message: string;
  mood: "happy" | "thinking" | "celebrating" | "helping" | "neutral";
  pixelState?: "welcome" | "explaining" | "correct" | "encouraging" | "waiting" | "completed" | "idle"; // NUEVO
  priority: "low" | "normal" | "high";
  autoOpen?: boolean;  // Si debe abrir el panel completo
  showBubble?: boolean; // Si debe mostrar burbuja pequeña
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
  timestamp: number;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTEXTO DEL CHATBOT
═══════════════════════════════════════════════════════════════════════════ */

interface ChatbotContextValue {
  notifications: ChatbotNotification[];
  currentNotification: ChatbotNotification | null;
  addNotification: (notification: Omit<ChatbotNotification, "id" | "timestamp">) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  shouldAutoOpen: boolean;
  setShouldAutoOpen: (value: boolean) => void;
  lastInteractionTime: number;
  updateInteractionTime: () => void;
}

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

/* ═════════════════════════════════════���════════════════════════════════════
   PROVIDER
═══════════════════════════════════════════════════════════════════════════ */

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<ChatbotNotification[]>([]);
  const [shouldAutoOpen, setShouldAutoOpen] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

  const addNotification = useCallback((notification: Omit<ChatbotNotification, "id" | "timestamp">) => {
    const newNotification: ChatbotNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };

    // Reemplazar todas las notificaciones anteriores con la nueva
    setNotifications([newNotification]);

    // Si es de alta prioridad o tiene autoOpen, abrir automáticamente
    if (notification.autoOpen || notification.priority === "high") {
      setShouldAutoOpen(true);
    }

    return newNotification.id;
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setShouldAutoOpen(false);
  }, []);

  const updateInteractionTime = useCallback(() => {
    setLastInteractionTime(Date.now());
  }, []);

  // Notificación actual (la más reciente no vista)
  const currentNotification = notifications.length > 0 ? notifications[notifications.length - 1] : null;

  return (
    <ChatbotContext.Provider
      value={{
        notifications,
        currentNotification,
        addNotification,
        dismissNotification,
        clearAllNotifications,
        shouldAutoOpen,
        setShouldAutoOpen,
        lastInteractionTime,
        updateInteractionTime,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOOK PARA USAR EL CONTEXTO
═══════════════════════════════════════════════════════════════════════════ */

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within ChatbotProvider");
  }
  return context;
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS PARA CREAR NOTIFICACIONES FÁCILMENTE
═══════════════════════════════════════════════════════════════════════════ */

export const chatbotActions = {
  // Introducir una etapa
  introduceStage: (stageNumber: number, stageTitle: string, addNotification: ChatbotContextValue["addNotification"]) => {
    const messages = [
      `¡Vamos a comenzar la Etapa ${stageNumber}! Te voy a explicar qué aprenderás sobre ${stageTitle}.`,
      `Antes de empezar, déjame contarte qué veremos en ${stageTitle}. Es más fácil de lo que parece.`,
      `Iniciemos juntos la Etapa ${stageNumber}. ${stageTitle} es fundamental para tu proyecto.`,
    ];
    
    addNotification({
      type: "stage-intro",
      message: messages[Math.floor(Math.random() * messages.length)],
      mood: "helping",
      pixelState: "explaining",
      priority: "high",
      autoOpen: true,
    });
  },

  // Celebrar acierto
  celebrateSuccess: (addNotification: ChatbotContextValue["addNotification"], isStreak?: boolean) => {
    const messages = isStreak
      ? [
          "¡Increíble! Llevas varias seguidas. Tu comprensión está creciendo muchísimo.",
          "¡Racha perfecta! Cada acierto demuestra que estás aprendiendo de verdad.",
          "¡Imparable! Dominas este tema completamente. Sigue así.",
        ]
      : [
          "¡Exacto! Bien hecho. Identificaste la respuesta correcta.",
          "¡Perfecto! Esa es la respuesta. Estás aprendiendo muy bien.",
          "¡Correcto! Tu razonamiento fue muy acertado.",
        ];

    addNotification({
      type: "success-celebration",
      message: messages[Math.floor(Math.random() * messages.length)],
      mood: "celebrating",
      pixelState: "correct",
      priority: "normal",
      showBubble: true,
    });
  },

  // Apoyar en error
  supportError: (addNotification: ChatbotContextValue["addNotification"], hint: string) => {
    const introMessages = [
      "No te preocupes, pasa. Mira esto:",
      "Casi lo tienes. Te doy una pista:",
      "Entiendo el error. Déjame explicarte:",
    ];

    addNotification({
      type: "error-support",
      message: `${introMessages[Math.floor(Math.random() * introMessages.length)]} ${hint}`,
      mood: "helping",
      pixelState: "encouraging",
      priority: "high",
      autoOpen: true,
    });
  },

  // Dar pista durante actividad
  giveHint: (addNotification: ChatbotContextValue["addNotification"], hint: string) => {
    addNotification({
      type: "activity-hint",
      message: hint,
      mood: "thinking",
      pixelState: "explaining",
      priority: "normal",
      showBubble: true,
    });
  },

  // Completar etapa
  completeStage: (addNotification: ChatbotContextValue["addNotification"], stageNumber: number) => {
    const messages = [
      `¡Etapa ${stageNumber} completada! Me siento muy orgulloso de tu esfuerzo. Sigamos adelante.`,
      `¡Lo lograste! Terminaste la Etapa ${stageNumber}. Cada vez estás más cerca del objetivo.`,
      `¡Excelente trabajo! Etapa ${stageNumber} superada. Tu aprendizaje va genial.`,
    ];

    addNotification({
      type: "stage-complete",
      message: messages[Math.floor(Math.random() * messages.length)],
      mood: "celebrating",
      pixelState: "completed",
      priority: "high",
      autoOpen: true,
    });
  },

  // Motivar por inactividad
  motivateInactivity: (addNotification: ChatbotContextValue["addNotification"]) => {
    const messages = [
      "¿Todo bien? Estoy aquí si necesitas ayuda para continuar.",
      "¿Tienes alguna duda? No dudes en tocarme si necesitas que te explique algo.",
      "Tómate tu tiempo. Cuando estés listo, continuamos juntos.",
    ];

    addNotification({
      type: "inactivity",
      message: messages[Math.floor(Math.random() * messages.length)],
      mood: "neutral",
      pixelState: "waiting",
      priority: "low",
      showBubble: true,
    });
  },

  // Dar bienvenida
  welcome: (addNotification: ChatbotContextValue["addNotification"], userName: string) => {
    addNotification({
      type: "welcome",
      message: `¡Hola ${userName}! Soy Pixel y voy a acompañarte en todo este viaje de aprendizaje. Estoy aquí para ayudarte siempre que lo necesites.`,
      mood: "happy",
      pixelState: "welcome",
      priority: "high",
      autoOpen: true,
    });
  },

  // Celebrar hito
  celebrateMilestone: (addNotification: ChatbotContextValue["addNotification"], description: string) => {
    addNotification({
      type: "milestone",
      message: description,
      mood: "celebrating",
      pixelState: "completed",
      priority: "high",
      autoOpen: true,
    });
  },

  // Animar generalmente
  encourage: (addNotification: ChatbotContextValue["addNotification"]) => {
    const messages = [
      "Vas muy bien. Cada paso cuenta en tu aprendizaje.",
      "Tu progreso es notable. Sigue confiando en ti.",
      "Estás haciendo un gran trabajo. No lo olvides.",
    ];

    addNotification({
      type: "encouragement",
      message: messages[Math.floor(Math.random() * messages.length)],
      mood: "happy",
      pixelState: "welcome",
      priority: "low",
      showBubble: true,
    });
  },
};