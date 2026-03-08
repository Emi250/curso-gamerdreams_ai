import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Mi Curso — Video con IA",
};

// Datos estáticos de placeholder — se reemplazarán con datos de Supabase
const MODULES_PLACEHOLDER = [
  {
    id: 1,
    slug: "preproduccion",
    title: "Preproducción",
    lessons: [
      { id: 1, slug: "introduccion", title: "Introducción al módulo", duration: "12:30", completed: true },
      { id: 2, slug: "conceptualizacion-ia", title: "Conceptualización con IA", duration: "18:45", completed: true },
      { id: 3, slug: "guion-asistido", title: "Guión asistido por IA", duration: "24:10", completed: false },
    ],
  },
  {
    id: 2,
    slug: "automatizacion",
    title: "Automatización",
    lessons: [
      { id: 1, slug: "pipelines-intro", title: "Introducción a pipelines", duration: "15:00", completed: false },
      { id: 2, slug: "herramientas", title: "Herramientas generativas", duration: "32:20", completed: false },
    ],
  },
  {
    id: 3,
    slug: "entornos",
    title: "Entornos",
    lessons: [
      { id: 1, slug: "worldbuilding", title: "Worldbuilding con IA", duration: "20:15", completed: false },
    ],
  },
  {
    id: 4,
    slug: "narrativa-historica",
    title: "Narrativa Histórica",
    lessons: [
      { id: 1, slug: "direccion-arte", title: "Principios de dirección de arte", duration: "28:00", completed: false },
    ],
  },
];

export default function DashboardPage() {
  // TODO: Verificar sesión de Supabase y compra en server component
  // const supabase = createServerClient(...)
  // const { data: { session } } = await supabase.auth.getSession()
  // if (!session) redirect('/login')
  // const { data: purchase } = await supabase.from('purchases').select().eq('user_id', session.user.id).single()
  // if (!purchase) redirect('/#precio')

  const totalLessons = MODULES_PLACEHOLDER.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = MODULES_PLACEHOLDER.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  );
  const progressPct = Math.round((completedLessons / totalLessons) * 100);

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
            {completedLessons} de {totalLessons} lecciones completadas
          </p>
        </div>

        {/* Módulos */}
        <div className="space-y-6">
          {MODULES_PLACEHOLDER.map((mod, idx) => (
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
                {mod.lessons.map((lesson, lIdx) => (
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
                          lesson.completed ? "border-primary bg-primary/20" : "border-border"
                        }`}
                      >
                        {lesson.completed && (
                          <svg className="w-2.5 h-2.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
                          lesson.completed ? "text-muted-foreground" : "text-foreground/80"
                        }`}
                      >
                        {lesson.title}
                      </span>

                      {/* Duración */}
                      <span className="text-xs text-muted-foreground/50 font-sans">
                        {lesson.duration}
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
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
