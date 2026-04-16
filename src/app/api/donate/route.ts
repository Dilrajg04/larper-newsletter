import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(req: NextRequest) {
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const { amount } = await req.json();
    const validAmounts = [3, 5, 10, 25];

    if (!validAmounts.includes(amount)) {
      return NextResponse.json({ error: "Invalid donation amount." }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "LARPER Newsletter Donation",
              description: "Support independent AI & tech journalism",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/?donated=true`,
      cancel_url: `${baseUrl}/#donate`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Payment error. Please try again." }, { status: 500 });
  }
}
