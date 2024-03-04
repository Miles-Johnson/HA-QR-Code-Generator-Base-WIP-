import { CreateTRPCReact, createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "../../server/routers";

export const trpc: CreateTRPCReact<AppRouter, any, any> =
  createTRPCReact<AppRouter>();
