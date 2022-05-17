import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(stream: Readable) {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const buff = await buffer(req);
  const secret = req.headers["stripe-signature"] || "não encontrou nada";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buff, secret, webhookSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const { type } = event;

  if (relevantEvents.has(type)) {
    try {
      switch (type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await saveSubscription(
            subscription.id,
            subscription.customer.toString(),
          );
          break;
        case "checkout.session.completed":
          const session = event.data.object as Stripe.Checkout.Session;

          if (!session.subscription || !session.customer)
            throw new Error("Missing subscription or customer");

          await saveSubscription(
            session.subscription.toString(),
            session.customer.toString(),
            true
          );
          break;
        default:
          throw new Error(`Unknown event type: ${type}`);
      }
    } catch (err: any) {
      console.error(err);
      return res.status(400).json({ error: "Webhook handler failed" });
    }
  }

  res.status(200).json({ ok: true });
};
