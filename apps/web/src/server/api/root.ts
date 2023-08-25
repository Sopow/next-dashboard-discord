import { discordRouter } from "~/src/server/api/routers/discord";
import { createTRPCRouter } from "~/src/server/api/trpc";
import { languageRouter } from "./routers/language";

export const appRouter = createTRPCRouter({
  discord: discordRouter,
  language: languageRouter
});

export type AppRouter = typeof appRouter;
