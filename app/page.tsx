import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";

const MODULES = [
  {
    id: 1,
    title: "Preproducción",
    subtitle: "Conceptualización e IA",
    description:
      "Aprende a conceptualizar proyectos audiovisuales, escribir guiones y crear storyboards asistidos por inteligencia artificial. Transforma ideas en planes de rodaje sólidos.",
    lessons: 8,
    accent: "gold" as const,
  },
  {
    id: 2,
    title: "Automatización",
    subtitle: "Pipelines de Generación",
    description:
      "Construye flujos de trabajo automatizados para generar y editar video con IA. Domina las herramientas más avanzadas del ecosistema generativo actual.",
    lessons: 10,
    accent: "moss" as const,
  },
  {
    id: 3,
    title: "Entornos",
    subtitle: "Worldbuilding Visual",
    description:
      "Diseña escenarios, mundos y entornos visuales únicos. Fotógrafía generada, ambientación y dirección de arte aplicada a entornos post-apocalípticos e históricos.",
    lessons: 9,
    accent: "rust" as const,
  },
  {
    id: 4,
    title: "Narrativa Histórica",
    subtitle: "Dirección de Arte",
    description:
      "Reconstruye períodos históricos con precisión visual y narrativa. Técnicas de dirección de arte para crear contenido que evoque épocas con autenticidad cinematográfica.",
    lessons: 7,
    accent: "gold" as const,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
        {/* Viñeta cinematográfica */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.12_0_0)_0%,_oklch(0_0_0)_70%)]"
          aria-hidden="true"
        />
        <div className="absolute top-0 left-0 right-0 h-px divider-cinema" aria-hidden="true" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <p className="text-xs tracking-[0.3em] uppercase text-primary font-sans font-medium">
            Curso Premium · Edición Limitada
          </p>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight">
            <span className="text-gold-gradient">Creación de Video</span>
            <br />
            <span className="text-foreground">con IA</span>
          </h1>

          <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Domina la dirección de arte cinematográfica y los flujos de trabajo con
            inteligencia artificial. Desde la preproducción hasta la narrativa histórica.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#precio"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-sm font-sans font-semibold tracking-widest uppercase transition-opacity hover:opacity-80"
            >
              Acceder al Curso
            </a>
            <a
              href="#curricula"
              className="inline-flex items-center gap-2 border border-border text-muted-foreground px-8 py-3 text-sm font-sans tracking-widest uppercase transition-colors hover:text-foreground hover:border-foreground/30"
            >
              Ver Contenido
            </a>
          </div>
        </div>

        {/* Trailer placeholder */}
        <div className="relative z-10 mt-20 w-full max-w-3xl mx-auto">
          <div className="aspect-video bg-card border border-border flex items-center justify-center group cursor-pointer hover:border-primary/40 transition-colors">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 border border-primary/60 flex items-center justify-center mx-auto group-hover:border-primary transition-colors">
                <svg className="w-6 h-6 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-xs text-muted-foreground tracking-widest uppercase font-sans">
                Ver Tráiler
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground/50 mt-3 tracking-wider font-sans">
            Tráiler · Próximamente
          </p>
        </div>
      </section>

      {/* ── PROPUESTA DE VALOR ── */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { label: "4 Módulos", desc: "Preproducción, Automatización, Entornos y Narrativa Histórica." },
              { label: "34 Lecciones", desc: "Contenido práctico y directo. Sin relleno. Solo lo que necesitas." },
              { label: "Acceso Vitalicio", desc: "Paga una vez. Accede para siempre. Incluye actualizaciones futuras." },
            ].map((item) => (
              <div key={item.label} className="space-y-3">
                <p className="font-serif text-3xl text-primary">{item.label}</p>
                <p className="text-muted-foreground text-sm leading-relaxed font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRÍCULA ── */}
      <section id="curricula" className="py-32 px-6 border-t border-border bg-card/30">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.3em] uppercase text-primary font-sans font-medium">
              Contenido del Curso
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">Currícula</h2>
            <p className="text-muted-foreground max-w-xl font-sans">
              Cuatro módulos diseñados para llevarte de cero a profesional en la creación
              de video con IA y dirección de arte cinematográfica.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {MODULES.map((mod) => (
              <CourseCard key={mod.id} module={mod} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIO ── */}
      <section id="precio" className="py-32 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.3em] uppercase text-primary font-sans font-medium">
              Inversión
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">Precio</h2>
          </div>

          <div className="border border-border bg-card p-10 space-y-8 glow-gold">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-sans tracking-wider uppercase">
                Acceso Completo · Pago Único
              </p>
              <p className="font-serif text-6xl text-foreground">
                $197 <span className="text-2xl text-muted-foreground">USD</span>
              </p>
              <p className="text-muted-foreground text-sm font-sans">
                Acceso vitalicio a todos los módulos y actualizaciones
              </p>
            </div>

            <ul className="text-left space-y-3">
              {[
                "4 módulos completos (34 lecciones)",
                "Videos en alta resolución",
                "Recursos y archivos de proyecto",
                "Acceso a comunidad privada",
                "Actualizaciones futuras incluidas",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground font-sans">
                  <span className="w-1 h-1 bg-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href="/api/checkout"
              className="block w-full bg-primary text-primary-foreground text-center py-4 text-sm font-sans font-semibold tracking-widest uppercase transition-opacity hover:opacity-80"
            >
              Comprar Ahora
            </a>

            <p className="text-xs text-muted-foreground/50 font-sans">
              Pago seguro con Stripe · Garantía de 30 días
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
