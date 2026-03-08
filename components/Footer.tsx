import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-serif text-sm text-muted-foreground">
          Video<span className="text-primary">·</span>IA
        </p>

        <nav className="flex items-center gap-6">
          {[
            { href: "/#curricula", label: "Currícula" },
            { href: "/#precio", label: "Precio" },
            { href: "/login", label: "Acceder" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-widest uppercase text-muted-foreground/50 hover:text-muted-foreground transition-colors font-sans"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-muted-foreground/30 font-sans">
          © {new Date().getFullYear()} · Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
