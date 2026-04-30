import { createBrowserRouter } from "react-router";
import { SplashScreen } from "./screens/SplashScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { StageDetailScreen } from "./screens/StageDetailScreen";
import { StageIntroScreen } from "./screens/StageIntroScreen";
import { ActivityScreen } from "./screens/ActivityScreen";
import { FeedbackScreen } from "./screens/FeedbackScreen";
import { QuizScreen } from "./screens/QuizScreen";
import { StageUnlockScreen } from "./screens/StageUnlockScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { StagesListScreen } from "./screens/StagesListScreen";
import PixelFlowDemo from "./screens/PixelFlowDemo";

export const router = createBrowserRouter([
  { path: "/", Component: SplashScreen },
  { path: "/onboarding", Component: OnboardingScreen },
  { path: "/home", Component: HomeScreen },
  { path: "/stages", Component: StagesListScreen },
  { path: "/stage/:id", Component: StageDetailScreen },
  { path: "/stage/:id/intro", Component: StageIntroScreen },
  { path: "/activity/:stageId/:activityId", Component: ActivityScreen },
  { path: "/feedback", Component: FeedbackScreen },
  { path: "/quiz/:stageId", Component: QuizScreen },
  { path: "/unlock/:stageId", Component: StageUnlockScreen },
  { path: "/profile", Component: ProfileScreen },
  { path: "/results", Component: ResultsScreen },
  { path: "/pixel-demo", Component: PixelFlowDemo },
], { basename: "/Hyperlabgamecost" });