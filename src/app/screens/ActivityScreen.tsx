import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Lightbulb, X, Check, RotateCcw, Delete, Mic, MicOff, Type } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { PixelCompanion } from "../components/PixelCompanion";
import { QuestionIllustration } from "../components/QuestionIllustration";
import { useApp } from "../context/AppContext";
import { useChatbot } from "../context/ChatbotContext";
import { stages, CrosswordData, RiskOption, GraphNode, TeamMember } from "../data/gameData";
import { playSelect, playClick, playCorrect, playWrong, playNavigate, playComplete, playBack } from "../utils/sounds";

/* ═══════════════════════════════════════════════════════════════════════════
   ACTIVITY SCREEN — Maneja todos los tipos de actividad
═══════════════════════════════════════════════════════════════════════════ */

// ─── TRUE-FALSE STATEMENT MAP ───────────────────────────────────────────────
const trueFalseStatements: Record<string, string> = {
  "1-6": "La propuesta de valor de un videojuego describe únicamente sus características técnicas como gráficos, resolución o plataformas de lanzamiento.",
  "2-6": "Agregar más mecánicas y contenido a un videojuego siempre mejora la experiencia del jugador y aumenta sus probabilidades de éxito comercial.",
  "3-6": "Godot Engine es completamente gratuito para uso comercial, sin restricciones de ingresos ni regalías para el desarrollador.",
  "4-6": "En la producción de videojuegos, el costo del equipo humano (programadores, artistas, diseñadores) representa menos del 30% del presupuesto total.",
};

