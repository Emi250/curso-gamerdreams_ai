// ─── Supabase DB types ──────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  order: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  description: string | null;
  video_url: string;
  duration: string | null;
  order: number;
  is_preview: boolean;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  stripe_session_id: string | null;
  stripe_customer_id: string | null;
  stripe_payment_id: string | null;
  amount_usd: number | null;
  status: "pending" | "completed" | "refunded";
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  watched_at: string | null;
  created_at: string;
}

// ─── UI types ───────────────────────────────────────────────────

export type AccentColor = "gold" | "moss" | "rust";

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}
