import { usersRowSchema } from "@hartsy/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const usersRouter = router({
  get: protectedProcedure
    .output(usersRowSchema.nullable())
    // @ts-ignore
    .query(async (req) => {
      const { supabase, user } = req.ctx;

      if (!user) return new TRPCError({ code: "UNAUTHORIZED" });

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();

      return data;
    }),
  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .output(usersRowSchema.nullable())
    // @ts-ignore
    .query(async (req) => {
      const { supabase } = req.ctx;
      const { username } = req.input;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      return data;
    }),
  updateUsername: protectedProcedure
    .input(
      z.object({
        // only letters
        username: z
          .string()
          .min(3)
          .max(32)
          .regex(/^[a-z]+$/i),
      })
    )
    .output(usersRowSchema.nullable())
    // @ts-ignore
    .mutation(async (req) => {
      const { supabase, user } = req.ctx;
      const { username } = req.input;

      if (!user) return new TRPCError({ code: "UNAUTHORIZED" });

      const { data } = await supabase
        .from("users")
        .update({ username })
        .eq("id", user?.id)
        .select("*")
        .single();

      return data;
    }),
});
