import { imagesRowSchema } from "@hartsy/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const imagesRouter = router({
  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .output(z.array(imagesRowSchema))
    // @ts-ignore
    .query(async (req) => {
      const { supabase } = req.ctx;

      const { data: images } = await supabase
        .from("images")
        .select("*")
        .eq("user_id", req.input.userId)
        .order("created_at", { ascending: false });

      return images ?? [];
    }),

  getByGeneration: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.array(imagesRowSchema))
    // @ts-ignore
    .query(async (req) => {
      const { supabase, user } = req.ctx;

      const { data: images } = await supabase
        .from("images")
        .select("*")
        .eq("generation_id", req.input.id)
        .eq("user_id", user?.id!);

      return images ?? [];
    }),
  create: protectedProcedure
    .input(z.object({ generationId: z.number(), url: z.string() }))
    .output(imagesRowSchema)
    // @ts-ignore
    .mutation(async (req) => {
      const { supabase, user } = req.ctx;
      const { generationId, url } = req.input;

      const { data: generation } = await supabase
        .from("generations")
        .select("*")
        .eq("id", generationId)
        .eq("user_id", user?.id!)
        .single();

      if (!generation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Generation not found",
        });
      }

      const { data: image } = await supabase
        .from("images")
        .insert({
          generation_id: generationId,
          image_url: url,
          user_id: user?.id!,
          likes_count: 0,
          template_id: generation.template_id,
        })
        .select("*")
        .single();

      return image;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async (req) => {
      const { supabase, user } = req.ctx;
      const { id } = req.input;

      await supabase
        .from("images")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id!);
    }),
});
