import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  stripe,
  upsertPriceRecord,
  upsertProductRecord,
} from "../../../../lib/stripe";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.created",
]);

export async function POST(req: NextRequest, res: NextResponse) {
  const reqText = await req.text();
  const buf = Buffer.from(reqText);

  const sig = req.headers.get("stripe-signature") || "";
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return NextResponse.json({ received: true });
  }

  if (relevantEvents.has(event.type)) {
    console.log(`[Stripe Webhook] Event type: ${event.type}`);
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case "customer.created":
          const customer = event.data.object as Stripe.Customer;
          console.log("customer creating", customer?.email);
          if (customer.email) await createOrRetrieveCustomer(customer);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;

          await createOrRetrieveCustomer(
            checkoutSession.customer as Stripe.Customer
          );
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          }
          if (checkoutSession.mode === "payment") {
            // await AddPayment();
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return NextResponse.json({ received: true });
}
