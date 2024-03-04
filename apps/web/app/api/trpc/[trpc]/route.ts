import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextResponse } from "next/server";
import { createContext } from "../../../../server/context";
import { appRouter } from "../../../../server/routers";

const handler = (req: Request) => {
  try {
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      //   @ts-ignore
      createContext,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
};

export { handler as GET, handler as POST };
