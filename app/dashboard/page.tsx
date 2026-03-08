import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import type { ModuleWithLessons, LessonProgress } from "@/types";

export const metadata: Metadata = {
  title: "Mi Curso — Video con IA",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Verificar sesión (el middleware ya redirige, esto es doble seguro)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Verificar compra completada
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .maybeSingle();

  if (!purchase) redirect("/#precio");

  // 3. Obtener módulos con sus lecciones
  const { data: modules } = await supabase
    .from("modules")
    .select(`
      id, slug, title, order,
      lessons (
        id, slug, title, duration, order
      )
    `)
    .order("order", { ascending: true })
    .order("order", { referencedTable: "lessons", ascending: true });

  const typedModules = (modules ?? []) as ModuleWithLessons[];

  // 4. Obtener progreso del usuario
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed")
    .eq("user_id", user.id);

  const completedIds = new Set(
    (progress ?? [])
      .filter((p: Pick<LessonProgress, "lesson_id" | "completed">) => p.completed)
      .map((p: Pick<LessonProgress, "lesson_id" | "completed">) => p.lesson_id)
  );

  const totalLessons = typedModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = completedIds.size;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20 space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-xs tracking-[0.3em] uppercase text-primary font-sans font-medium">
            Bienvenido de vuelta
          </p>
          <h1 className="font-serif text-4xl text-foreground">Tu Aprendizaje</h1>
        </div>

        {/* Progreso global */}
        <div className="border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-sans">Progreso total del curso</p>
            <p className="text-sm font-sans text-primary font-semibold">{progressPct}%</p>
          </div>
          <div className="h-px bg-border">
            <div
              className="h-px bg-primary transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground font-sans">
            {completedCount} de {totalLessons} lecciones completadas
          </p>
        </div>

        {/* Módulos */}
        <div className="space-y-6">
          {typedModules.map((mod, idx) => (
            <div key={mod.id} className="border border-border bg-card overflow-hidden">
              {/* Header del módulo */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-serif text-2xl text-primary/40 select-none">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-serif text-xl text-foreground">{mod.title}</h2>
                </div>
                <span className="text-xs text-muted-foreground font-sans tracking-wider">
                  {mod.lessons.length} lecciones
                </span>
              </div>

              {/* Lecciones */}
              <ul>
                {mod.lessons.map((lesson, lIdx) => {
                  const isCompleted = completedIds.has(lesson.id);
                  return (
                    <li key={lesson.id}>
                      <a
                        href={`/curso/${mod.slug}/${lesson.slug}`}
                        className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-secondary/50 group ${
                          lIdx < mod.lessons.length - 1 ? "border-b border-border" : ""
                        }`}
                      >
                        {/* Indicador completado */}
                        <div
                          className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center ${
                            isCompleted ? "border-primary bg-primary/20" : "border-border"
                          }`}
                        >
                          {isCompleted && (
                            <svg
                              className="w-2.5 h-2.5 text-primary"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        {/* Número */}
                        <span className="text-xs text-muted-foreground/50 font-sans w-6">
                          {String(lIdx + 1).padStart(2, "0")}
                        </span>

                        {/* Título */}
                        <span
                          className={`flex-1 text-sm font-sans transition-colors group-hover:text-foreground ${
                            isCompleted ? "text-muted-foreground" : "text-foreground/80"
                          }`}
                        >
                          {lesson.title}
                        </span>

                        {/* Duración */}
                        <span className="text-xs text-muted-foreground/50 font-sans">
                          {lesson.duration ?? "—"}
                        </span>

                        {/* Flecha */}
                        <svg
                          className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path strokeLinecap="square" d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
