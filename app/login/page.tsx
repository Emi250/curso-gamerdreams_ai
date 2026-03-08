"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";
  const callbackError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    callbackError === "auth_callback_failed"
      ? "Error de autenticación. Inténtalo de nuevo."
      : null
  );

  const supabase = createClient();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Email o contraseña incorrectos."
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="relative z-10 w-full max-w-sm space-y-10">
      {/* Logo / título */}
      <div className="text-center space-y-2">
        <a
          href="/"
          className="text-xs tracking-[0.35em] uppercase text-primary font-sans font-medium hover:opacity-80 transition-opacity"
        >
          Video con IA
        </a>
        <h1 className="font-serif text-3xl text-foreground">Acceso</h1>
        <p className="text-muted-foreground text-sm font-sans">
          Entra a tu área de aprendizaje
        </p>
      </div>

      {/* Línea decorativa */}
      <div className="divider-cinema" />

      {/* Error */}
      {error && (
        <div className="border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive font-sans">
          {error}
        </div>
      )}

      {/* Formulario email/password */}
      <form onSubmit={handleEmailLogin} className="space-y-5">
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground/40 px-4 py-3 text-sm font-sans outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 text-sm font-sans font-semibold tracking-widest uppercase transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {/* Divider OAuth */}
      <div className="flex items-center gap-4">
        <div className="flex-1 divider-cinema" />
        <span className="text-xs text-muted-foreground/50 font-sans tracking-wider">
          o continúa con
        </span>
        <div className="flex-1 divider-cinema" />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full border border-border text-muted-foreground py-3 text-sm font-sans tracking-widest uppercase transition-colors hover:border-foreground/30 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
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
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div
        className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.08_0_0)_0%,_oklch(0_0_0)_80%)] pointer-events-none"
        aria-hidden="true"
      />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
