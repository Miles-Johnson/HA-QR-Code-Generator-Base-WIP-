import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { stripe } from "../../lib/stripe";
import { protectedProcedure, router } from "../trpc";

const currentPlanSchema = z.object({
  id: z.string(),
  priceId: z.string(),
  limit: z.number(),
  usage: z.number().default(0),
  priority: z.number().default(1),
});

export const subsRouter = router({
  getCurrentPlan: protectedProcedure
    .output(currentPlanSchema.nullable())
    // @ts-ignore
    .query(async (req) => {
      const { supabase, user } = req.ctx;

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*, prices(*, products(*))")
        .eq("user_id", user?.id!)
        // .lte("current_period_start", new Date())
        // .lte("current_period_end", new Date())
        .single();

      // @ts-ignore
      const limit = sub?.prices?.products.metadata?.["__limit"] ?? 25;
      // @ts-ignore
      const priority = sub?.prices?.products.metadata?.["__priority"] ?? 1;

      const { count: usage } = await supabase
        .from("generations")
        .select("*", { count: "exact" })
        .eq("user_id", user?.id!)
        .gt("created_at", sub?.current_period_start)
        .lt("created_at", sub?.current_period_end);

      return {
        id: sub?.id,
        priceId: sub?.price_id,
        usage,
        limit: +limit,
        priority: +priority,
      };
    }),
  createSubSession: protectedProcedure
    .input(z.object({ priceId: z.string() }))
    .output(z.object({ sessionId: z.string() }))
    // @ts-ignore
    .mutation(async ({ ctx, input }) => {
      const { user, supabase } = ctx;
      const { priceId } = input;

      const quantity = 1;
      const customerId = await createOrRetrieveCustomer({
        supabase,
        uuid: user?.id!,
        email: user?.email!,
      });

      const session_data = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: "required",
        customer: customerId,
        line_items: [
          {
            price: priceId,
            quantity,
          },
        ],
        mode: "subscription",
        allow_promotion_codes: true,
        success_url: `https://hartsy.ai/app?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://hartsy.ai/pricing`,
        customer_update: {
          address: "auto",
        },
        automatic_tax: { enabled: true },
      });
      if (session_data.id) return { sessionId: session_data.id! };
      return new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
});

const createOrRetrieveCustomer = async ({
  supabase,
  email,
  uuid,
}: {
  supabase: any;
  email: string;
  uuid: string;
}) => {
  const { data } = await supabase
    .from("customers")
    .select("*")
    .eq("id", uuid)
    .single();

  if (!data?.stripe_customer_id) {
    const customerData: { email?: string } = {
      email,
    };
    const customer = await stripe.customers.create(customerData);

    await supabase.from("customers").insert([
      {
        id: uuid,
        stripe_customer_id: customer.id,
      },
    ]);
    return customer.id;
  }
  return data.stripe_customer_id;
};
