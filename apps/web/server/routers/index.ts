import { router } from "../trpc";
import { generationsRouter } from "./generations.router";
import { imagesRouter } from "./images.router";
import { subsRouter } from "./subs.router";
import { templatesRouter } from "./templates.router";
import { usersRouter } from "./users.router";

export const appRouter = router({
  users: usersRouter,
  generations: generationsRouter,
  subs: subsRouter,
  templates: templatesRouter,
  images: imagesRouter,
  // admin: router({}),
});
export type AppRouter = typeof appRouter;
