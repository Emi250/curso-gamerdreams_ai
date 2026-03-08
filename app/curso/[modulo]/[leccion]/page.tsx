import type { Metadata } from "next";
import VideoPlayer from "@/components/VideoPlayer";

interface PageProps {
  params: Promise<{ modulo: string; leccion: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { modulo, leccion } = await params;
  return {
    title: `${leccion.replace(/-/g, " ")} — ${modulo} · Curso Video con IA`,
  };
}

// Datos de placeholder — se reemplazarán con consulta a Supabase
const SIDEBAR_LESSONS = [
  {
    moduleSlug: "preproduccion",
    moduleTitle: "Preproducción",
    moduleIndex: 1,
    lessons: [
      { slug: "introduccion", title: "Introducción al módulo", duration: "12:30" },
      { slug: "conceptualizacion-ia", title: "Conceptualización con IA", duration: "18:45" },
      { slug: "guion-asistido", title: "Guión asistido por IA", duration: "24:10" },
    ],
  },
  {
    moduleSlug: "automatizacion",
    moduleTitle: "Automatización",
    moduleIndex: 2,
    lessons: [
      { slug: "pipelines-intro", title: "Introducción a pipelines", duration: "15:00" },
      { slug: "herramientas", title: "Herramientas generativas", duration: "32:20" },
    ],
  },
  {
    moduleSlug: "entornos",
    moduleTitle: "Entornos",
    moduleIndex: 3,
    lessons: [
      { slug: "worldbuilding", title: "Worldbuilding con IA", duration: "20:15" },
    ],
  },
  {
    moduleSlug: "narrativa-historica",
    moduleTitle: "Narrativa Histórica",
    moduleIndex: 4,
    lessons: [
      { slug: "direccion-arte", title: "Principios de dirección de arte", duration: "28:00" },
    ],
  },
];

export default async function LessonPage({ params }: PageProps) {
  const { modulo, leccion } = await params;

  // TODO: Verificar sesión y compra con Supabase
  // TODO: Obtener video_url de la base de datos para esta lección

  const currentModule = SIDEBAR_LESSONS.find((m) => m.moduleSlug === modulo);
  const currentLesson = currentModule?.lessons.find((l) => l.slug === leccion);

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── SIDEBAR ── */}
      <aside className="w-72 flex-shrink-0 border-r border-border bg-sidebar overflow-y-auto hidden md:flex flex-col">
        {/* Logo / back */}
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

        {/* Índice de módulos y lecciones */}
        <nav className="flex-1 py-4">
          {SIDEBAR_LESSONS.map((mod) => (
            <div key={mod.moduleSlug} className="mb-2">
              {/* Cabecera del módulo */}
              <div className="px-5 py-3 flex items-center gap-3">
                <span className="font-serif text-sm text-primary/40 select-none">
                  {String(mod.moduleIndex).padStart(2, "0")}
                </span>
                <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground font-medium">
                  {mod.moduleTitle}
                </span>
              </div>

              {/* Lecciones */}
              <ul>
                {mod.lessons.map((lesson, idx) => {
                  const isActive =
                    mod.moduleSlug === modulo && lesson.slug === leccion;
                  return (
                    <li key={lesson.slug}>
                      <a
                        href={`/curso/${mod.moduleSlug}/${lesson.slug}`}
                        className={`flex items-center gap-3 pl-10 pr-5 py-3 text-xs font-sans transition-colors ${
                          isActive
                            ? "text-primary bg-primary/5 border-r-2 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        }`}
                      >
                        <span className="text-muted-foreground/30 w-4 text-right flex-shrink-0">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 leading-snug">{lesson.title}</span>
                        <span className="text-muted-foreground/30 flex-shrink-0">{lesson.duration}</span>
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
              {currentModule?.moduleTitle ?? modulo}
            </p>
            <h1 className="font-serif text-lg text-foreground">
              {currentLesson?.title ?? leccion.replace(/-/g, " ")}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-xs text-muted-foreground font-sans tracking-wider uppercase border border-border px-4 py-2 hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              Marcar completada
            </button>
          </div>
        </div>

        {/* Reproductor */}
        <div className="flex-1 bg-black">
          <VideoPlayer
            videoUrl=""
            title={currentLesson?.title ?? leccion}
          />
        </div>

        {/* Navegación entre lecciones */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-2 text-xs text-muted-foreground font-sans tracking-wider uppercase hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>
          <span className="text-xs text-muted-foreground/30 font-sans">
            {currentLesson?.duration ?? "—"}
          </span>
          <button
            type="button"
            className="flex items-center gap-2 text-xs text-muted-foreground font-sans tracking-wider uppercase hover:text-foreground transition-colors"
          >
            Siguiente
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
