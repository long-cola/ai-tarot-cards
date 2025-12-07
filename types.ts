export enum AppPhase {
  INPUT = 'INPUT',
  SHUFFLING = 'SHUFFLING',
  DRAWING = 'DRAWING',
  REVEAL = 'REVEAL',
  ANALYSIS = 'ANALYSIS',
}

export type Language = 'zh' | 'en';

export interface TarotCardData {
  id: number;
  name: string; // English name
  nameCn: string; // Chinese name
  meaningUpright: string;
  meaningReversed: string;
  imageUrl: string;
}

export interface DrawnCard extends TarotCardData {
  isReversed: boolean;
  position: number; // 0: Past, 1: Present, 2: Future
}

export type Plan = 'guest' | 'free' | 'member';

export interface SessionUser {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  membership_expires_at?: string | null;
}

export enum CardSpreadPosition {
  PAST = 0,
  PRESENT = 1,
  FUTURE = 2,
}

export const SPREAD_LABELS = {
  [CardSpreadPosition.PAST]: "过去 / The Past",
  [CardSpreadPosition.PRESENT]: "现在 / The Present",
  [CardSpreadPosition.FUTURE]: "未来 / The Future",
};

export interface MembershipCycle {
  id: string;
  user_id: string;
  plan: Exclude<Plan, "guest">;
  starts_at: string;
  ends_at: string;
  topic_quota: number;
  event_quota_per_topic: number;
  source?: string | null;
}

export interface Topic {
  id: string;
  user_id: string;
  cycle_id: string | null;
  title: string;
  language: Language;
  baseline_cards: DrawnCard[] | null;
  baseline_reading: string | null;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
}

export interface TopicEvent {
  id: string;
  topic_id: string;
  cycle_id: string | null;
  user_id: string;
  name: string;
  cards: DrawnCard[] | null;
  reading: string | null;
  created_at: string;
}

export interface PlanQuota {
  plan: Plan;
  topic_quota_total: number;
  topic_quota_remaining: number;
  event_quota_per_topic: number;
  expires_at?: string | null;
  downgrade_limited_topic_id?: string | null;
  cycle?: MembershipCycle;
}

export interface TopicWithUsage extends Topic {
  event_count?: number;
  event_remaining?: number | null;
}

export interface AdminUser {
  id: string;
  email: string | null;
  name: string | null;
  created_at: string | null;
  membership_expires_at: string | null;
  plan: Plan;
  topic_count: number;
  event_count: number;
}
