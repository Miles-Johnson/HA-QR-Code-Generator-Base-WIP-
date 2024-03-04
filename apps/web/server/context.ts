import { Database } from "@hartsy/db";
import { createServerClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { cookies } from "next/headers";
import getClientOptions from "../lib/cookies/getClientOptions";
interface AuthContext {
  user?: User | null;
  supabase: ReturnType<typeof createServerClient<Database>>;
}

export const createContextInner = async ({ user, supabase }: AuthContext) => {
  return {
    user,
    supabase,
  };
};

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    getClientOptions(cookieStore)
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return await createContextInner({
    user,
    supabase: createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      getClientOptions(cookieStore)
    ),
  });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
