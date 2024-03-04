import { imagesRowSchema, templatesRowSchema } from "@hartsy/db";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const templatesRouter = router({
  getAll: publicProcedure
    .output(z.array(templatesRowSchema.partial()))
    // @ts-ignore
    .query(async (req) => {
      const { supabase } = req.ctx;

      const { data } = await supabase
        .from("templates")
        .select("id, name, description, image_url, created_at")
        .eq("active", true)
        .order("order_rank", { ascending: false });

      return data ?? [];
    }),
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .output(templatesRowSchema)
    // @ts-ignore
    .query(async (req) => {
      const { supabase } = req.ctx;

      const { data } = await supabase
        .from("templates")
        .select("*")
        .eq("id", req.input.id)
        .single();
      return data;
    }),
  getRelatedImages: publicProcedure
    .input(z.object({ id: z.number(), limit: z.number().default(4) }))
    .output(z.array(imagesRowSchema.partial()))
    // @ts-ignore
    .query(async (req) => {
      const { supabase } = req.ctx;

      const { data } = await supabase
        .from("images")
        .select("id, image_url")
        .eq("template_id", req.input.id)
        .limit(req.input.limit);

      return data ?? [];
    }),
});
