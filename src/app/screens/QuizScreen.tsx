import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, Lightbulb, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { QuestionIllustration } from "../components/QuestionIllustration";
import { useApp } from "../context/AppContext";
import { stages } from "../data/gameData";
import confetti from "canvas-confetti";
import { playSelect, playCorrect, playWrong, playNavigate, playBack } from "../utils/sounds";

type QuizPhase = "question" | "feedback" | "results";

export function QuizScreen() {
  const navigate = useNavigate();
  const { stageId } = useParams<{ stageId: string }>();
  const { passQuiz } = useApp();

  const stage = stages.find(s => s.id === Number(stageId));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [phase, setPhase] = useState<QuizPhase>("question");
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Array<{ selected: number; correct: boolean }>>([]);
  const [confirmed, setConfirmed] = useState(false);

  if (!stage || stage.quiz.length === 0) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <p style={{ color: "#64748b" }}>Quiz no disponible</p>
        </div>
      </MobileLayout>
    );
  }

  const question = stage.quiz[currentQuestion];
  const totalQuestions = stage.quiz.length;
  const progress = (currentQuestion / totalQuestions) * 100;
  const isCorrect = selectedAnswer === question.correctAnswer;
  const passed = (score / totalQuestions) >= 0.6;

  const handleSelectAnswer = (index: number) => {
    if (confirmed) return;
    playSelect();
    setSelectedAnswer(index);
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === question.correctAnswer;
    if (correct) {
      playCorrect();
      setScore(prev => prev + 1);
    } else {
      playWrong();
    }
    setAnswers(prev => [...prev, { selected: selectedAnswer, correct }]);
    setConfirmed(true);
    setPhase("feedback");
  };

  const handleNext = () => {
    if (currentQuestion + 1 < totalQuestions) {
      playNavigate();
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setConfirmed(false);
      setPhase("question");
    } else {
      const allAnswers = [...answers];
      const totalCorrect = allAnswers.filter(a => a.correct).length;

      passQuiz(stage.id, totalCorrect, totalQuestions);

      if (totalCorrect / totalQuestions >= 0.6) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.4 },
          colors: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"],
          disableForReducedMotion: true,
        });
        setTimeout(() => {
          navigate(`/unlock/${stage.id}`, { state: { score: totalCorrect, total: totalQuestions } });
        }, 500);
      } else {
        setPhase("results");
      }
    }
  };

  if (phase === "results") {
    const finalScore = answers.filter(a => a.correct).length;
    const finalPassed = (finalScore / totalQuestions) >= 0.6;

    return (
      <MobileLayout noPadding>
        <div
          className="flex flex-col min-h-screen"
          style={{
            background: finalPassed
              ? "linear-gradient(160deg, #ecfdf5 0%, #f8fafc 100%)"
              : "linear-gradient(160deg, #fff7ed 0%, #f8fafc 100%)",
          }}
        >
          <div className="flex flex-col flex-1 items-center justify-center px-6 gap-6 py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="rounded-full flex items-center justify-center"
              style={{
                width: "100px",
                height: "100px",
                background: finalPassed ? "#ecfdf5" : "#fff7ed",
                border: `3px solid ${finalPassed ? "#10b981" : "#f97316"}`,
              }}
            >
              {finalPassed ? (
                <CheckCircle size={52} color="#10b981" strokeWidth={1.5} />
              ) : (
                <BookOpen size={48} color="#f97316" strokeWidth={1.25} />
              )}
            </motion.div>

            <div className="text-center">
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: finalPassed ? "#065f46" : "#9a3412" }}>
                {finalPassed ? "¡Etapa superada!" : "Necesitas repasar"}
              </h1>
              <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
                {finalPassed
                  ? "Demostraste comprensión sólida de los conceptos."
                  : "Alcanza al menos el 60% para avanzar a la siguiente etapa."}
              </p>
            </div>

            <div
              className="w-full rounded-3xl p-5 flex flex-col gap-3"
              style={{ background: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
            >
              <div className="flex items-center justify-between">
                <p style={{ color: "#64748b", fontSize: "14px" }}>Respuestas correctas</p>
                <p style={{ color: finalPassed ? "#10b981" : "#f97316", fontSize: "18px", fontWeight: 800 }}>
                  {finalScore}/{totalQuestions}
                </p>
              </div>
              <div className="h-3 rounded-full" style={{ background: "#f1f5f9" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(finalScore / totalQuestions) * 100}%`,
                    background: finalPassed ? "#10b981" : "#f97316",
                  }}
                />
              </div>
              <p style={{ color: "#94a3b8", fontSize: "12px" }}>
                {finalPassed ? `Mínimo requerido: 60% · Obtuviste: ${Math.round((finalScore / totalQuestions) * 100)}%` : "Mínimo requerido: 60%"}
              </p>
            </div>

            {!finalPassed && (
              <div
                className="w-full rounded-2xl p-4"
                style={{ background: "#fff7ed", border: "1.5px solid #fed7aa" }}
              >
                <p style={{ color: "#92400e", fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>
                  TEMAS A REFORZAR:
                </p>
                <p style={{ color: "#78350f", fontSize: "13px", lineHeight: 1.5 }}>
                  Repasa las actividades de la etapa {stage.id} antes de volver a intentarlo. Recuerda que cada error es una oportunidad de aprender.
                </p>
              </div>
            )}
          </div>

          <div className="px-6 pb-12 flex flex-col gap-3">
            {!finalPassed && (
              <button
                onClick={() => { playBack(); navigate(`/stage/${stage.id}`); }}
                className="w-full py-4 rounded-2xl transition-all active:scale-95"
                style={{ background: "#fff7ed", color: "#f97316", fontSize: "15px", fontWeight: 700, border: "2px solid #fed7aa" }}
              >
                Repasar actividades
              </button>
            )}
            <button
              onClick={() => { playNavigate(); navigate("/home"); }}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{ background: finalPassed ? "#10b981" : "#f97316", color: "white", fontSize: "15px", fontWeight: 700, border: "none" }}
            >
              Volver al inicio <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout noPadding>
      <div className="flex flex-col min-h-screen" style={{ background: "#f8fafc" }}>
        {/* Header */}
        <div className="px-5 pt-12 pb-4" style={{ background: "white", borderBottom: "1px solid #e2e8f0" }}>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => { playBack(); navigate(`/stage/${stage.id}`); }}
              className="rounded-xl flex items-center justify-center"
              style={{ width: "36px", height: "36px", background: "#f1f5f9" }}
            >
              <X size={18} color="#64748b" />
            </button>
            <div className="flex-1">
              <p style={{ color: stage.color, fontSize: "11px", fontWeight: 700 }}>
                QUIZ FINAL · ETAPA {stage.id}
              </p>
              <p style={{ color: "#0f172a", fontSize: "14px", fontWeight: 700 }}>{stage.title}</p>
            </div>
            <div
              className="rounded-xl px-2.5 py-1"
              style={{ background: stage.bgColor }}
            >
              <span style={{ color: stage.color, fontSize: "13px", fontWeight: 700 }}>
                {currentQuestion + 1}/{totalQuestions}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 rounded-full" style={{ background: "#f1f5f9" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: stage.color }}
              animate={{ width: `${((currentQuestion + (confirmed ? 1 : 0)) / totalQuestions) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1 overflow-y-auto px-5 pb-32 pt-5 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`q-${currentQuestion}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              {/* Question */}
              <div
                className="rounded-3xl p-5"
                style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="rounded-lg px-2 py-0.5"
                    style={{ background: stage.bgColor }}
                  >
                    <span style={{ color: stage.color, fontSize: "11px", fontWeight: 700 }}>
                      PREGUNTA {currentQuestion + 1}
                    </span>
                  </div>
                </div>
                <QuestionIllustration question={question.question} stage={stage} />
                <p style={{ color: "#0f172a", fontSize: "16px", fontWeight: 600, lineHeight: 1.5 }}>
                  {question.question}
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2.5">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectAnswer = index === question.correctAnswer;
                  const showResult = confirmed;

                  let borderColor = "#e2e8f0";
                  let bgColor = "white";
                  let textColor = "#1e293b";

                  if (showResult) {
                    if (isCorrectAnswer) {
                      borderColor = "#10b981";
                      bgColor = "#ecfdf5";
                      textColor = "#065f46";
                    } else if (isSelected && !isCorrectAnswer) {
                      borderColor = "#f97316";
                      bgColor = "#fff7ed";
                      textColor = "#9a3412";
                    }
                  } else if (isSelected) {
                    borderColor = stage.color;
                    bgColor = `${stage.color}10`;
                    textColor = stage.color;
                  }

                  return (
                    <motion.button
                      key={index}
                      whileTap={!confirmed ? { scale: 0.98 } : {}}
                      onClick={() => handleSelectAnswer(index)}
                      className="rounded-2xl p-4 flex items-start gap-3 w-full text-left transition-all"
                      style={{
                        background: bgColor,
                        border: `2px solid ${borderColor}`,
                        cursor: confirmed ? "default" : "pointer",
                      }}
                    >
                      <div
                        className="flex-shrink-0 rounded-full flex items-center justify-center"
                        style={{
                          width: "28px",
                          height: "28px",
                          minWidth: "28px",
                          background: showResult
                            ? isCorrectAnswer ? "#10b981" : isSelected ? "#f97316" : "#f1f5f9"
                            : isSelected ? stage.color : "#f1f5f9",
                        }}
                      >
                        {showResult ? (
                          isCorrectAnswer ? (
                            <span style={{ color: "white", fontSize: "14px" }}>✓</span>
                          ) : isSelected ? (
                            <span style={{ color: "white", fontSize: "14px" }}>✗</span>
                          ) : (
                            <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600 }}>
                              {["A", "B", "C", "D"][index]}
                            </span>
                          )
                        ) : isSelected ? (
                          <span style={{ color: "white", fontSize: "14px", fontWeight: 700 }}>✓</span>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600 }}>
                            {["A", "B", "C", "D"][index]}
                          </span>
                        )}
                      </div>
                      <p style={{ color: textColor, fontSize: "14px", lineHeight: 1.5, fontWeight: isSelected || (showResult && isCorrectAnswer) ? 600 : 400 }}>
                        {option}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              {/* Inline feedback after confirming */}
              {confirmed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 flex gap-3"
                  style={{
                    background: isCorrect ? "#ecfdf5" : "#fff7ed",
                    border: `1.5px solid ${isCorrect ? "#a7f3d0" : "#fed7aa"}`,
                  }}
                >
                  {isCorrect ? (
                    <CheckCircle size={18} color="#10b981" className="flex-shrink-0 mt-0.5" />
                  ) : (
                    <Lightbulb size={18} color="#f97316" className="flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p style={{ color: isCorrect ? "#065f46" : "#9a3412", fontSize: "13px", fontWeight: 700, marginBottom: "2px" }}>
                      {isCorrect ? "¡Correcto!" : "No exactamente..."}
                    </p>
                    <p style={{ color: isCorrect ? "#059669" : "#78350f", fontSize: "13px", lineHeight: 1.5 }}>
                      {question.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom button */}
        <div
          className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4"
          style={{
            background: "linear-gradient(to top, #f8fafc 80%, transparent)",
            maxWidth: "430px",
            margin: "0 auto",
          }}
        >
          {!confirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className="w-full py-4 rounded-2xl transition-all active:scale-95"
              style={{
                background: selectedAnswer !== null ? stage.color : "#e2e8f0",
                color: selectedAnswer !== null ? "white" : "#94a3b8",
                fontSize: "16px",
                fontWeight: 700,
                border: "none",
                boxShadow: selectedAnswer !== null ? `0 8px 24px ${stage.color}40` : "none",
                cursor: selectedAnswer !== null ? "pointer" : "not-allowed",
              }}
            >
              Confirmar respuesta
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{
                background: isCorrect ? "#10b981" : "#f97316",
                color: "white",
                fontSize: "16px",
                fontWeight: 700,
                border: "none",
                boxShadow: `0 8px 24px ${isCorrect ? "#10b98140" : "#f9731640"}`,
              }}
            >
              {currentQuestion + 1 < totalQuestions ? "Siguiente pregunta" : "Ver resultados"}
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}