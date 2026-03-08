import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-base text-foreground tracking-wide hover:text-primary transition-colors"
        >
          Video<span className="text-primary">·</span>IA
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: "/#curricula", label: "Currícula" },
            { href: "/#precio", label: "Precio" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-sans"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA — dinámico según sesión */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-sans"
              >
                Mi Curso
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-sans"
              >
                Acceder
              </Link>
              <Link
                href="/#precio"
                className="bg-primary text-primary-foreground text-xs tracking-widest uppercase px-5 py-2 hover:opacity-80 transition-opacity font-sans font-semibold"
              >
                Comprar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
