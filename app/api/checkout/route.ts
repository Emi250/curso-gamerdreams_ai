import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const COURSE_PRICE_USD_CENTS = 19700; // $197.00
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST() {
  try {
    // 1. Verificar sesión activa de Supabase
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión antes de comprar." },
        { status: 401 }
      );
    }

    // 2. Verificar que no tenga ya una compra completada
    const { data: existing } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Ya tienes acceso al curso.", redirect: "/dashboard" },
        { status: 409 }
      );
    }

    // 3. Crear sesión de Stripe Checkout
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
            },
          },
        },
      ],
      metadata: {
        supabase_user_id: user.id,
        email: user.email ?? "",
      },
      customer_email: user.email,
      success_url: `${BASE_URL}/dashboard?payment=success`,
      cancel_url: `${BASE_URL}/#precio`,
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

export async function GET() {
  return NextResponse.json({ error: "Usa POST para iniciar el checkout." }, { status: 405 });
}
