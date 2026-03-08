import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso — Curso Video con IA",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      {/* Viñeta */}
      <div
        className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.08_0_0)_0%,_oklch(0_0_0)_80%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-sm space-y-10">
        {/* Logo / título */}
        <div className="text-center space-y-2">
          <p className="text-xs tracking-[0.35em] uppercase text-primary font-sans font-medium">
            Video con IA
          </p>
          <h1 className="font-serif text-3xl text-foreground">Acceso</h1>
          <p className="text-muted-foreground text-sm font-sans">
            Entra a tu área de aprendizaje
          </p>
        </div>

        {/* Línea decorativa */}
        <div className="divider-cinema" />

        {/* Formulario */}
        <form className="space-y-5" action="#" method="POST">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs tracking-widest uppercase text-muted-foreground font-sans"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@correo.com"
              className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground/40 px-4 py-3 text-sm font-sans outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-xs tracking-widest uppercase text-muted-foreground font-sans"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground/40 px-4 py-3 text-sm font-sans outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 text-sm font-sans font-semibold tracking-widest uppercase transition-opacity hover:opacity-80 mt-2"
          >
            Entrar
          </button>
        </form>

        {/* Divider OAuth */}
        <div className="flex items-center gap-4">
          <div className="flex-1 divider-cinema" />
          <span className="text-xs text-muted-foreground/50 font-sans tracking-wider">o continúa con</span>
          <div className="flex-1 divider-cinema" />
        </div>

        {/* OAuth placeholder */}
        <button
          type="button"
          className="w-full border border-border text-muted-foreground py-3 text-sm font-sans tracking-widest uppercase transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          Google
        </button>

        <p className="text-center text-xs text-muted-foreground/50 font-sans">
          ¿No tienes cuenta?{" "}
          <a href="/#precio" className="text-primary hover:underline">
            Adquiere el curso
          </a>
        </p>
      </div>
    </div>
  );
}
