import Stripe from "stripe";

export const stripe = new Stripe(
  process.env.STRIPE_SK ?? process.env.STRIPE_SECRET_KEY ?? "",
  {
    // @ts-expect-error
    apiVersion: "2022-11-15",
    appInfo: {
      name: "Hartsy",
    },
  }
);

import { Database } from "@hartsy/db";
import { createClient } from "@supabase/supabase-js";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Price = Database["public"]["Tables"]["prices"]["Row"];

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || "",
  {
    auth: { persistSession: false },
  }
);

const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error } = await supabaseAdmin.from("products").upsert([productData]);
  if (error) throw error;
  console.log(`Product inserted/updated: ${product.id}`);
};

export const upsertPriceRecord = async (price: Stripe.Price) => {
  const product = await stripe.products.retrieve(price.product as string);

  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? null,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata,
    is_default: price.id === product.default_price,
    is_metered: price.recurring?.usage_type === "metered",
  };

  await supabaseAdmin
    .from("prices")
    .update({ is_default: false })
    .eq("product_id", price.product as string);
  const { error } = await supabaseAdmin.from("prices").upsert([priceData]);
  if (error) throw error;
  console.log(`Price inserted/updated: ${price.id}`);
};

const getDBUserByEmail = async (email: string) => {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) console.log(error);

  return data;
};

export const createOrRetrieveCustomer = async (
  stripeCustomer: Stripe.Customer
) => {
  const email = stripeCustomer.email!;
  let user = await getDBUserByEmail(email);

  if (!user) {
    await supabaseAdmin.auth.admin.createUser({
      email,
      password: "password",
      email_confirm: false,
    });
    user = await getDBUserByEmail(email);
  }

  if (!user) {
    console.error("could not create user: ", stripeCustomer.email);
    return;
  }

  const { data } = await supabaseAdmin
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!data?.stripe_customer_id) {
    const { error: supabaseError } = await supabaseAdmin
      .from("customers")
      .insert([{ id: user.id, stripe_customer_id: stripeCustomer.id, email }]);
    if (supabaseError) throw supabaseError;
    console.log(
      `New customer created and inserted for ${user.id}, ${stripeCustomer.id}.`
    );
  }
  return data?.stripe_customer_id;
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  console.log(`Updated customer [${customer}] with billing details.`);
};

export const addPayment = async () => {};

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  if (noCustomerError) throw noCustomerError;

  const uuid = customerData.id!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  // Upsert the latest status of the subscription object.
  const subscriptionData: Database["public"]["Tables"]["subscriptions"]["Insert"] =
    {
      id: subscription.id,
      user_id: uuid,
      metadata: subscription.metadata,
      status: subscription.status,
      price_id: subscription.items.data[0]?.price.id! as string,
      //TODO check quantity on subscription
      // @ts-ignore
      quantity: subscription.quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? toDateTime(subscription.cancel_at).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      current_period_start: toDateTime(
        subscription.current_period_start
      ).toISOString(),
      current_period_end: toDateTime(
        subscription.current_period_end
      ).toISOString(),
      created: toDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at
        ? toDateTime(subscription.ended_at).toISOString()
        : null,
    };

  const { error, data: dbSub } = await supabaseAdmin
    .from("subscriptions")
    .upsert([subscriptionData])
    .select("*")
    .single();
  if (error) throw error;
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};
