"use client";

import { pricesRowSchema, productsRowSchema } from "@hartsy/db";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import { z } from "zod";
import { trpc } from "../../app/_trpc/client";
import cn from "../../lib/cn";
import { getStripe } from "../../lib/stripe-client";

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "annually", label: "Annually", priceSuffix: "/year" },
];

const productsWithPrices = productsRowSchema.extend({
  prices: z.array(pricesRowSchema),
});

type Props = {
  products: z.infer<typeof productsWithPrices>[];
};

export default function PricingCards({ products }: Props) {
  const [frequency, setFrequency] = useState(frequencies[0]);
  const { data: user } = trpc.users.get.useQuery();
  const { data: plan } = trpc.subs.getCurrentPlan.useQuery();
  const { mutateAsync: subscribe } = trpc.subs.createSubSession.useMutation();

  const onClick = useCallback(
    async (priceId: string) => {
      const { sessionId } = await subscribe({ priceId: priceId });
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    },
    [user]
  );

  return (
    <div className="bg-white py-24 sm:py-32 w-full">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-accent-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Pricing plans for teams of&nbsp;all&nbsp;sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Choose an affordable plan that’s packed with the best features for
          your needs.
        </p>
        <div className="mt-16 justify-center hidden">
          <RadioGroup
            value={frequency}
            onChange={setFrequency}
            className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
          >
            <RadioGroup.Label className="sr-only">
              Payment frequency
            </RadioGroup.Label>
            {frequencies.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option}
                className={({ checked }) =>
                  cn(
                    checked ? "bg-accent-600 text-white" : "text-gray-500",
                    "cursor-pointer rounded-full px-2.5 py-1"
                  )
                }
              >
                <span>{option.label}</span>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {products
            .sort(
              (a, b) =>
                ((a.prices ?? [])[0]?.unit_amount! ?? 0) -
                ((b.prices ?? [])[0]?.unit_amount! ?? 0)
            )
            .map((tier, index) => (
              <div
                key={tier.id}
                className={cn(
                  index === 1 ? "ring-2 ring-accent" : "ring-1 ring-gray-200",
                  "rounded-3xl p-8 xl:p-10"
                )}
              >
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={cn(
                      index === 1 ? "text-accent" : "text-gray-900",
                      "text-lg font-semibold leading-8"
                    )}
                  >
                    {tier.name}
                  </h3>
                  {index === 1 ? (
                    <p className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold leading-5 text-accent">
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    ${tier.prices[0]?.unit_amount! / 100}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    /{tier.prices[0]?.interval}
                  </span>
                </p>
                <button
                  // disabled={plan?.id === plan?.priceId}
                  onClick={() => onClick(tier.prices[0]?.id!)}
                  aria-describedby={tier.id}
                  className={cn(
                    "btn  w-full mt-4",
                    index === 1 ? "btn-accent" : ""
                  )}
                >
                  {!plan || (plan?.id !== plan?.priceId && "Subscribe")}
                  {plan && plan?.id == plan?.priceId && "Current Plan"}
                  {!user && "Get Started"}
                </button>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
                >
                  {Object.keys(tier.metadata ?? {})
                    .filter((k) => k[0] !== "_")
                    .map((key, index) => (
                      <li key={index} className="flex gap-x-3">
                        <CheckIcon
                          className="h-6 w-5 flex-none text-accent"
                          aria-hidden="true"
                        />
                        <div>
                          {/* @ts-ignore */}
                          {(extractNumberValue(tier.metadata?.[key]) ?? "") && (
                            <span className="font-bold text-accent">
                              {/* @ts-ignore */}
                              {extractNumberValue(tier.metadata?.[key])}
                            </span>
                          )}
                          {/* @ts-ignore */}
                          {tier.metadata?.[key].replace(
                            // @ts-ignore
                            `${extractNumberValue(tier.metadata?.[key])}`,
                            ""
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function extractNumberValue(value?: string) {
  if (!value) return null;

  const first = value.split(" ")[0];
  const number = parseInt(first!);
  if (isNaN(number)) {
    return null;
  }

  return number;
}
