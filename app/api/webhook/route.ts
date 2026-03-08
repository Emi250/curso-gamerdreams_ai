import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

/**
 * Stripe Webhook — recibe eventos de pago y actualiza la base de datos.
 *
 * Para probar en local:
 *   stripe listen --forward-to localhost:3000/api/webhook
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[Stripe Webhook] Invalid signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Procesar evento de pago completado
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const supabaseUserId = session.metadata?.supabase_user_id;

    if (!supabaseUserId) {
      console.error("[Stripe Webhook] Missing supabase_user_id in metadata");
      // Devolvemos 200 para que Stripe no reintente
      return NextResponse.json({ received: true });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("purchases").upsert(
      {
        user_id: supabaseUserId,
        stripe_session_id: session.id,
        stripe_customer_id: session.customer as string | null,
        stripe_payment_id: session.payment_intent as string | null,
        amount_usd: session.amount_total,
        status: "completed",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_session_id" }
    );

    if (error) {
      console.error("[Stripe Webhook] DB error:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    console.log(`[Stripe Webhook] Purchase recorded for user ${supabaseUserId}`);
  }

  // Manejar reembolso
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = charge.payment_intent as string;

    if (paymentIntentId) {
      const supabase = createAdminClient();
      await supabase
        .from("purchases")
        .update({ status: "refunded", updated_at: new Date().toISOString() })
        .eq("stripe_payment_id", paymentIntentId);
    }
  }

  return NextResponse.json({ received: true });
}
