import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import MarkCompleteButton from "@/components/MarkCompleteButton";
import { createClient } from "@/lib/supabase/server";
import type { ModuleWithLessons } from "@/types";

interface PageProps {
  params: Promise<{ modulo: string; leccion: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { modulo, leccion } = await params;
  return {
    title: `${leccion.replace(/-/g, " ")} — ${modulo} · Curso Video con IA`,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { modulo, leccion } = await params;
  const supabase = await createClient();

  // 1. Verificar sesión
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Verificar compra completada
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .maybeSingle();

  if (!purchase) redirect("/#precio");

  // 3. Obtener todos los módulos con lecciones para el sidebar
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

  // 4. Buscar el módulo y lección actuales
  const currentModule = typedModules.find((m) => m.slug === modulo);
  if (!currentModule) notFound();

  const currentLesson = currentModule.lessons.find((l) => l.slug === leccion);
  if (!currentLesson) notFound();

  // 5. Obtener la lección completa (con video_url)
  const { data: lessonFull } = await supabase
    .from("lessons")
    .select("id, video_url, title, duration")
    .eq("id", currentLesson.id)
    .single();

  // 6. Comprobar si el usuario ya completó esta lección
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("completed")
    .eq("user_id", user.id)
    .eq("lesson_id", currentLesson.id)
    .maybeSingle();

  const isCompleted = progress?.completed ?? false;

  // 7. Calcular navegación prev/next
  const allLessons = typedModules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleSlug: m.slug }))
  );
  const currentIdx = allLessons.findIndex(
    (l) => l.slug === leccion && l.moduleSlug === modulo
  );
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── SIDEBAR ── */}
      <aside className="w-72 flex-shrink-0 border-r border-border bg-sidebar overflow-y-auto hidden md:flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <a
            href="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-sans"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" d="M15 19l-7-7 7-7" />
            </svg>
            Mi Curso
          </a>
        </div>

        <nav className="flex-1 py-4">
          {typedModules.map((mod, modIdx) => (
            <div key={mod.slug} className="mb-2">
              <div className="px-5 py-3 flex items-center gap-3">
                <span className="font-serif text-sm text-primary/40 select-none">
                  {String(modIdx + 1).padStart(2, "0")}
                </span>
                <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground font-medium">
                  {mod.title}
                </span>
              </div>
              <ul>
                {mod.lessons.map((lesson, lIdx) => {
                  const isActive = mod.slug === modulo && lesson.slug === leccion;
                  return (
                    <li key={lesson.slug}>
                      <a
                        href={`/curso/${mod.slug}/${lesson.slug}`}
                        className={`flex items-center gap-3 pl-10 pr-5 py-3 text-xs font-sans transition-colors ${
                          isActive
                            ? "text-primary bg-primary/5 border-r-2 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        }`}
                      >
                        <span className="text-muted-foreground/30 w-4 text-right flex-shrink-0">
                          {String(lIdx + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 leading-snug">{lesson.title}</span>
                        <span className="text-muted-foreground/30 flex-shrink-0">{lesson.duration ?? ""}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* ── ÁREA PRINCIPAL ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-sans tracking-wider uppercase">
              {currentModule.title}
            </p>
            <h1 className="font-serif text-lg text-foreground">{currentLesson.title}</h1>
          </div>
          <MarkCompleteButton
            lessonId={currentLesson.id}
            userId={user.id}
            initialCompleted={isCompleted}
          />
        </div>

        {/* Reproductor */}
        <div className="flex-1 bg-black">
          <VideoPlayer
            videoUrl={lessonFull?.video_url ?? ""}
            title={currentLesson.title}
          />
        </div>

        {/* Navegación prev/next */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between">
          {prevLesson ? (
            <a
              href={`/curso/${prevLesson.moduleSlug}/${prevLesson.slug}`}
              className="flex items-center gap-2 text-xs text-muted-foreground font-sans tracking-wider uppercase hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="square" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </a>
          ) : (
            <span />
          )}

          <span className="text-xs text-muted-foreground/30 font-sans">
            {currentLesson.duration ?? "—"}
          </span>

          {nextLesson ? (
            <a
              href={`/curso/${nextLesson.moduleSlug}/${nextLesson.slug}`}
              className="flex items-center gap-2 text-xs text-muted-foreground font-sans tracking-wider uppercase hover:text-foreground transition-colors"
            >
              Siguiente
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="square" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ) : (
            <span />
          )}
        </div>
      </main>
    </div>
  );
}