export function ActivityScreen() {
  const navigate = useNavigate();
  const { stageId, activityId } = useParams<{ stageId: string; activityId: string }>();
  const { completeActivity, state, spendXP } = useApp();
  const { addNotification } = useChatbot();

  // ── Multiple choice ──────────────────────────────────────────────────────
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // ── Order steps ──────────────────────────────────────────────────────────
  const [orderedItems, setOrderedItems] = useState<number[]>([]);

  // ── Reflection ───────────────────────────────────────────────────────────
  const [reflectionText, setReflectionText] = useState("");
  const [reflectionMode, setReflectionMode] = useState<"text" | "voice">("text");
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionRef] = useState<{ current: SpeechRecognition | null }>({ current: null });

  // ── True/False ────────────────────────────────────────────────────────────
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean | null>(null);

  // ── Connect concepts ──────────────────────────────────────────────────────
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [connections, setConnections] = useState<Record<number, number>>({}); // leftIdx → rightIdx
  const [shuffledRight, setShuffledRight] = useState<number[]>([]);

  // ── Word scramble ─────────────────────────────────────────────────────────
  const [scrambledPool, setScrambledPool] = useState<{ letter: string; originalIdx: number }[]>([]);
  const [wordAnswer, setWordAnswer] = useState<(string | null)[]>([]);
  const [wordPoolUsed, setWordPoolUsed] = useState<boolean[]>([]);

  // ── Crossword ─────────────────────────────────────────────────────────────
  const [selectedClue, setSelectedClue] = useState<number | null>(null); // word index
  const [crosswordInputs, setCrosswordInputs] = useState<Record<string, string>>({}); // "row-col" → letter
  const [crosswordInput, setCrosswordInput] = useState(""); // current word input
  const [crosswordCorrect, setCrosswordCorrect] = useState<Record<number, boolean>>({}); // wordIdx → correct

  // ── Word builder ──────────────────────────────────────────────────────────
  const [wordBuilderSentence, setWordBuilderSentence] = useState<string[]>([]);
  const [wordBuilderPool, setWordBuilderPool] = useState<string[]>([]);
  const [showWordBuilderExample, setShowWordBuilderExample] = useState(false);

  // ── Budget allocation ────────────────────────────────────────────────────
  const [budgetSelected, setBudgetSelected] = useState<string[]>([]);

  // ── Risk event ────────────────────────────────────────────────────────────
  const [riskEventSelected, setRiskEventSelected] = useState<string | null>(null);

  // ── Dependency graph ───────────────────────────────────────────────
  const [graphEdges, setGraphEdges] = useState<Array<{ from: string; to: string }>>([]);
  const [graphSelected, setGraphSelected] = useState<string | null>(null);

  // ── Team builder ────────────────────────────────────────────────────
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);

  // ── Shared ────────────────────────────────────────────────────────────────
  const [showHint, setShowHint] = useState(false);
  const [hintBought, setHintBought] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const stage = stages.find(s => s.id === Number(stageId));
  const activity = stage?.activities.find(a => a.id === activityId);

  // ── Inactivity hint ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!submitted && activity?.hint) {
      const timer = setTimeout(() => {
        addNotification({
          type: "activity-hint",
          message: activity.hint,
          mood: "thinking",
          pixelState: "explaining",
          priority: "normal",
          showBubble: true,
        });
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [submitted, activity, addNotification]);

  // ── Init connect-concepts ─────────────────────────────────────────────────
  useEffect(() => {
    if (activity?.type === "connect-concepts" && activity.pairs) {
      const indices = activity.pairs.map((_, i) => i);
      const shuffled = [...indices].sort(() => Math.random() - 0.5);
      setShuffledRight(shuffled);
      setConnections({});
      setSelectedLeft(null);
    }
  }, [activity?.id]);

  // ── Init word-scramble ────────────────────────────────────────────────────
  useEffect(() => {
    if (activity?.type === "word-scramble" && activity.word) {
      const letters = activity.word.toUpperCase().split("").map((letter, i) => ({
        letter,
        originalIdx: i,
      }));
      const shuffled = [...letters].sort(() => Math.random() - 0.5);
      setScrambledPool(shuffled);
      setWordAnswer(new Array(letters.length).fill(null));
      setWordPoolUsed(new Array(letters.length).fill(false));
    }
  }, [activity?.id]);

  // ── Init word-builder ─────────────────────────────────────────────────────
  useEffect(() => {
    if (activity?.type === "word-builder" && activity.wordChips) {
      const shuffled = [...activity.wordChips].sort(() => Math.random() - 0.5);
      setWordBuilderPool(shuffled);
      setWordBuilderSentence([]);
      setShowWordBuilderExample(false);
    }
  }, [activity?.id]);

  if (!stage || !activity) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <p style={{ color: "#64748b" }}>Actividad no encontrada</p>
        </div>
      </MobileLayout>
    );
  }

  const isOrderSteps = activity.type === "order-steps";
  const isReflection = activity.type === "reflection";
  const isMultipleChoice = activity.type === "multiple-choice";
  const isTrueFalse = activity.type === "true-false";
  const isConnectConcepts = activity.type === "connect-concepts";
  const isWordScramble = activity.type === "word-scramble";
  const isCrossword = activity.type === "crossword";
  const isWordBuilder = activity.type === "word-builder";
  const isTimelineOrder = activity.type === "timeline-order";
  const isBudgetAllocation = activity.type === "budget-allocation";
  const isRiskEvent = activity.type === "risk-event";
  const isDependencyGraph = activity.type === "dependency-graph";
  const isTeamBuilder = activity.type === "team-builder";
  const activityIllustrationText = isTrueFalse
    ? (trueFalseStatements[activity.id] || activity.question)
    : activity.question;

  // ── Order steps / Timeline order ─────────────────────────────────────────
  const [scrambled] = useState(() => {
    const items = activity.items || activity.timelineItems;
    if (!items) return [];
    const arr = items.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [availableItems, setAvailableItems] = useState<number[]>(scrambled);
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);

  // ── canSubmit ─────────────────────────────────────────────────────────────
  const canSubmit = (): boolean => {
    if (isMultipleChoice) return selectedOption !== null;
    if (isOrderSteps) return orderedItems.length === activity.items?.length;
    if (isTimelineOrder) return orderedItems.length === activity.timelineItems?.length;
    if (isReflection) return reflectionText.trim().length > 20;
    if (isTrueFalse) return trueFalseAnswer !== null;
    if (isConnectConcepts) {
      const pairsCount = activity.pairs?.length ?? 0;
      return Object.keys(connections).length === pairsCount;
    }
    if (isWordScramble) {
      return wordAnswer.every(l => l !== null);
    }
    if (isCrossword) {
      const wordCount = activity.crossword?.words.length ?? 0;
      return Object.keys(crosswordCorrect).length === wordCount && Object.values(crosswordCorrect).every(Boolean);
    }
    if (isWordBuilder) return wordBuilderSentence.length > 0;
    if (isBudgetAllocation) return budgetSelected.length > 0;
    if (isRiskEvent) return riskEventSelected !== null;
    if (isDependencyGraph) return graphEdges.length === (activity.graphCorrectEdges?.length ?? 0);
    if (isTeamBuilder) return selectedTeam.length === (activity.teamSize ?? 4);
    return false;
  };

  const checkCorrect = (): boolean => {
    if (isMultipleChoice) return selectedOption === activity.correctAnswer;
    if (isOrderSteps || isTimelineOrder) {
      if (!activity.correctOrder) return true;
      return activity.correctOrder.every((val, idx) => val === orderedItems[idx]);
    }
    if (isReflection) return true;
    if (isTrueFalse) return trueFalseAnswer === activity.isTrue;
    if (isConnectConcepts) {
      // Each connection maps leftIdx → rightIdx (in shuffledRight indices)
      // connections[i] = j means left[i] is connected to shuffledRight[j]
      // The correct mapping is left[i] → right[i]
      for (let i = 0; i < (activity.pairs?.length ?? 0); i++) {
        const connectedShuffledIdx = connections[i];
        if (connectedShuffledIdx === undefined) return false;
        if (shuffledRight[connectedShuffledIdx] !== i) return false;
      }
      return true;
    }
    if (isWordScramble) {
      const formed = wordAnswer.map(s => s ? s.split("|")[0] : "").join("");
      return formed === activity.word?.toUpperCase();
    }
    if (isCrossword) {
      return Object.values(crosswordCorrect).every(Boolean);
    }
    if (isWordBuilder) {
      if (!activity.correctSentence) return true;
      if (wordBuilderSentence.length !== activity.correctSentence.length) return false;
      return activity.correctSentence.every((chip, i) => chip === wordBuilderSentence[i]);
    }
    if (isBudgetAllocation) {
      const correct = activity.correctResources ?? [];
      if (budgetSelected.length !== correct.length) return false;
      return correct.every(id => budgetSelected.includes(id));
    }
    if (isRiskEvent) return true; // no single correct answer
    if (isDependencyGraph) {
      const correct = activity.graphCorrectEdges ?? [];
      if (graphEdges.length !== correct.length) return false;
      return correct.every(ce =>
        graphEdges.some(ue =>
          (ue.from === ce.from && ue.to === ce.to) ||
          (ue.from === ce.to && ue.to === ce.from)
        )
      );
    }
    if (isTeamBuilder) {
      const correct = activity.correctTeam ?? [];
      if (selectedTeam.length !== correct.length) return false;
      return correct.every(id => selectedTeam.includes(id));
    }
    return false;
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;
    const correct = checkCorrect();
    if (correct) playComplete(); else playWrong();
    completeActivity(activity.id, stage.id, correct, activity.xp);
    navigate("/feedback", {
      state: {
        correct,
        xp: correct ? activity.xp : 0,
        explanation: activity.explanation,
        hint: activity.hint,
        stageId: stage.id,
        activityId: activity.id,
        nextPath: `/stage/${stage.id}`,
        isReflection,
      },
    });
  };

  // ── Order steps handlers ──────────────────────────────────────────────────
  const handleSelectOrderItem = (itemIndex: number) => {
    playSelect();
    setAvailableItems(prev => prev.filter(i => i !== itemIndex));
    setSelectedOrder(prev => {
      const newOrder = [...prev, itemIndex];
      setOrderedItems(newOrder);
      return newOrder;
    });
  };
  const handleRemoveOrderItem = (position: number) => {
    playClick();
    const removedIndex = selectedOrder[position];
    setSelectedOrder(prev => prev.filter((_, i) => i !== position));
    setOrderedItems(prev => prev.filter((_, i) => i !== position));
    setAvailableItems(prev => [...prev, removedIndex].sort((a, b) => a - b));
  };

  // ── Connect concepts handlers ─────────────────────────────────────────────
  const handleLeftTap = (idx: number) => {
    playSelect();
    // If already connected, allow re-selecting to reconnect
    if (connections[idx] !== undefined) {
      // Remove this connection
      const rightIdx = connections[idx];
      setConnections(prev => {
        const next = { ...prev };
        delete next[idx];
        return next;
      });
      setSelectedLeft(idx);
    } else {
      setSelectedLeft(prev => (prev === idx ? null : idx));
    }
  };
  const handleRightTap = (shuffledIdx: number) => {
    if (selectedLeft === null) return;
    playSelect();
    // Check if this right slot is already taken by another left
    const existingLeft = Object.entries(connections).find(([, v]) => v === shuffledIdx);
    if (existingLeft) {
      // Remove the old connection
      setConnections(prev => {
        const next = { ...prev };
        delete next[Number(existingLeft[0])];
        return next;
      });
    }
    // Remove any existing connection from selectedLeft
    setConnections(prev => {
      const next = { ...prev };
      delete next[selectedLeft];
      next[selectedLeft] = shuffledIdx;
      return next;
    });
    setSelectedLeft(null);
  };

  // ── Word scramble handlers ─────────────────────────────────────────────────
  const handlePoolTap = (poolIdx: number) => {
    if (wordPoolUsed[poolIdx]) return;
    playSelect();
    // Place letter in the first empty slot
    const firstEmpty = wordAnswer.findIndex(l => l === null);
    if (firstEmpty === -1) return;
    setWordAnswer(prev => {
      const next = [...prev];
      next[firstEmpty] = scrambledPool[poolIdx].letter + "|" + poolIdx;
      return next;
    });
    setWordPoolUsed(prev => {
      const next = [...prev];
      next[poolIdx] = true;
      return next;
    });
  };
  const handleSlotTap = (slotIdx: number) => {
    const val = wordAnswer[slotIdx];
    if (!val) return;
    playClick();
    const poolIdx = parseInt(val.split("|")[1]);
    setWordAnswer(prev => {
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
    setWordPoolUsed(prev => {
      const next = [...prev];
      next[poolIdx] = false;
      return next;
    });
  };
  const handleClearWord = () => {
    playClick();
    setWordAnswer(new Array(activity.word?.length ?? 0).fill(null));
    setWordPoolUsed(new Array(scrambledPool.length).fill(false));
  };

  // ── Word builder handlers ───────────────────────────────────────────────────
  const handleWordBuilderChipTap = (chip: string, poolIdx: number) => {
    playSelect();
    setWordBuilderSentence(prev => [...prev, chip]);
    setWordBuilderPool(prev => {
      const next = [...prev];
      next.splice(poolIdx, 1);
      return next;
    });
  };
  const handleWordBuilderSentenceTap = (sentenceIdx: number) => {
    playClick();
    const chip = wordBuilderSentence[sentenceIdx];
    setWordBuilderSentence(prev => prev.filter((_, i) => i !== sentenceIdx));
    setWordBuilderPool(prev => [...prev, chip]);
  };
  const handleWordBuilderClear = () => {
    playClick();
    if (activity.wordChips) {
      setWordBuilderPool(prev => [...prev, ...wordBuilderSentence]);
    }
    setWordBuilderSentence([]);
  };

  // ── Crossword helpers ─────────────────────────────────────────────────────
  const getCellNumber = (data: CrosswordData, row: number, col: number): number | null => {
    const match = data.words.find(w => w.row === row && w.col === col);
    return match ? match.number : null;
  };

  const isCellInSelectedWord = (data: CrosswordData, row: number, col: number): boolean => {
    if (selectedClue === null) return false;
    const word = data.words[selectedClue];
    if (!word) return false;
    for (let i = 0; i < word.answer.length; i++) {
      const r = word.direction === "across" ? word.row : word.row + i;
      const c = word.direction === "across" ? word.col + i : word.col;
      if (r === row && c === col) return true;
    }
    return false;
  };

  const handleCrosswordClueSelect = (wordIdx: number) => {
    playSelect();
    setSelectedClue(wordIdx);
    setCrosswordInput("");
  };

  const handleCrosswordSubmitWord = () => {
    if (selectedClue === null || !activity.crossword) return;
    const word = activity.crossword.words[selectedClue];
    const answer = crosswordInput.toUpperCase().trim();
    const isCorrect = answer === word.answer;
    if (isCorrect) {
      playCorrect();
      // Fill in the grid cells
      const newInputs = { ...crosswordInputs };
      for (let i = 0; i < word.answer.length; i++) {
        const r = word.direction === "across" ? word.row : word.row + i;
        const c = word.direction === "across" ? word.col + i : word.col;
        newInputs[`${r}-${c}`] = word.answer[i];
      }
      setCrosswordInputs(newInputs);
      setCrosswordCorrect(prev => ({ ...prev, [selectedClue]: true }));
      setSelectedClue(null);
      setCrosswordInput("");
    } else {
      // Shake effect — just clear input
      playWrong();
      setCrosswordInput("");
    }
  };

  // ── Dependency graph handler ─────────────────────────────────────────────
  const handleGraphNodeTap = (nodeId: string) => {
    playSelect();
    if (graphSelected === null) {
      setGraphSelected(nodeId);
      return;
    }
    if (graphSelected === nodeId) {
      setGraphSelected(null);
      return;
    }
    const existingIdx = graphEdges.findIndex(e =>
      (e.from === graphSelected && e.to === nodeId) ||
      (e.from === nodeId && e.to === graphSelected)
    );
    if (existingIdx !== -1) {
      playClick();
      setGraphEdges(prev => prev.filter((_, i) => i !== existingIdx));
    } else {
      setGraphEdges(prev => [...prev, { from: graphSelected, to: nodeId }]);
    }
    setGraphSelected(null);
  };

  const typeLabel: Record<string, string> = {
    "multiple-choice": "Selección múltiple",
    "order-steps": "Ordenar pasos",
    "fill-blank": "Completar frase",
    "reflection": "Reflexión guiada",
    "true-false": "Verdadero o Falso",
    "connect-concepts": "Conectar conceptos",
    "word-scramble": "Adivinar palabra",
    "crossword": "Crucigrama",
    "word-builder": "Mini Juego",
    "timeline-order": "Mini Juego",
    "budget-allocation": "Mini Juego",
    "risk-event": "Mini Juego",
    "dependency-graph": "Mini Juego",
    "team-builder": "Mini Juego",
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <MobileLayout noPadding>
      <PixelCompanion position="floating" context="activity" />
      <div className="flex flex-col min-h-screen" style={{ background: "#f8fafc" }}>

        {/* Header */}
        <div
          className="px-5 pt-12 pb-4 flex items-center gap-3"
          style={{ background: "white", borderBottom: "1px solid #e2e8f0" }}
        >
          <button
            onClick={() => { playBack(); navigate(`/stage/${stageId}`); }}
            className="rounded-xl flex items-center justify-center"
            style={{ width: "36px", height: "36px", background: "#f1f5f9" }}
          >
            <ArrowLeft size={18} color="#64748b" />
          </button>
          <div className="flex-1">
            <p style={{ color: stage.color, fontSize: "11px", fontWeight: 700 }}>
              ETAPA {stage.id} · {typeLabel[activity.type].toUpperCase()}
            </p>
            <p style={{ color: "#0f172a", fontSize: "15px", fontWeight: 700 }}>{activity.title}</p>
          </div>
          <div
            className="rounded-xl px-2.5 py-1"
            style={{ background: stage.bgColor, border: `1px solid ${stage.borderColor}` }}
          >
            <span style={{ color: stage.color, fontSize: "12px", fontWeight: 700 }}>+{activity.xp} XP</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-36 pt-5 flex flex-col gap-5">

          {/* Question */}
          <div
            className="rounded-3xl p-5"
            style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            {!isDependencyGraph && <QuestionIllustration question={activityIllustrationText} stage={stage} />}
            <p style={{ color: "#0f172a", fontSize: "16px", fontWeight: 600, lineHeight: 1.5 }}>
              {activity.question}
            </p>
          </div>

          {/* ── MULTIPLE CHOICE ──────────────────────────────────────────── */}
          {isMultipleChoice && activity.options && (
            <div className="flex flex-col gap-3">
              {activity.options.map((option, index) => {
                const isSelected = selectedOption === index;
                return (
                  <motion.button
                    key={option.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { if (!submitted) { playSelect(); setSelectedOption(index); } }}
                    className="rounded-2xl p-4 flex items-start gap-3 w-full text-left transition-all"
                    style={{
                      background: isSelected ? `${stage.color}10` : "white",
                      border: isSelected ? `2px solid ${stage.color}` : "1.5px solid #e2e8f0",
                      boxShadow: isSelected ? `0 4px 16px ${stage.color}20` : "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      className="flex-shrink-0 rounded-full flex items-center justify-center"
                      style={{
                        width: "28px", height: "28px", minWidth: "28px",
                        background: isSelected ? stage.color : "#f1f5f9",
                        border: isSelected ? "none" : "1.5px solid #e2e8f0",
                      }}
                    >
                      {isSelected ? (
                        <Check size={14} color="white" />
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600 }}>
                          {["A", "B", "C", "D"][index]}
                        </span>
                      )}
                    </div>
                    <p style={{ color: isSelected ? stage.color : "#1e293b", fontSize: "14px", lineHeight: 1.5, fontWeight: isSelected ? 600 : 400 }}>
                      {option.text}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* ── ORDER STEPS ──────────────────────────────────────────────── */}
          {isOrderSteps && activity.items && (
            <div className="flex flex-col gap-4">
              <div>
                <p style={{ color: "#64748b", fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
                  TU ORDEN ({selectedOrder.length}/{activity.items.length}):
                </p>
                <div className="flex flex-col gap-2 min-h-16">
                  {selectedOrder.length === 0 ? (
                    <div className="rounded-2xl p-4 flex items-center justify-center" style={{ border: "2px dashed #e2e8f0", minHeight: "60px" }}>
                      <p style={{ color: "#94a3b8", fontSize: "13px" }}>Toca los elementos de abajo para ordenarlos</p>
                    </div>
                  ) : (
                    selectedOrder.map((itemIndex, position) => (
                      <motion.div
                        key={`selected-${itemIndex}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl p-3 flex items-center gap-3"
                        style={{ background: `${stage.color}10`, border: `1.5px solid ${stage.color}40` }}
                      >
                        <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: "28px", height: "28px", background: stage.color, color: "white", fontSize: "13px", fontWeight: 700 }}>
                          {position + 1}
                        </div>
                        <p style={{ color: "#0f172a", fontSize: "13px", flex: 1, lineHeight: 1.4 }}>{activity.items![itemIndex]}</p>
                        <button onClick={() => handleRemoveOrderItem(position)}>
                          <X size={16} color="#94a3b8" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
              {availableItems.length > 0 && (
                <div>
                  <p style={{ color: "#64748b", fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>ELEMENTOS DISPONIBLES:</p>
                  <div className="flex flex-col gap-2">
                    {availableItems.map(itemIndex => (
                      <motion.button
                        key={`available-${itemIndex}`}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectOrderItem(itemIndex)}
                        className="rounded-2xl p-3 flex items-center gap-3 text-left w-full"
                        style={{ background: "white", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}
                      >
                        <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: "28px", height: "28px", background: "#f1f5f9", border: "1.5px solid #e2e8f0" }}>
                          <span style={{ color: "#94a3b8", fontSize: "13px" }}>+</span>
                        </div>
                        <p style={{ color: "#1e293b", fontSize: "13px", lineHeight: 1.4 }}>{activity.items![itemIndex]}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TIMELINE ORDER ────────────────────────────────────────────── */}
          {isTimelineOrder && activity.timelineItems && (
            <div className="flex flex-col gap-4">
              {/* Placed items */}
              <div>
                <p style={{ color: "#64748b", fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
                  TU CRONOGRAMA ({selectedOrder.length}/{activity.timelineItems.length}):
                </p>
                <div className="flex flex-col gap-2 min-h-16">
                  {selectedOrder.length === 0 ? (
                    <div className="rounded-2xl p-4 flex items-center justify-center" style={{ border: "2px dashed #e2e8f0", minHeight: "60px" }}>
                      <p style={{ color: "#94a3b8", fontSize: "13px" }}>Toca las tareas de abajo para ordenarlas</p>
                    </div>
                  ) : (
                    selectedOrder.map((itemIndex, position) => {
                      const item = activity.timelineItems![itemIndex];
                      return (
                        <motion.div
                          key={`placed-${itemIndex}`}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-2xl flex items-center gap-3 overflow-hidden"
                          style={{ background: "white", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                        >
                          {/* Number badge */}
                          <div
                            className="flex items-center justify-center flex-shrink-0"
                            style={{ width: "40px", height: "52px", background: "#f1f5f9", borderRight: "1px solid #e2e8f0" }}
                          >
                            <span style={{ color: "#64748b", fontSize: "14px", fontWeight: 700 }}>{position + 1}</span>
                          </div>
                          {/* Colored task label */}
                          <div
                            className="flex-1 py-3 px-2 rounded-xl"
                            style={{ background: `${item.color}20`, border: `1.5px solid ${item.color}60` }}
                          >
                            <p style={{ color: "#1e293b", fontSize: "13px", fontWeight: 600, lineHeight: 1.3 }}>{item.text}</p>
                          </div>
                          {/* Duration */}
                          <div className="flex items-center gap-1 pr-2 flex-shrink-0">
                            <span style={{ color: "#64748b", fontSize: "12px", fontWeight: 500 }}>{item.duration}</span>
                            <button onClick={() => handleRemoveOrderItem(position)} style={{ marginLeft: "4px" }}>
                              <X size={14} color="#cbd5e1" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Available items */}
              {availableItems.length > 0 && (
                <div>
                  <p style={{ color: "#64748b", fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>TAREAS DISPONIBLES:</p>
                  <div className="flex flex-col gap-2">
                    {availableItems.map(itemIndex => {
                      const item = activity.timelineItems![itemIndex];
                      return (
                        <motion.button
                          key={`avail-${itemIndex}`}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectOrderItem(itemIndex)}
                          className="rounded-2xl flex items-center gap-3 overflow-hidden text-left w-full"
                          style={{ background: "white", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}
                        >
                          <div
                            className="flex items-center justify-center flex-shrink-0"
                            style={{ width: "40px", height: "52px", background: "#f8fafc", borderRight: "1px solid #e2e8f0" }}
                          >
                            <span style={{ color: "#cbd5e1", fontSize: "16px", fontWeight: 700 }}>+</span>
                          </div>
                          <div
                            className="flex-1 py-3 px-2 rounded-xl"
                            style={{ background: `${item.color}15`, border: `1.5px solid ${item.color}40` }}
                          >
                            <p style={{ color: "#334155", fontSize: "13px", lineHeight: 1.3 }}>{item.text}</p>
                          </div>
                          <div className="pr-3 flex-shrink-0">
                            <span style={{ color: "#94a3b8", fontSize: "12px" }}>{item.duration}</span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Total time */}
              {selectedOrder.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl p-4 flex items-center justify-between"
                  style={{ background: `${stage.color}08`, border: `1.5px solid ${stage.color}25` }}
                >
                  <span style={{ color: "#64748b", fontSize: "13px", fontWeight: 600 }}>Tiempo total estimado:</span>
                  <span style={{ color: stage.color, fontSize: "15px", fontWeight: 700 }}>
                    {(() => {
                      let totalWeeks = 0;
                      selectedOrder.forEach(idx => {
                        const dur = activity.timelineItems![idx].duration;
                        const match = dur.match(/(\d+)/);
                        if (match) totalWeeks += parseInt(match[1]);
                      });
                      return `${totalWeeks} semana${totalWeeks !== 1 ? "s" : ""}`;
                    })()}
                  </span>
                </motion.div>
              )}
            </div>
          )}

          {/* ── REFLECTION ───────────────────────────────────────────────── */}
          {isReflection && (
            <div>
              {/* Mode toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => {
                    setReflectionMode("text");
                    if (isRecording && recognitionRef.current) {
                      recognitionRef.current.stop();
                      setIsRecording(false);
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: reflectionMode === "text" ? stage.color : "#f1f5f9",
                    color: reflectionMode === "text" ? "white" : "#64748b",
                    border: `2px solid ${reflectionMode === "text" ? stage.color : "#e2e8f0"}`,
                  }}
                >
                  <Type size={14} />
                  Texto
                </button>
                <button
                  onClick={() => setReflectionMode("voice")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: reflectionMode === "voice" ? stage.color : "#f1f5f9",
                    color: reflectionMode === "voice" ? "white" : "#64748b",
                    border: `2px solid ${reflectionMode === "voice" ? stage.color : "#e2e8f0"}`,
                  }}
                >
                  <Mic size={14} />
                  Audio
                </button>
              </div>

              {reflectionMode === "text" ? (
                <textarea
                  value={reflectionText}
                  onChange={e => setReflectionText(e.target.value)}
                  placeholder={activity.placeholder || "Escribe tu reflexión aquí..."}
                  className="w-full rounded-2xl p-4 resize-none"
                  rows={6}
                  style={{
                    background: "white",
                    border: reflectionText.length > 20 ? `2px solid ${stage.color}` : "1.5px solid #e2e8f0",
                    fontSize: "14px", color: "#1e293b", lineHeight: 1.6, outline: "none",
                    fontFamily: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                />
              ) : (
                <div
                  className="w-full rounded-2xl p-4 flex flex-col items-center gap-4"
                  style={{
                    background: "white",
                    border: reflectionText.length > 20 ? `2px solid ${stage.color}` : "1.5px solid #e2e8f0",
                    minHeight: "160px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Mic button */}
                  <button
                    onClick={() => {
                      const SpeechRecognitionAPI =
                        (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
                        (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

                      if (!SpeechRecognitionAPI) {
                        alert("Tu navegador no soporta reconocimiento de voz. Intenta con Chrome.");
                        return;
                      }

                      if (isRecording) {
                        recognitionRef.current?.stop();
                        setIsRecording(false);
                      } else {
                        const recognition = new SpeechRecognitionAPI();
                        recognition.lang = "es-ES";
                        recognition.continuous = true;
                        recognition.interimResults = true;

                        let finalTranscript = reflectionText;

                        recognition.onresult = (event: SpeechRecognitionEvent) => {
                          let interim = "";
                          for (let i = event.resultIndex; i < event.results.length; i++) {
                            const transcript = event.results[i][0].transcript;
                            if (event.results[i].isFinal) {
                              finalTranscript += (finalTranscript ? " " : "") + transcript;
                              setReflectionText(finalTranscript);
                            } else {
                              interim = transcript;
                            }
                          }
                          if (interim) {
                            setReflectionText(finalTranscript + (finalTranscript ? " " : "") + interim);
                          }
                        };

                        recognition.onend = () => {
                          setReflectionText(finalTranscript);
                          setIsRecording(false);
                        };

                        recognition.onerror = () => {
                          setIsRecording(false);
                        };

                        recognitionRef.current = recognition;
                        recognition.start();
                        setIsRecording(true);
                      }
                    }}
                    className="rounded-full flex items-center justify-center transition-all"
                    style={{
                      width: 72, height: 72,
                      background: isRecording
                        ? "linear-gradient(135deg, #ef4444, #dc2626)"
                        : `linear-gradient(135deg, ${stage.color}, ${stage.color}cc)`,
                      boxShadow: isRecording
                        ? "0 0 0 8px rgba(239,68,68,0.2), 0 4px 16px rgba(239,68,68,0.4)"
                        : `0 4px 16px ${stage.color}55`,
                      animation: isRecording ? "pulse 1.5s infinite" : "none",
                    }}
                  >
                    {isRecording ? <MicOff size={28} color="white" /> : <Mic size={28} color="white" />}
                  </button>
                  <p style={{ color: isRecording ? "#ef4444" : "#64748b", fontSize: "13px", fontWeight: 600, textAlign: "center" }}>
                    {isRecording ? "Grabando... toca para detener" : "Toca el micrófono para hablar"}
                  </p>
                  {reflectionText.length > 0 && (
                    <div
                      className="w-full rounded-xl p-3"
                      style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                    >
                      <p style={{ color: "#475569", fontSize: "13px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                        {reflectionText}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-2 px-1">
                <p style={{ color: "#94a3b8", fontSize: "12px" }}>Mínimo 20 caracteres para continuar</p>
                <p style={{ color: reflectionText.length > 20 ? stage.color : "#94a3b8", fontSize: "12px", fontWeight: 600 }}>
                  {reflectionText.length} caracteres
                </p>
              </div>
            </div>
          )}

          {/* ── TRUE / FALSE ─────────────────────────────────────────────── */}
          {isTrueFalse && (
            <div className="flex flex-col gap-4">
              {/* Statement card */}
              <div
                className="rounded-3xl p-5"
                style={{
                  background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                  border: "1.5px solid #e2e8f0",
                }}
              >
                <p style={{ color: "#64748b", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "10px" }}>
                  ENUNCIADO
                </p>
                <p style={{ color: "#1e293b", fontSize: "15px", lineHeight: 1.6, fontStyle: "italic" }}>
                  "{trueFalseStatements[activity.id] || activity.question}"
                </p>
              </div>

              {/* True/False buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { playSelect(); setTrueFalseAnswer(true); }}
                  className="rounded-2xl p-5 flex flex-col items-center gap-2"
                  style={{
                    background: trueFalseAnswer === true ? "#ecfdf5" : "white",
                    border: trueFalseAnswer === true ? "2px solid #10b981" : "1.5px solid #e2e8f0",
                    boxShadow: trueFalseAnswer === true ? "0 4px 16px rgba(16,185,129,0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{ width: "44px", height: "44px", background: trueFalseAnswer === true ? "#10b981" : "#f1f5f9" }}
                  >
                    <Check size={22} color={trueFalseAnswer === true ? "white" : "#94a3b8"} />
                  </div>
                  <span style={{ color: trueFalseAnswer === true ? "#065f46" : "#64748b", fontSize: "15px", fontWeight: 700 }}>
                    Verdadero
                  </span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { playSelect(); setTrueFalseAnswer(false); }}
                  className="rounded-2xl p-5 flex flex-col items-center gap-2"
                  style={{
                    background: trueFalseAnswer === false ? "#fef2f2" : "white",
                    border: trueFalseAnswer === false ? "2px solid #ef4444" : "1.5px solid #e2e8f0",
                    boxShadow: trueFalseAnswer === false ? "0 4px 16px rgba(239,68,68,0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{ width: "44px", height: "44px", background: trueFalseAnswer === false ? "#ef4444" : "#f1f5f9" }}
                  >
                    <X size={22} color={trueFalseAnswer === false ? "white" : "#94a3b8"} />
                  </div>
                  <span style={{ color: trueFalseAnswer === false ? "#7f1d1d" : "#64748b", fontSize: "15px", fontWeight: 700 }}>
                    Falso
                  </span>
                </motion.button>
              </div>
            </div>
          )}

          {/* ── CONNECT CONCEPTS ─────────────────────────────────────────── */}
          {isConnectConcepts && activity.pairs && (
            <div className="flex flex-col gap-4">
              <p style={{ color: "#64748b", fontSize: "12px", lineHeight: 1.5 }}>
                Toca un concepto de la izquierda y luego su definición correcta en la derecha.
              </p>

              {/* Legend */}
              <div className="flex gap-2 flex-wrap">
                {activity.pairs.map((_, i) => {
                  const isConnected = connections[i] !== undefined;
                  return (
                    <div key={i} className="flex items-center gap-1">
                      <div
                        className="rounded-full"
                        style={{
                          width: "10px", height: "10px",
                          background: isConnected ? CONNECT_COLORS[i % CONNECT_COLORS.length] : "#e2e8f0",
                        }}
                      />
                    </div>
                  );
                })}
                <span style={{ color: "#94a3b8", fontSize: "11px" }}>
                  {Object.keys(connections).length}/{activity.pairs.length} conectados
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Left column */}
                <div className="flex flex-col gap-2">
                  <p style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 700, textAlign: "center" }}>CONCEPTO</p>
                  {activity.pairs.map((pair, i) => {
                    const isSelected = selectedLeft === i;
                    const isConnected = connections[i] !== undefined;
                    const color = CONNECT_COLORS[i % CONNECT_COLORS.length];
                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleLeftTap(i)}
                        className="rounded-2xl p-3 text-center"
                        style={{
                          background: isSelected ? `${color}20` : isConnected ? `${color}12` : "white",
                          border: isSelected ? `2px solid ${color}` : isConnected ? `2px solid ${color}60` : "1.5px solid #e2e8f0",
                          boxShadow: isSelected ? `0 4px 12px ${color}30` : "0 2px 6px rgba(0,0,0,0.04)",
                          minHeight: "64px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ color: isSelected ? color : isConnected ? color : "#1e293b", fontSize: "13px", fontWeight: isSelected || isConnected ? 700 : 500, lineHeight: 1.3 }}>
                          {pair.left}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-2">
                  <p style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 700, textAlign: "center" }}>DEFINICIÓN</p>
                  {shuffledRight.map((originalIdx, shuffledPosition) => {
                    const pair = activity.pairs![originalIdx];
                    // Find if this right slot is connected to any left
                    const connectedLeftEntry = Object.entries(connections).find(([, v]) => v === shuffledPosition);
                    const connectedLeftIdx = connectedLeftEntry ? Number(connectedLeftEntry[0]) : null;
                    const isConnected = connectedLeftIdx !== null;
                    const color = isConnected ? CONNECT_COLORS[connectedLeftIdx % CONNECT_COLORS.length] : "#94a3b8";
                    return (
                      <motion.button
                        key={shuffledPosition}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => selectedLeft !== null && handleRightTap(shuffledPosition)}
                        className="rounded-2xl p-3"
                        style={{
                          background: isConnected ? `${color}12` : selectedLeft !== null ? "#fffbeb" : "white",
                          border: isConnected ? `2px solid ${color}60` : selectedLeft !== null ? "1.5px solid #fde68a" : "1.5px solid #e2e8f0",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                          minHeight: "64px",
                          display: "flex",
                          alignItems: "center",
                          cursor: selectedLeft !== null ? "pointer" : "default",
                        }}
                      >
                        <span style={{ color: isConnected ? color : "#334155", fontSize: "12px", lineHeight: 1.4, textAlign: "left" }}>
                          {pair.right}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Reset button */}
              {Object.keys(connections).length > 0 && (
                <button
                  onClick={() => { setConnections({}); setSelectedLeft(null); }}
                  className="flex items-center justify-center gap-2 py-2 rounded-xl"
                  style={{ background: "#f1f5f9", color: "#64748b", fontSize: "13px", fontWeight: 600, border: "1px solid #e2e8f0" }}
                >
                  <RotateCcw size={14} />
                  Reiniciar conexiones
                </button>
              )}
            </div>
          )}

          {/* ── WORD SCRAMBLE ─────────────────────────────────────────────── */}
          {isWordScramble && activity.word && (
            <div className="flex flex-col gap-5">
              {/* Clue */}
              {activity.wordClue && (
                <div
                  className="rounded-2xl p-4"
                  style={{ background: `${stage.color}08`, border: `1.5px solid ${stage.color}20` }}
                >
                  <p style={{ color: "#64748b", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>PISTA</p>
                  <p style={{ color: "#1e293b", fontSize: "14px", lineHeight: 1.6 }}>{activity.wordClue}</p>
                </div>
              )}

              {/* Answer slots */}
              <div>
                <p style={{ color: "#64748b", fontSize: "11px", fontWeight: 700, marginBottom: "10px" }}>TU RESPUESTA:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {wordAnswer.map((slot, i) => {
                    const letter = slot ? slot.split("|")[0] : null;
                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleSlotTap(i)}
                        className="rounded-xl flex items-center justify-center"
                        style={{
                          width: "44px",
                          height: "52px",
                          background: letter ? stage.color : "white",
                          border: letter ? `2px solid ${stage.color}` : "2px dashed #e2e8f0",
                          boxShadow: letter ? `0 4px 12px ${stage.color}30` : "none",
                          transition: "all 0.15s",
                        }}
                      >
                        <span style={{ color: letter ? "white" : "#cbd5e1", fontSize: "18px", fontWeight: 800 }}>
                          {letter || "_"}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Pool letters */}
              <div>
                <p style={{ color: "#64748b", fontSize: "11px", fontWeight: 700, marginBottom: "10px" }}>LETRAS DISPONIBLES:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {scrambledPool.map((item, poolIdx) => {
                    const isUsed = wordPoolUsed[poolIdx];
                    return (
                      <motion.button
                        key={poolIdx}
                        whileTap={{ scale: isUsed ? 1 : 0.9 }}
                        onClick={() => handlePoolTap(poolIdx)}
                        className="rounded-xl flex items-center justify-center"
                        style={{
                          width: "44px",
                          height: "52px",
                          background: isUsed ? "#f1f5f9" : "white",
                          border: isUsed ? "1.5px solid #e2e8f0" : `2px solid ${stage.color}60`,
                          boxShadow: isUsed ? "none" : `0 3px 10px ${stage.color}20`,
                          opacity: isUsed ? 0.4 : 1,
                          cursor: isUsed ? "default" : "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        <span style={{ color: isUsed ? "#cbd5e1" : stage.color, fontSize: "18px", fontWeight: 800 }}>
                          {item.letter}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Clear button */}
              {wordAnswer.some(l => l !== null) && (
                <button
                  onClick={handleClearWord}
                  className="flex items-center justify-center gap-2 py-2 rounded-xl"
                  style={{ background: "#f1f5f9", color: "#64748b", fontSize: "13px", fontWeight: 600, border: "1px solid #e2e8f0" }}
                >
                  <Delete size={14} />
                  Borrar respuesta
                </button>
              )}
            </div>
          )}

          {/* ── CROSSWORD ─────────────────────────────────────────────────── */}
          {isCrossword && activity.crossword && (
            <div className="flex flex-col gap-4">
              {/* Grid */}
              <div className="flex justify-center">
                <CrosswordGrid
                  data={activity.crossword}
                  crosswordInputs={crosswordInputs}
                  selectedClue={selectedClue}
                  crosswordCorrect={crosswordCorrect}
                  stageColor={stage.color}
                  onSelectWord={(wordIdx) => handleCrosswordClueSelect(wordIdx)}
                  isCellInSelectedWord={isCellInSelectedWord}
                  getCellNumber={getCellNumber}
                />
              </div>

              {/* Clues */}
              <div className="flex flex-col gap-2">
                <p style={{ color: "#64748b", fontSize: "11px", fontWeight: 700 }}>PISTAS — toca para seleccionar:</p>
                {activity.crossword.words.map((word, wordIdx) => {
                  const isDone = crosswordCorrect[wordIdx];
                  const isSelected = selectedClue === wordIdx;
                  return (
                    <motion.button
                      key={wordIdx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => !isDone && handleCrosswordClueSelect(wordIdx)}
                      className="rounded-2xl p-3 flex items-start gap-3 text-left"
                      style={{
                        background: isDone ? "#ecfdf5" : isSelected ? `${stage.color}10` : "white",
                        border: isDone ? "1.5px solid #a7f3d0" : isSelected ? `2px solid ${stage.color}` : "1.5px solid #e2e8f0",
                        boxShadow: isSelected ? `0 4px 12px ${stage.color}20` : "0 2px 6px rgba(0,0,0,0.04)",
                        cursor: isDone ? "default" : "pointer",
                      }}
                    >
                      <div
                        className="flex-shrink-0 rounded-lg flex items-center justify-center"
                        style={{
                          width: "28px", height: "28px",
                          background: isDone ? "#d1fae5" : isSelected ? stage.color : "#f1f5f9",
                        }}
                      >
                        {isDone ? (
                          <Check size={14} color="#10b981" />
                        ) : (
                          <span style={{ color: isSelected ? "white" : "#64748b", fontSize: "11px", fontWeight: 700 }}>
                            {word.number}{word.direction === "across" ? "H" : "V"}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p style={{ color: isDone ? "#065f46" : isSelected ? stage.color : "#1e293b", fontSize: "13px", lineHeight: 1.5, fontWeight: isSelected ? 600 : 400 }}>
                          {word.clue}
                        </p>
                        <p style={{ color: isDone ? "#059669" : "#94a3b8", fontSize: "11px", marginTop: "2px" }}>
                          {word.answer.length} letras · {word.direction === "across" ? "Horizontal" : "Vertical"}
                          {isDone && " · Correcto"}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Word input */}
              <AnimatePresence>
                {selectedClue !== null && !crosswordCorrect[selectedClue] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="rounded-2xl p-4"
                    style={{ background: `${stage.color}08`, border: `1.5px solid ${stage.color}30` }}
                  >
                    <p style={{ color: stage.color, fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>
                      ESCRIBE LA RESPUESTA ({activity.crossword.words[selectedClue].answer.length} letras):
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={crosswordInput}
                        onChange={e => setCrosswordInput(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === "Enter" && handleCrosswordSubmitWord()}
                        maxLength={activity.crossword.words[selectedClue].answer.length}
                        placeholder={`${activity.crossword.words[selectedClue].answer.length} letras...`}
                        className="flex-1 rounded-xl px-4 py-3"
                        style={{
                          border: `2px solid ${stage.color}40`,
                          fontSize: "18px",
                          fontWeight: 700,
                          letterSpacing: "4px",
                          color: stage.color,
                          background: "white",
                          outline: "none",
                          textTransform: "uppercase",
                        }}
                        autoFocus
                      />
                      <button
                        onClick={handleCrosswordSubmitWord}
                        disabled={crosswordInput.length !== activity.crossword.words[selectedClue].answer.length}
                        className="rounded-xl px-4 py-3 flex items-center justify-center"
                        style={{
                          background: crosswordInput.length === activity.crossword.words[selectedClue].answer.length ? stage.color : "#e2e8f0",
                          color: crosswordInput.length === activity.crossword.words[selectedClue].answer.length ? "white" : "#94a3b8",
                          border: "none",
                          cursor: crosswordInput.length === activity.crossword.words[selectedClue].answer.length ? "pointer" : "not-allowed",
                          transition: "all 0.2s",
                          minWidth: "52px",
                        }}
                      >
                        <Check size={20} />
                      </button>
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: "11px", marginTop: "6px" }}>
                      Presiona Enter o el botón para verificar
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* All correct message */}
              {activity.crossword.words.length > 0 &&
                Object.keys(crosswordCorrect).length === activity.crossword.words.length &&
                Object.values(crosswordCorrect).every(Boolean) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl p-4 flex items-center gap-3"
                    style={{ background: "#ecfdf5", border: "2px solid #a7f3d0" }}
                  >
                    <Check size={20} color="#10b981" />
                    <p style={{ color: "#065f46", fontSize: "14px", fontWeight: 600 }}>
                      ¡Crucigrama completado! Pulsa "Verificar" para continuar.
                    </p>
                  </motion.div>
                )}
            </div>
          )}

          {/* ── WORD BUILDER ─────────────────────────────────────────────── */}
          {isWordBuilder && (
            <div className="flex flex-col gap-4">

              {/* Sentence build area */}
              <div>
                <p style={{ color: "#64748b", fontSize: "12px", fontWeight: 700, marginBottom: "10px" }}>
                  TU OBJETIVO ({wordBuilderSentence.length} palabras):
                </p>
                <div
                  className="rounded-2xl p-4 flex flex-wrap gap-2 min-h-16"
                  style={{
                    background: wordBuilderSentence.length > 0 ? `${stage.color}06` : "white",
                    border: wordBuilderSentence.length > 0 ? `2px solid ${stage.color}30` : "2px dashed #e2e8f0",
                    transition: "all 0.2s",
                  }}
                >
                  {wordBuilderSentence.length === 0 ? (
                    <p style={{ color: "#94a3b8", fontSize: "13px", alignSelf: "center" }}>
                      Toca las palabras de abajo para construir el objetivo
                    </p>
                  ) : (
                    wordBuilderSentence.map((chip, i) => (
                      <motion.button
                        key={`sentence-${i}-${chip}`}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleWordBuilderSentenceTap(i)}
                        className="rounded-2xl px-3 py-2 flex items-center gap-1"
                        style={{
                          background: stage.color,
                          boxShadow: `0 3px 10px ${stage.color}40`,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ color: "white", fontSize: "13px", fontWeight: 600 }}>{chip}</span>
                        <X size={12} color="rgba(255,255,255,0.7)" />
                      </motion.button>
                    ))
                  )}
                </div>
              </div>

              {/* Example toggle */}
              <AnimatePresence>
                {showWordBuilderExample && activity.exampleSentence && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-2xl p-4"
                    style={{ background: "#f0fdf4", border: "1.5px solid #86efac" }}
                  >
                    <p style={{ color: "#15803d", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>EJEMPLO:</p>
                    <p style={{ color: "#166534", fontSize: "14px", lineHeight: 1.6, fontStyle: "italic" }}>
                      "{activity.exampleSentence}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pool */}
              {wordBuilderPool.length > 0 && (
                <div>
                  <p style={{ color: "#64748b", fontSize: "12px", fontWeight: 700, marginBottom: "10px" }}>
                    ELEMENTOS DISPONIBLES:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {wordBuilderPool.map((chip, idx) => (
                      <motion.button
                        key={`pool-${idx}-${chip}`}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleWordBuilderChipTap(chip, idx)}
                        className="rounded-2xl px-3 py-2"
                        style={{
                          background: "white",
                          border: `1.5px solid ${stage.color}50`,
                          boxShadow: `0 2px 8px ${stage.color}15`,
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ color: stage.color, fontSize: "13px", fontWeight: 600 }}>{chip}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowWordBuilderExample(prev => !prev)}
                  className="flex-1 py-2.5 rounded-xl"
                  style={{
                    background: showWordBuilderExample ? "#f0fdf4" : "#f1f5f9",
                    color: showWordBuilderExample ? "#16a34a" : "#64748b",
                    fontSize: "13px", fontWeight: 600,
                    border: showWordBuilderExample ? "1.5px solid #86efac" : "1.5px solid #e2e8f0",
                  }}
                >
                  Ver ejemplo
                </button>
                {wordBuilderSentence.length > 0 && (
                  <button
                    onClick={handleWordBuilderClear}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl"
                    style={{
                      background: "#f1f5f9", color: "#64748b",
                      fontSize: "13px", fontWeight: 600, border: "1.5px solid #e2e8f0",
                    }}
                  >
                    <RotateCcw size={14} />
                    Limpiar
                  </button>
                )}
              </div>

              {/* Pixel chatbot hint */}
              <div
                className="rounded-2xl p-4 flex items-start gap-3"
                style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd" }}
              >
                <div
                  className="flex-shrink-0 rounded-xl flex items-center justify-center"
                  style={{ width: "36px", height: "36px", background: stage.color }}
                >
                  <span style={{ fontSize: "18px" }}>🤖</span>
                </div>
                <p style={{ color: "#0c4a6e", fontSize: "13px", lineHeight: 1.6 }}>
                  Recuerda que un buen objetivo responde: <strong>¿qué?</strong>, <strong>¿para qué?</strong> y <strong>¿a quién?</strong>
                </p>
              </div>
            </div>
          )}

          {/* ── RISK EVENT ───────────────────────────────────────────────── */}
          {isRiskEvent && activity.riskOptions && (
            <div className="flex flex-col gap-4">

              {/* Alert banner */}
              <div
                className="rounded-2xl px-4 py-3 flex items-center gap-3"
                style={{ background: "#fef2f2", border: "2px solid #fca5a5" }}
              >
                <div
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ width: "32px", height: "32px", background: "#ef4444" }}
                >
                  <span style={{ fontSize: "16px" }}>⚠️</span>
                </div>
                <p style={{ color: "#b91c1c", fontSize: "15px", fontWeight: 700 }}>
                  {activity.riskScenario ?? "Evento inesperado"}
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {activity.riskOptions.map((option: RiskOption, index: number) => {
                  const isSelected = riskEventSelected === option.id;
                  const letters = ["A", "B", "C", "D"];
                  return (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { playSelect(); setRiskEventSelected(option.id); }}
                      className="rounded-2xl p-4 flex items-center gap-3 w-full text-left"
                      style={{
                        background: isSelected ? `${option.badgeColor ?? stage.color}12` : "white",
                        border: isSelected ? `2px solid ${option.badgeColor ?? stage.color}` : "1.5px solid #e2e8f0",
                        boxShadow: isSelected ? `0 4px 16px ${option.badgeColor ?? stage.color}25` : "0 2px 8px rgba(0,0,0,0.04)",
                        transition: "all 0.2s",
                      }}
                    >
                      {/* Letter badge */}
                      <div
                        className="flex-shrink-0 rounded-full flex items-center justify-center"
                        style={{
                          width: "32px", height: "32px", minWidth: "32px",
                          background: isSelected ? (option.badgeColor ?? stage.color) : "#f1f5f9",
                          border: isSelected ? "none" : "1.5px solid #e2e8f0",
                        }}
                      >
                        <span style={{ color: isSelected ? "white" : "#94a3b8", fontSize: "13px", fontWeight: 700 }}>
                          {letters[index]}
                        </span>
                      </div>

                      {/* Text + badge */}
                      <div className="flex-1">
                        <p style={{ color: isSelected ? "#0f172a" : "#1e293b", fontSize: "14px", fontWeight: isSelected ? 600 : 400, lineHeight: 1.4 }}>
                          {option.text}
                        </p>
                        {option.badge && (
                          <span
                            className="inline-block mt-1 px-2 py-0.5 rounded-lg"
                            style={{
                              background: `${option.badgeColor ?? stage.color}18`,
                              color: option.badgeColor ?? stage.color,
                              fontSize: "11px",
                              fontWeight: 700,
                            }}
                          >
                            {option.badge}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Impacto estimado */}
              <AnimatePresence>
                {riskEventSelected && (() => {
                  const sel = activity.riskOptions!.find((o: RiskOption) => o.id === riskEventSelected);
                  if (!sel) return null;
                  const impactIcon = (dir?: "up" | "down" | "neutral") =>
                    dir === "up" ? "↑" : dir === "down" ? "↓" : "–";
                  const impactColor = (dir?: "up" | "down" | "neutral", isRisk = false) => {
                    if (dir === "up") return isRisk ? "#ef4444" : "#10b981";
                    if (dir === "down") return isRisk ? "#10b981" : "#ef4444";
                    return "#94a3b8";
                  };
                  return (
                    <motion.div
                      key={riskEventSelected}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-2xl p-4"
                      style={{ background: "white", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                    >
                      <p style={{ color: "#64748b", fontSize: "11px", fontWeight: 700, marginBottom: "12px" }}>IMPACTO ESTIMADO</p>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Tiempo */}
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: "18px" }}>⏱</span>
                          <span style={{ color: "#64748b", fontSize: "13px" }}>Tiempo</span>
                          <span style={{ color: impactColor(sel.impacts.tiempo), fontSize: "15px", fontWeight: 700, marginLeft: "auto" }}>
                            {impactIcon(sel.impacts.tiempo)}
                          </span>
                        </div>
                        {/* Presupuesto */}
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: "18px" }}>💰</span>
                          <span style={{ color: "#64748b", fontSize: "13px" }}>Presupuesto</span>
                          <span style={{ color: impactColor(sel.impacts.presupuesto), fontSize: "15px", fontWeight: 700, marginLeft: "auto" }}>
                            {impactIcon(sel.impacts.presupuesto)}
                          </span>
                        </div>
                        {/* Calidad */}
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: "18px" }}>⭐</span>
                          <span style={{ color: "#64748b", fontSize: "13px" }}>Calidad</span>
                          <span style={{ color: impactColor(sel.impacts.calidad), fontSize: "15px", fontWeight: 700, marginLeft: "auto" }}>
                            {impactIcon(sel.impacts.calidad)}
                          </span>
                        </div>
                        {/* Riesgo */}
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: "18px" }}>🔴</span>
                          <span style={{ color: "#64748b", fontSize: "13px" }}>Riesgo</span>
                          <span style={{ color: impactColor(sel.impacts.riesgo, true), fontSize: "15px", fontWeight: 700, marginLeft: "auto" }}>
                            {impactIcon(sel.impacts.riesgo)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>

              {/* Companion message */}
              <div
                className="rounded-2xl p-4 flex items-start gap-3"
                style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd" }}
              >
                <div
                  className="flex-shrink-0 rounded-xl flex items-center justify-center"
                  style={{ width: "36px", height: "36px", background: stage.color }}
                >
                  <span style={{ fontSize: "18px" }}>🤖</span>
                </div>
                <p style={{ color: "#0c4a6e", fontSize: "13px", lineHeight: 1.6 }}>
                  {activity.riskCompanionMessage ?? "No existe una única respuesta correcta. Evalúa el impacto de cada decisión."}
                </p>
              </div>
            </div>
          )}

          {/* ── DEPENDENCY GRAPH ─────────────────────────────────────────── */}
          {isDependencyGraph && activity.graphNodes && activity.graphCorrectEdges && (
            <div className="flex flex-col gap-4">

              {/* Split panel: task list + graph */}
              <div
                className="rounded-3xl overflow-hidden"
                style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid #e2e8f0" }}
              >
                <div className="flex" style={{ minHeight: "270px" }}>

                  {/* Left: task labels */}
                  <div
                    className="flex flex-col justify-around py-5 px-4"
                    style={{ width: "44%", background: "#f8fafc", borderRight: "1.5px solid #e2e8f0" }}
                  >
                    {activity.graphNodes.map((node: GraphNode, i: number) => {
                      const colors = ["#3b82f6", "#8b5cf6", "#14b8a6", "#f97316", "#ec4899"];
                      const isLinked = graphEdges.some(e => e.from === node.id || e.to === node.id);
                      return (
                        <div key={node.id} className="flex items-center gap-2">
                          <div
                            className="rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              width: "24px", height: "24px",
                              background: isLinked ? colors[i] : "#e2e8f0",
                              transition: "background 0.2s",
                            }}
                          >
                            <span style={{ color: "white", fontSize: "10px", fontWeight: 700 }}>{node.label}</span>
                          </div>
                          <span style={{ color: "#334155", fontSize: "12px", lineHeight: 1.3 }}>{node.taskName}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right: SVG graph */}
                  <div className="flex-1 flex items-center justify-center p-2">
                    <svg viewBox="0 0 160 220" style={{ width: "100%", maxWidth: "160px" }}>
                      {/* Edges */}
                      {graphEdges.map((edge, i) => {
                        const fromNode = activity.graphNodes!.find((n: GraphNode) => n.id === edge.from)!;
                        const toNode   = activity.graphNodes!.find((n: GraphNode) => n.id === edge.to)!;
                        return (
                          <line
                            key={`edge-${i}`}
                            x1={fromNode.x * 1.6} y1={fromNode.y * 2.2}
                            x2={toNode.x * 1.6}   y2={toNode.y * 2.2}
                            stroke="#22c55e"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        );
                      })}

                      {/* Nodes */}
                      {activity.graphNodes.map((node: GraphNode, i: number) => {
                        const colors = ["#3b82f6", "#8b5cf6", "#14b8a6", "#f97316", "#ec4899"];
                        const cx = node.x * 1.6;
                        const cy = node.y * 2.2;
                        const isSelected = graphSelected === node.id;
                        const color = colors[i];
                        return (
                          <g key={node.id} onClick={() => handleGraphNodeTap(node.id)} style={{ cursor: "pointer" }}>
                            {isSelected && <circle cx={cx} cy={cy} r="24" fill={color} opacity="0.25" />}
                            <circle cx={cx} cy={cy} r="18" fill={color} />
                            {isSelected && <circle cx={cx} cy={cy} r="18" fill="none" stroke="white" strokeWidth="3" />}
                            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="13" fontWeight="bold">
                              {node.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>

              {/* Status + reset */}
              <div className="flex items-center justify-between px-1">
                <span style={{ color: "#64748b", fontSize: "12px" }}>
                  {graphSelected
                    ? `"${activity.graphNodes.find((n: GraphNode) => n.id === graphSelected)?.label}" seleccionado — toca otro nodo`
                    : `Conexiones: ${graphEdges.length} / ${activity.graphCorrectEdges!.length}`}
                </span>
                {graphEdges.length > 0 && (
                  <button
                    onClick={() => { setGraphEdges([]); setGraphSelected(null); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{ background: "#f1f5f9", color: "#64748b", fontSize: "12px", fontWeight: 600, border: "1px solid #e2e8f0" }}
                  >
                    <RotateCcw size={12} />
                    Reiniciar
                  </button>
                )}
              </div>

              {/* Companion message */}
              <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd" }}>
                <div className="flex-shrink-0 rounded-xl flex items-center justify-center" style={{ width: "36px", height: "36px", background: stage.color }}>
                  <span style={{ fontSize: "18px" }}>🤖</span>
                </div>
                <p style={{ color: "#0c4a6e", fontSize: "13px", lineHeight: 1.6 }}>
                  {activity.graphCompanionMessage ?? "Conecta los nodos en el orden correcto de dependencias."}
                </p>
              </div>
            </div>
          )}

          {/* ── TEAM BUILDER ─────────────────────────────────────────────── */}
          {isTeamBuilder && activity.teamMembers && (
            <div className="flex flex-col gap-4">

              {/* Selection counter */}
              <div className="flex items-center justify-between px-1">
                <span style={{ color: "#64748b", fontSize: "12px", fontWeight: 600 }}>
                  Seleccionados: {selectedTeam.length} / {activity.teamSize ?? 4}
                </span>
                {selectedTeam.length > 0 && (
                  <button
                    onClick={() => setSelectedTeam([])}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{ background: "#f1f5f9", color: "#64748b", fontSize: "12px", fontWeight: 600, border: "1px solid #e2e8f0" }}
                  >
                    <RotateCcw size={12} />
                    Limpiar
                  </button>
                )}
              </div>

              {/* Member grid */}
              <div className="grid grid-cols-3 gap-3">
                {activity.teamMembers.map((member: TeamMember) => {
                  const isSelected = selectedTeam.includes(member.id);
                  const isFull = selectedTeam.length >= (activity.teamSize ?? 4);
                  const disabled = !isSelected && isFull;
                  return (
                    <motion.button
                      key={member.id}
                      whileTap={{ scale: disabled ? 1 : 0.95 }}
                      onClick={() => {
                        if (disabled) return;
                        if (isSelected) {
                          playClick();
                          setSelectedTeam(prev => prev.filter(id => id !== member.id));
                        } else {
                          playSelect();
                          setSelectedTeam(prev => [...prev, member.id]);
                        }
                      }}
                      className="rounded-2xl p-3 flex flex-col items-center gap-1.5 relative"
                      style={{
                        background: isSelected ? "#f0fdf4" : "white",
                        border: isSelected ? "2px solid #22c55e" : "1.5px solid #e2e8f0",
                        boxShadow: isSelected ? "0 4px 16px rgba(34,197,94,0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
                        opacity: disabled ? 0.45 : 1,
                        cursor: disabled ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {isSelected && (
                        <div
                          className="absolute top-1.5 right-1.5 rounded-full flex items-center justify-center"
                          style={{ width: "18px", height: "18px", background: "#22c55e" }}
                        >
                          <Check size={10} color="white" strokeWidth={3} />
                        </div>
                      )}
                      <div
                        className="rounded-2xl flex items-center justify-center"
                        style={{ width: "52px", height: "52px", background: isSelected ? "#dcfce7" : "#f1f5f9", fontSize: "28px" }}
                      >
                        {member.emoji}
                      </div>
                      <p style={{ color: isSelected ? "#166534" : "#0f172a", fontSize: "12px", fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>
                        {member.name}
                      </p>
                      <p style={{ color: isSelected ? "#16a34a" : "#94a3b8", fontSize: "10px", textAlign: "center" }}>
                        {member.role}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              {/* Skill bars */}
              {selectedTeam.length > 0 && (() => {
                const members = activity.teamMembers!.filter((m: TeamMember) => selectedTeam.includes(m.id));
                const maxScore = (activity.teamSize ?? 4) * 4;
                const bars = [
                  { label: "Técnicas",     value: members.reduce((s: number, m: TeamMember) => s + m.skills.tecnicas,     0), color: "#3b82f6" },
                  { label: "Gestión",      value: members.reduce((s: number, m: TeamMember) => s + m.skills.gestion,      0), color: "#8b5cf6" },
                  { label: "Comunicación", value: members.reduce((s: number, m: TeamMember) => s + m.skills.comunicacion, 0), color: "#22c55e" },
                ];
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-4 flex flex-col gap-3"
                    style={{ background: "white", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                  >
                    <p style={{ color: "#64748b", fontSize: "11px", fontWeight: 700 }}>HABILIDADES DEL EQUIPO</p>
                    {bars.map(bar => (
                      <div key={bar.label} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span style={{ color: "#64748b", fontSize: "12px" }}>{bar.label}</span>
                          <span style={{ color: bar.color, fontSize: "11px", fontWeight: 700 }}>{bar.value}/{maxScore}</span>
                        </div>
                        <div className="rounded-full overflow-hidden" style={{ height: "8px", background: "#f1f5f9" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((bar.value / maxScore) * 100, 100)}%` }}
                            transition={{ duration: 0.4 }}
                            className="h-full rounded-full"
                            style={{ background: bar.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                );
              })()}

              {/* Companion */}
              <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd" }}>
                <div className="flex-shrink-0 rounded-xl flex items-center justify-center" style={{ width: "36px", height: "36px", background: stage.color }}>
                  <span style={{ fontSize: "18px" }}>🤖</span>
                </div>
                <p style={{ color: "#0c4a6e", fontSize: "13px", lineHeight: 1.6 }}>
                  {activity.teamCompanionMessage ?? "Un equipo equilibrado tiene más posibilidades de éxito."}
                </p>
              </div>
            </div>
          )}

          {/* ── BUDGET ALLOCATION ────────────────────────────────────────── */}
          {isBudgetAllocation && activity.resources && activity.budget !== undefined && (
            <div className="flex flex-col gap-4">
              {/* Budget bar */}
              <div
                className="rounded-2xl p-4 flex items-center justify-between"
                style={{ background: "white", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                <span style={{ color: "#64748b", fontSize: "13px", fontWeight: 600 }}>Presupuesto disponible</span>
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: "16px" }}>🪙</span>
                  <span style={{ color: "#f59e0b", fontSize: "18px", fontWeight: 800 }}>
                    {activity.budget.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Resource grid */}
              <div className="grid grid-cols-2 gap-3">
                {activity.resources.map((resource) => {
                  const isSelected = budgetSelected.includes(resource.id);
                  const totalIfAdded = activity.resources!
                    .filter(r => budgetSelected.includes(r.id))
                    .reduce((sum, r) => sum + r.cost, 0) + (isSelected ? 0 : resource.cost);
                  const wouldExceed = !isSelected && totalIfAdded > activity.budget!;
                  return (
                    <motion.button
                      key={resource.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        if (wouldExceed) return;
                        playSelect();
                        setBudgetSelected(prev =>
                          prev.includes(resource.id)
                            ? prev.filter(id => id !== resource.id)
                            : [...prev, resource.id]
                        );
                      }}
                      className="rounded-2xl p-4 flex flex-col items-start gap-2 text-left relative"
                      style={{
                        background: isSelected ? `${stage.color}10` : wouldExceed ? "#f8fafc" : "white",
                        border: isSelected
                          ? `2px solid ${stage.color}`
                          : wouldExceed
                          ? "1.5px dashed #e2e8f0"
                          : "1.5px solid #e2e8f0",
                        boxShadow: isSelected ? `0 4px 16px ${stage.color}25` : "0 2px 8px rgba(0,0,0,0.04)",
                        opacity: wouldExceed ? 0.5 : 1,
                        cursor: wouldExceed ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {/* Checkmark badge */}
                      <div
                        className="absolute top-3 right-3 rounded-full flex items-center justify-center"
                        style={{
                          width: "22px", height: "22px",
                          background: isSelected ? stage.color : "#f1f5f9",
                          border: isSelected ? "none" : "1.5px solid #e2e8f0",
                          transition: "all 0.2s",
                        }}
                      >
                        {isSelected && <Check size={12} color="white" strokeWidth={3} />}
                      </div>

                      {/* Icon */}
                      <div
                        className="rounded-xl flex items-center justify-center"
                        style={{
                          width: "44px", height: "44px",
                          background: isSelected ? `${stage.color}20` : "#f1f5f9",
                          fontSize: "22px",
                          transition: "all 0.2s",
                        }}
                      >
                        {resource.icon}
                      </div>

                      {/* Name */}
                      <p style={{
                        color: isSelected ? stage.color : "#1e293b",
                        fontSize: "13px",
                        fontWeight: isSelected ? 700 : 500,
                        lineHeight: 1.3,
                        paddingRight: "24px",
                      }}>
                        {resource.name}
                      </p>

                      {/* Cost */}
                      <div className="flex items-center gap-1">
                        <span style={{ fontSize: "13px" }}>🪙</span>
                        <span style={{
                          color: isSelected ? stage.color : "#64748b",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}>
                          {resource.cost.toLocaleString()}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Total selected */}
              {(() => {
                const total = activity.resources!
                  .filter(r => budgetSelected.includes(r.id))
                  .reduce((sum, r) => sum + r.cost, 0);
                const overBudget = total > activity.budget!;
                return (
                  <motion.div
                    key={total}
                    initial={{ opacity: 0.7, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl p-4 flex items-center justify-between"
                    style={{
                      background: overBudget ? "#fef2f2" : total === activity.budget! ? "#f0fdf4" : "white",
                      border: overBudget ? "2px solid #fca5a5" : total === activity.budget! ? "2px solid #86efac" : "1.5px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span style={{ color: overBudget ? "#b91c1c" : total === activity.budget! ? "#15803d" : "#64748b", fontSize: "14px", fontWeight: 600 }}>
                      Total seleccionado:
                    </span>
                    <span style={{
                      color: overBudget ? "#ef4444" : total === activity.budget! ? "#10b981" : "#0f172a",
                      fontSize: "18px", fontWeight: 800,
                    }}>
                      🪙 {total.toLocaleString()}
                    </span>
                  </motion.div>
                );
              })()}

              {/* Chatbot tip */}
              <div
                className="rounded-2xl p-4 flex items-start gap-3"
                style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd" }}
              >
                <div
                  className="flex-shrink-0 rounded-xl flex items-center justify-center"
                  style={{ width: "36px", height: "36px", background: stage.color }}
                >
                  <span style={{ fontSize: "18px" }}>🤖</span>
                </div>
                <p style={{ color: "#0c4a6e", fontSize: "13px", lineHeight: 1.6 }}>
                  Prioriza lo esencial para cumplir tus objetivos <strong>sin exceder el presupuesto</strong>.
                </p>
              </div>
            </div>
          )}

          {/* ── HINT ─────────────────────────────────────────────────────── */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl p-4 flex gap-3"
                style={{ background: "#fffbeb", border: "1.5px solid #fde68a" }}
              >
                <Lightbulb size={18} color="#f59e0b" className="flex-shrink-0 mt-0.5" />
                <p style={{ color: "#92400e", fontSize: "13px", lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700 }}>Pista: </span>{activity.hint}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div
          className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 flex flex-col gap-3"
          style={{
            background: "linear-gradient(to top, #f8fafc 80%, transparent)",
            maxWidth: "430px",
            margin: "0 auto",
          }}
        >
          {!showHint && !isReflection && !isCrossword && (
            <button
              onClick={() => {
                if (hintBought) { setShowHint(true); return; }
                if (state.xp >= 100) {
                  spendXP(100);
                  setHintBought(true);
                  setShowHint(true);
                }
              }}
              disabled={!hintBought && state.xp < 100}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all active:scale-95"
              style={{
                background: !hintBought && state.xp < 100 ? "#f1f5f9" : "#fffbeb",
                color: !hintBought && state.xp < 100 ? "#94a3b8" : "#d97706",
                fontSize: "13px",
                fontWeight: 600,
                border: `1.5px solid ${!hintBought && state.xp < 100 ? "#e2e8f0" : "#fde68a"}`,
                opacity: !hintBought && state.xp < 100 ? 0.6 : 1,
                cursor: !hintBought && state.xp < 100 ? "not-allowed" : "pointer",
              }}
            >
              <Lightbulb size={15} />
              {hintBought ? "Ver pista" : state.xp >= 100 ? "Comprar pista · 100 XP" : `Sin XP suficiente (necesitas 100)`}
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit()}
            className="w-full py-4 rounded-2xl transition-all active:scale-95"
            style={{
              background: canSubmit() ? stage.color : "#e2e8f0",
              color: canSubmit() ? "white" : "#94a3b8",
              fontSize: "16px",
              fontWeight: 700,
              border: "none",
              boxShadow: canSubmit() ? `0 8px 24px ${stage.color}40` : "none",
              cursor: canSubmit() ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            {isReflection ? "Guardar reflexión" : isCrossword ? "Verificar crucigrama" : isWordBuilder ? "Validar objetivo" : isTimelineOrder ? "Validar orden" : isBudgetAllocation ? "Confirmar selección" : isRiskEvent ? "Confirmar decisión" : isDependencyGraph ? "Validar conexiones" : isTeamBuilder ? "Confirmar equipo" : "Comprobar respuesta"}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}

// ─── CONNECT CONCEPT COLORS ───────────────────────────────────────────────────
const CONNECT_COLORS = ["#3b82f6", "#8b5cf6", "#f97316", "#14b8a6", "#ec4899", "#10b981"];

// ─── CROSSWORD GRID COMPONENT ─────────────────────────────────────────────────
interface CrosswordGridProps {
  data: CrosswordData;
  crosswordInputs: Record<string, string>;
  selectedClue: number | null;
  crosswordCorrect: Record<number, boolean>;
  stageColor: string;
  onSelectWord: (wordIdx: number) => void;
  isCellInSelectedWord: (data: CrosswordData, row: number, col: number) => boolean;
  getCellNumber: (data: CrosswordData, row: number, col: number) => number | null;
}

function CrosswordGrid({
  data,
  crosswordInputs,
  selectedClue,
  crosswordCorrect,
  stageColor,
  onSelectWord,
  isCellInSelectedWord,
  getCellNumber,
}: CrosswordGridProps) {
  // Build expected grid to know which cells are active
  const expectedGrid: (string | null)[][] = Array(data.rows)
    .fill(null)
    .map(() => Array(data.cols).fill(null));
  data.words.forEach(word => {
    for (let i = 0; i < word.answer.length; i++) {
      const r = word.direction === "across" ? word.row : word.row + i;
      const c = word.direction === "across" ? word.col + i : word.col;
      expectedGrid[r][c] = word.answer[i];
    }
  });

  const CELL_SIZE = 38;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${data.rows}, ${CELL_SIZE}px)`,
        gridTemplateColumns: `repeat(${data.cols}, ${CELL_SIZE}px)`,
        gap: "2px",
        background: "#1e293b",
        padding: "2px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}
    >
      {expectedGrid.map((row, r) =>
        row.map((cell, c) => {
          const isActive = cell !== null;
          const cellKey = `${r}-${c}`;
          const filledLetter = crosswordInputs[cellKey];
          const cellNum = getCellNumber(data, r, c);
          const isHighlighted = isCellInSelectedWord(data, r, c);

          // Find which word(s) this cell belongs to and if it's correct
          const belongsToWords = data.words
            .map((w, wi) => {
              for (let i = 0; i < w.answer.length; i++) {
                const wr = w.direction === "across" ? w.row : w.row + i;
                const wc = w.direction === "across" ? w.col + i : w.col;
                if (wr === r && wc === c) return wi;
              }
              return -1;
            })
            .filter(wi => wi !== -1);
          const isCellCorrect = belongsToWords.some(wi => crosswordCorrect[wi]);

          return (
            <div
              key={cellKey}
              onClick={() => {
                if (!isActive) return;
                // Find which word starts at this cell
                const wordAtCell = data.words.findIndex(w => w.row === r && w.col === c);
                if (wordAtCell !== -1) onSelectWord(wordAtCell);
              }}
              style={{
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`,
                background: !isActive
                  ? "#1e293b"
                  : isCellCorrect
                  ? "#ecfdf5"
                  : isHighlighted
                  ? `${stageColor}20`
                  : "white",
                border: isHighlighted && !isCellCorrect ? `2px solid ${stageColor}` : isCellCorrect ? "2px solid #10b981" : "none",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isActive && !isCellCorrect ? "pointer" : "default",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            >
              {isActive && cellNum && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: "3px",
                    fontSize: "8px",
                    fontWeight: 700,
                    color: isCellCorrect ? "#059669" : isHighlighted ? stageColor : "#94a3b8",
                    lineHeight: 1,
                  }}
                >
                  {cellNum}
                </span>
              )}
              {isActive && filledLetter && (
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 800,
                    color: isCellCorrect ? "#065f46" : stageColor,
                  }}
                >
                  {filledLetter}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}