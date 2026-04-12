import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { achievementsList } from "../data/gameData";

export interface StageStatus {
  status: "locked" | "current" | "completed";
  activitiesCompleted: string[];
  quizPassed: boolean;
  quizScore: number;
}

export interface AppState {
  userName: string;
  xp: number;
  streak: number;
  consecutiveCorrect: number;
  stageStatuses: Record<number, StageStatus>;
  earnedAchievements: string[];
  totalActivitiesCompleted: number;
  hasSeenPixelTutorial: boolean;
  stagesIntroSeen: number[];
}

interface AppContextValue {
  state: AppState;
  completeActivity: (activityId: string, stageId: number, correct: boolean, xpGain: number) => void;
  passQuiz: (stageId: number, score: number, totalQuestions: number) => void;
  earnAchievement: (achievementId: string) => void;
  addXP: (amount: number) => void;
  setUserName: (name: string) => void;
  getTotalProgress: () => number;
  getCompletedStages: () => number;
  markPixelTutorialAsSeen: () => void;
  markStageIntroSeen: (stageId: number) => void;
}

const defaultStageStatuses: Record<number, StageStatus> = {
  1: { status: "current", activitiesCompleted: [], quizPassed: false, quizScore: 0 },
  2: { status: "locked", activitiesCompleted: [], quizPassed: false, quizScore: 0 },
  3: { status: "locked", activitiesCompleted: [], quizPassed: false, quizScore: 0 },
  4: { status: "locked", activitiesCompleted: [], quizPassed: false, quizScore: 0 },
  5: { status: "locked", activitiesCompleted: [], quizPassed: false, quizScore: 0 },
  6: { status: "locked", activitiesCompleted: [], quizPassed: false, quizScore: 0 },
};

const defaultState: AppState = {
  userName: "Estudiante",
  xp: 0,
  streak: 0,
  consecutiveCorrect: 0,
  stageStatuses: defaultStageStatuses,
  earnedAchievements: [],
  totalActivitiesCompleted: 0,
  hasSeenPixelTutorial: false,
  stagesIntroSeen: [],
};

function loadState(): AppState {
  try {
    const saved = localStorage.getItem("vgp-app-state");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return defaultState;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem("vgp-app-state", JSON.stringify(state));
  } catch {
    // ignore
  }
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addXP = useCallback((amount: number) => {
    setState(prev => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const earnAchievement = useCallback((achievementId: string) => {
    setState(prev => {
      if (prev.earnedAchievements.includes(achievementId)) return prev;
      return {
        ...prev,
        earnedAchievements: [...prev.earnedAchievements, achievementId],
      };
    });
  }, []);

  const completeActivity = useCallback((activityId: string, stageId: number, correct: boolean, xpGain: number) => {
    setState(prev => {
      const stageStatus = { ...prev.stageStatuses[stageId] };
      const newConsecutive = correct ? prev.consecutiveCorrect + 1 : 0;
      const newTotal = stageStatus.activitiesCompleted.includes(activityId)
        ? prev.totalActivitiesCompleted
        : prev.totalActivitiesCompleted + 1;

      if (!stageStatus.activitiesCompleted.includes(activityId)) {
        stageStatus.activitiesCompleted = [...stageStatus.activitiesCompleted, activityId];
      }

      const newAchievements = [...prev.earnedAchievements];

      // First step achievement
      if (newTotal === 1 && !newAchievements.includes("first-step")) {
        newAchievements.push("first-step");
      }
      // Streak achievement
      if (newConsecutive >= 3 && !newAchievements.includes("streak-3")) {
        newAchievements.push("streak-3");
      }

      return {
        ...prev,
        xp: correct ? prev.xp + xpGain : prev.xp,
        consecutiveCorrect: newConsecutive,
        totalActivitiesCompleted: newTotal,
        earnedAchievements: newAchievements,
        stageStatuses: {
          ...prev.stageStatuses,
          [stageId]: stageStatus,
        },
      };
    });
  }, []);

  const passQuiz = useCallback((stageId: number, score: number, totalQuestions: number) => {
    setState(prev => {
      const passed = score / totalQuestions >= 0.6;
      const stageStatus = {
        ...prev.stageStatuses[stageId],
        quizPassed: passed,
        quizScore: score,
      };

      const newStatuses = { ...prev.stageStatuses };
      newStatuses[stageId] = stageStatus;

      const newAchievements = [...prev.earnedAchievements];

      if (passed) {
        // Mark current as completed
        newStatuses[stageId] = { ...stageStatus, status: "completed" };

        // Unlock next stage
        const nextStageId = stageId + 1;
        if (nextStageId <= 6 && newStatuses[nextStageId].status === "locked") {
          newStatuses[nextStageId] = { ...newStatuses[nextStageId], status: "current" };
        }

        // XP for passing quiz
        const quizXP = 100 + score * 20;

        // Achievements for passing each stage
        if (stageId === 1 && !newAchievements.includes("concept-master")) {
          newAchievements.push("concept-master");
        }
        if (stageId === 2 && !newAchievements.includes("scope-pro")) {
          newAchievements.push("scope-pro");
        }
        if (stageId === 3 && !newAchievements.includes("team-builder")) {
          newAchievements.push("team-builder");
        }
        if (stageId === 4 && !newAchievements.includes("cost-master")) {
          newAchievements.push("cost-master");
        }
        if (stageId === 5 && !newAchievements.includes("budget-pro")) {
          newAchievements.push("budget-pro");
        }
        if (score === totalQuestions && !newAchievements.includes("perfect-quiz")) {
          newAchievements.push("perfect-quiz");
        }

        // Check if all stages completed
        const allCompleted = Object.values(newStatuses).every(s => s.status === "completed" || (stageId === 6 && s.quizPassed));
        if (allCompleted && !newAchievements.includes("pitcher")) {
          newAchievements.push("pitcher");
        }

        return {
          ...prev,
          xp: prev.xp + quizXP,
          stageStatuses: newStatuses,
          earnedAchievements: newAchievements,
        };
      }

      return {
        ...prev,
        stageStatuses: newStatuses,
        earnedAchievements: newAchievements,
      };
    });
  }, []);

  const setUserName = useCallback((name: string) => {
    setState(prev => ({ ...prev, userName: name }));
  }, []);

  const getTotalProgress = useCallback(() => {
    const totalStages = 6;
    const completed = Object.values(state.stageStatuses).filter(s => s.status === "completed").length;
    return Math.round((completed / totalStages) * 100);
  }, [state.stageStatuses]);

  const getCompletedStages = useCallback(() => {
    return Object.values(state.stageStatuses).filter(s => s.status === "completed").length;
  }, [state.stageStatuses]);

  const markPixelTutorialAsSeen = useCallback(() => {
    setState(prev => ({ ...prev, hasSeenPixelTutorial: true }));
  }, []);

  const markStageIntroSeen = useCallback((stageId: number) => {
    setState(prev => ({
      ...prev,
      stagesIntroSeen: prev.stagesIntroSeen.includes(stageId)
        ? prev.stagesIntroSeen
        : [...prev.stagesIntroSeen, stageId],
    }));
  }, []);

  return (
    <AppContext.Provider value={{
      state,
      completeActivity,
      passQuiz,
      earnAchievement,
      addXP,
      setUserName,
      getTotalProgress,
      getCompletedStages,
      markPixelTutorialAsSeen,
      markStageIntroSeen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}