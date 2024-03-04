"use client";

import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useCallback } from "react";
import { trpc } from "../../app/_trpc/client";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function Nav() {
  const { data: user } = trpc.users.get.useQuery();
  const { data: plan } = trpc.subs.getCurrentPlan.useQuery();

  const onLogout = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.reload();
  }, []);

  const remainingCredits = plan ? Math.max(0, plan.limit - plan.usage) : null;

  return (
    <div className="w-full bg-base-100 text-base-content sticky top-0 z-30 flex h-16 justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)]">
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-full w-52"
            >
              <li>
                <Link href="/#features">Features</Link>
              </li>

              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/templates">Templates</Link>
              </li>
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost text-xl">
            Hartsy
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/">Features</Link>
            </li>

            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/templates">Templates</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {plan && (
            <div className="mr-2">
              <Link
                href="/pricing"
                className="hover:underline text-sm font-semibold leading-6 text-gray-600"
              >
                {remainingCredits === 0 && "No credits left"}
                {remainingCredits &&
                  remainingCredits > 0 &&
                  `${remainingCredits} credits left`}
              </Link>
            </div>
          )}

          {!user && (
            <Link href="/login" className="btn btn-neutral rounded-full btn-md">
              Login
            </Link>
          )}
          {user && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full bg-base-200">
                  {user.avatar_url && (
                    <img
                      className="bg-base-100"
                      alt="Avatar Url"
                      src={user.avatar_url}
                    />
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link
                    href={user.username ? `/users/${user.username}` : "#"}
                    className="justify-between"
                  >
                    Hi, {user.full_name}
                  </Link>
                </li>
                <li>
                  <Link href={`/users/edit`} className="justify-between">
                    Edit Profile
                  </Link>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <Link href="/templates" className="justify-between">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="/history" className="justify-between">
                    History
                  </Link>
                </li>
                <li>
                  <a
                    href={`https://billing.stripe.com/p/login/28o9Dz4wReaEgXS000?prefilled_email=${user.email}`}
                  >
                    Manage Billing
                  </a>
                </li>
                <li>
                  <button onClick={onLogout}>Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
