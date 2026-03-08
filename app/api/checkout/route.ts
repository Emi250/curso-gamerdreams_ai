import { NextResponse } from "next/server";
import Stripe from "stripe";

// Inicializar cliente Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const COURSE_PRICE_USD_CENTS = 19700; // $197.00
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, email } = body as { userId?: string; email?: string };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: COURSE_PRICE_USD_CENTS,
            product_data: {
              name: "Creación de Video con IA — Acceso Completo",
              description:
                "Acceso vitalicio a los 4 módulos: Preproducción, Automatización, Entornos y Narrativa Histórica.",
              images: [`${BASE_URL}/og-course.jpg`],
            },
          },
        },
      ],
      // Pasamos el userId de Supabase en los metadatos para identificar al comprador
      // en el webhook de Stripe.
      metadata: {
        supabase_user_id: userId ?? "",
        email: email ?? "",
      },
      customer_email: email,
      success_url: `${BASE_URL}/dashboard?payment=success`,
      cancel_url: `${BASE_URL}/#precio?payment=cancelled`,
      // Habilitar facturación (recomendado para cumplimiento fiscal)
      invoice_creation: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Stripe Checkout] Error:", error);
    return NextResponse.json(
      { error: "No se pudo crear la sesión de pago." },
      { status: 500 }
    );
  }
}

// GET: redirigir al checkout (enlace directo desde el botón de la landing)
export async function GET() {
  return NextResponse.json(
    { error: "Usa POST para iniciar el checkout." },
    { status: 405 }
  );
}
