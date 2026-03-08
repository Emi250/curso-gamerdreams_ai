interface Module {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  lessons: number;
  accent: "gold" | "moss" | "rust";
}

interface CourseCardProps {
  module: Module;
}

const ACCENT_STYLES = {
  gold: {
    border: "border-primary/20 hover:border-primary/50",
    dot: "bg-primary",
    number: "text-primary/30",
  },
  moss: {
    border: "border-accent/20 hover:border-accent/50",
    dot: "bg-accent",
    number: "text-accent/30",
  },
  rust: {
    border: "border-[oklch(0.45_0.09_40)]/20 hover:border-[oklch(0.45_0.09_40)]/50",
    dot: "bg-[oklch(0.45_0.09_40)]",
    number: "text-[oklch(0.45_0.09_40)]/30",
  },
} as const;

export default function CourseCard({ module }: CourseCardProps) {
  const styles = ACCENT_STYLES[module.accent];

  return (
    <div
      className={`border ${styles.border} bg-card p-8 space-y-5 transition-colors group`}
    >
      {/* Número del módulo */}
      <div className="flex items-start justify-between">
        <span className={`font-serif text-5xl font-bold select-none ${styles.number}`}>
          {String(module.id).padStart(2, "0")}
        </span>
        <span className="text-xs text-muted-foreground font-sans tracking-wider uppercase mt-1">
          {module.lessons} lecciones
        </span>
      </div>

      {/* Contenido */}
      <div className="space-y-1">
        <p className="text-xs tracking-widest uppercase font-sans text-muted-foreground font-medium">
          {module.subtitle}
        </p>
        <h3 className="font-serif text-2xl text-foreground">{module.title}</h3>
      </div>

      {/* Separador */}
      <div className={`h-px w-8 ${styles.dot} opacity-50`} />

      {/* Descripción */}
      <p className="text-sm text-muted-foreground leading-relaxed font-sans">
        {module.description}
      </p>

      {/* Indicador de acceso */}
      <div className="flex items-center gap-2 pt-2">
        <div className={`w-1.5 h-1.5 ${styles.dot} opacity-70`} />
        <span className="text-xs text-muted-foreground/50 font-sans tracking-wider">
          Incluido en el curso
        </span>
      </div>
    </div>
  );
}
