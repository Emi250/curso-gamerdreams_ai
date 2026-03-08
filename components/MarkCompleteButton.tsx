"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface MarkCompleteButtonProps {
  lessonId: string;
  userId: string;
  initialCompleted: boolean;
}

export default function MarkCompleteButton({
  lessonId,
  userId,
  initialCompleted,
}: MarkCompleteButtonProps) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  async function toggle() {
    const supabase = createClient();
    const newValue = !completed;

    const { error } = await supabase
      .from("lesson_progress")
      .upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          completed: newValue,
          watched_at: newValue ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,lesson_id" }
      );

    if (!error) {
      setCompleted(newValue);
      startTransition(() => router.refresh());
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={`text-xs font-sans tracking-wider uppercase border px-4 py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        completed
          ? "border-primary text-primary bg-primary/5 hover:bg-primary/10"
          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
      }`}
    >
      {completed ? "✓ Completada" : "Marcar completada"}
    </button>
  );
}
