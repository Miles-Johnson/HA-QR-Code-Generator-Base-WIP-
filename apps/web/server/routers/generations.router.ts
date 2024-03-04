import { generationsRowSchema } from "@hartsy/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getBaseWorkflow } from "../../lib/comfy";
import { stripe } from "../../lib/stripe";
import { protectedProcedure, router } from "../trpc";

const promptStatus = z.enum(["queued", "running", "completed"]);
const queueInputSchema = z.object({
  batch: z.number().min(1).max(4).default(1),
  positive: z.string(),
  negative: z.string(),
  checkpoint: z.string(),
  priority: z.number().default(1),
  width: z.number().default(1024),
  height: z.number().default(768),
  templateId: z.number().optional(),
  subId: z.string().optional(),
});
const promptStatusSchema = z.object({
  status: promptStatus,
  position: z.number().optional(),
});

const COMFY_ENDPOINTS = ["https://a9v8dvcotc45uh-3000.proxy.runpod.net"];

export const generationsRouter = router({
  getAll: protectedProcedure
    .output(z.array(generationsRowSchema))
    // @ts-ignore
    .query(async (req) => {
      const { supabase, user } = req.ctx;

      const { data } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", user?.id!)
        .order("created_at", { ascending: false });

      return data ?? [];
    }),
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(generationsRowSchema)
    // @ts-ignore
    .query(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      const { data } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", user?.id!)
        .eq("id", input.id)
        .single();

      return data;
    }),
  getStatus: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(promptStatusSchema)
    // @ts-ignore
    .query(async (req) => {
      const { supabase, user } = req.ctx;
      const { id } = req.input;

      const { data: generation } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", user?.id!)
        .eq("id", id)
        .single();

      if (!generation) return new TRPCError({ code: "NOT_FOUND" });
      if (generation.output_urls)
        return { status: "completed", position: undefined };

      const data = await fetch(
        `${generation.comfy_endpoint}/history/${generation.comfy_prompt_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());

      if (Object.keys(data).length > 0)
        return {
          status: "completed",
          position: undefined,
        };

      const data2 = await fetch(`${generation.comfy_endpoint}/queue`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      const running: any[] = data2?.queue_running ?? [];
      const pending: any[] = data2?.queue_pending ?? [];

      const isRunning = running.find(
        (r: any) => r[1] === generation.comfy_prompt_id
      );
      const pendingPosition = pending.findIndex(
        (r: any) => r[1] === generation.comfy_prompt_id
      );

      if (isRunning)
        return {
          status: "running",
          position: undefined,
        };

      return {
        status: "queued",
        position: pendingPosition,
      };
    }),
  download: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async (req) => {
      const { supabase, user } = req.ctx;
      const { id } = req.input;

      const { data: generation } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", user?.id!)
        .eq("id", id)
        .single();

      if (!generation) return new TRPCError({ code: "NOT_FOUND" });
      if (generation.output_urls) return { status: "completed" };

      const data = await fetch(
        `${generation.comfy_endpoint}/history/${generation.comfy_prompt_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());

      const prompt: any[] = data[generation.comfy_prompt_id]["prompt"];
      const outputKey = prompt[prompt.length - 1][0];
      const images =
        data[generation.comfy_prompt_id].outputs[outputKey]["images"] ?? [];

      const urls: string[] = [];
      for (const image of images) {
        const { filename, type, subfolder } = image;

        const response = await fetch(
          `${generation.comfy_endpoint}/view?filename=${filename}&type=${type}&subfolder=${subfolder}`
        );
        const imageData = await response.blob();

        const { data: uploadData, error } = await supabase.storage
          .from("generations")
          .upload(`${generation.user_id}/${filename}`, imageData, {
            cacheControl: "36000000",
            upsert: true,
          });

        if (error) {
          console.error(error);
        }
        if (uploadData?.path) {
          const { data } = await supabase.storage
            .from("generations")
            .getPublicUrl(`${generation.user_id}/${filename}`);
          if (data?.publicUrl) {
            urls.push(data.publicUrl);
          }
        }
      }

      if (urls.length > 0) {
        await supabase
          .from("generations")
          .update({ output_urls: urls })
          .eq("id", generation.id);
      }
    }),
  queue: protectedProcedure
    .input(queueInputSchema)
    .output(generationsRowSchema.partial())
    // @ts-ignore
    .mutation(async (req) => {
      const { supabase, user } = req.ctx;
      const {
        positive,
        negative,
        checkpoint,
        batch,
        priority,
        width,
        height,
        templateId,
        subId,
      } = req.input;

      const randomEndpoint =
        COMFY_ENDPOINTS[Math.floor(Math.random() * COMFY_ENDPOINTS.length)]!;
      const seed = Math.floor(Math.random() * 100000000);
      const body = getBaseWorkflow(
        positive,
        negative,
        seed,
        checkpoint,
        batch,
        width,
        height
      );

      const comfyData = await fetch(`${randomEndpoint}/prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...body, number: priority }),
      })
        .then((r) => r.json())
        .catch((e) => {
          console.error(e);
        });

      const promptId = comfyData.prompt_id;
      if (!promptId) return new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const { data: generation, error } = await supabase
        .from("generations")
        .insert([
          {
            user_id: user?.id!,
            positive,
            negative,
            checkpoint,
            batch,
            comfy_endpoint: randomEndpoint,
            comfy_prompt_id: promptId,
            width,
            height,
            template_id: templateId,
          },
        ])
        .select("*")
        .single();

      if (error) {
        console.error(error);
      }

      if (subId) {
        await stripe.subscriptionItems.createUsageRecord(subId, {
          quantity: batch,
          timestamp: "now",
        });
      }

      return generation;
    }),
});
