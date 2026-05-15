import React from "react";
import {
  Lightbulb, Maximize2, Users, Banknote, BarChart2, TrendingUp,
  Star, Gem, Flame, Award, Target, Zap, Trophy, Gamepad2,
  FileText, PenLine, BookOpen, Bot, Map, Check, Lock, Unlock,
  Footprints, FlaskConical, Compass, Scroll, Hammer, Crown, Shield,
  type LucideProps,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  lightbulb: Lightbulb,
  maximize: Maximize2,
  users: Users,
  banknote: Banknote,
  "bar-chart": BarChart2,
  "trending-up": TrendingUp,
  star: Star,
  gem: Gem,
  flame: Flame,
  award: Award,
  target: Target,
  zap: Zap,
  trophy: Trophy,
  gamepad: Gamepad2,
  "file-text": FileText,
  "pen-line": PenLine,
  book: BookOpen,
  bot: Bot,
  map: Map,
  check: Check,
  lock: Lock,
  unlock: Unlock,
  footprints: Footprints,
  "flask-conical": FlaskConical,
  compass: Compass,
  scroll: Scroll,
  hammer: Hammer,
  crown: Crown,
  shield: Shield,
};

interface AppIconProps {
  iconKey: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}

export function AppIcon({
  iconKey,
  size = 20,
  color = "currentColor",
  strokeWidth = 1.75,
  fill = "none",
}: AppIconProps) {
  const IconComponent = iconMap[iconKey] ?? Star;
  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} fill={fill} />;
}