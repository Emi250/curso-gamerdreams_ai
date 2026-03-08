# CLAUDE.md — Plataforma de Curso "Creación de Video con IA y Dirección de Arte"

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Estilos | Tailwind CSS v4 + Shadcn UI |
| Base de datos | Supabase (Postgres + Auth) |
| Pagos | Stripe Checkout |
| Video | Embeds genéricos (preparado para Bunny.net / Vimeo) |

## Sistema de Diseño — Estética Cinematográfica

### Modo
**Dark Mode absoluto y permanente.** La clase `dark` se aplica siempre en el `<html>`. No hay light mode.

### Paleta de Colores

```
Fondo primario:     #000000  (negro puro)
Fondo secundario:   #111111  (gris muy oscuro — cards, panels)
Fondo elevado:      #1a1a1a  (modales, sidebars)
Borde sutil:        #222222  (separadores)

Acento principal:   Oro envejecido  → oklch(0.65 0.08 75)   (#a8916a aprox)
Acento secundario:  Verde musgo     → oklch(0.35 0.06 140)  (#3a5c34 aprox)
Acento terciario:   Óxido sutil     → oklch(0.45 0.09 40)   (#7a3f28 aprox)

Texto primario:     #e8e0d0  (blanco cálido, cinematográfico)
Texto secundario:   #8a8a8a  (gris medio)
Texto deshabilitado:#444444  (gris oscuro)
```

### Tipografía

- **Títulos principales** → `Playfair Display` (serif cinematográfico, elegante)
- **Interfaz y cuerpo** → `Inter` (sans-serif geométrico, limpio)
- Variables CSS: `--font-serif`, `--font-sans`
- Usar `font-serif` para `<h1>`, `<h2>` de secciones hero; `font-sans` para el resto

### Principios UI

- Bordes sutiles o **esquinas afiladas** (`--radius: 0.125rem`). Evitar bordes muy redondeados.
- **Mucho espacio negativo.** Padding generoso, secciones amplias.
- Inspiración visual: menús inmersivos de videojuegos AAA (God of War, The Last of Us, Cyberpunk 2077).
- Animaciones: sutiles, no intrusivas. Usar `transition-colors`, `transition-opacity`.
- Separadores: `border-[#222222]` o líneas de 1px. Nunca usar grises claros.

## Estructura de Rutas

```
/                           → Landing page pública
/login                      → Autenticación (Supabase Auth)
/dashboard                  → Panel privado del usuario autenticado
/curso/[modulo]/[leccion]   → Reproductor de video con sidebar de índice
```

### Rutas de API

```
/api/checkout/route.ts      → Inicia sesión de Stripe Checkout
/api/webhook/route.ts       → Webhook de Stripe (marcar compra completada)
```

## Base de Datos (Supabase)

Ver `/supabase/schema.sql` para el esquema completo.

Tablas principales:
- `profiles` — datos del usuario (vinculado a `auth.users`)
- `purchases` — registro de compras verificadas por Stripe
- `modules` — módulos del curso (título, descripción, orden)
- `lessons` — lecciones dentro de cada módulo (título, video_url, duración, orden)

### Módulos del Curso

1. **Preproducción** — Conceptualización, guiones y storyboards con IA
2. **Automatización** — Pipelines de generación de video con IA
3. **Entornos** — Worldbuilding, diseño de escenarios y fotografía generada
4. **Narrativa Histórica** — Dirección de arte para reconstrucción histórica

## Reglas de Código

- **TypeScript estricto.** Siempre tipar props, estados y respuestas de API.
- **Server Components por defecto.** Usar `'use client'` solo donde sea necesario (interactividad, hooks).
- **Importaciones absolutas** con alias `@/*` (configurado en `tsconfig.json`).
- **No inventar rutas de video.** Usar `video_url` de la base de datos o placeholder `""`.
- **Autenticación:** Verificar sesión de Supabase en Server Components con `createServerClient`.
- **Acceso al curso:** Solo si existe una fila en `purchases` con `user_id` y `status = 'completed'`.

## Variables de Entorno Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Convenciones de Archivo

- Componentes: `PascalCase.tsx` en `/components/`
- Páginas: `page.tsx` en la carpeta de ruta correspondiente
- Utilidades: `camelCase.ts` en `/lib/`
- Tipos compartidos: `/types/index.ts`
- SQL: `/supabase/schema.sql`
