import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/src/server/api/trpc";
import { getAccessTokenFromRequest } from "~/src/server/auth";
import { DISCORD_ENDPOINT, getGuildIconUrl } from "~/src/utils/discord";
import { DiscordGuild, GuildData, User } from "../../../../../../@types";

export const discordRouter = createTRPCRouter({
  getUserData: protectedProcedure.query(async ({ ctx }) => {
    const accessToken = await getAccessTokenFromRequest(ctx.req);
    const user = await fetch(`${DISCORD_ENDPOINT}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (user.status !== 200) throw new Error("Failed to fetch user");

    const userData = (await user.json()) as User;

    return userData;
  }),
  getGuildData: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.guild.findUnique({
        where: {
          id: input,
        },
      })
    }),
  setGuildData: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        welcome: z.object({
          message: z.string(),
          channel: z.string(),
        }),
        leveling: z.object({
          card: z.object({
            background: z.union([z.string().url(), z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]),
            progressBarColor: z.string(),
            textColor: z.string(),
            overlay: z.string(),
          }),
          message: z.string(),
          channel: z.string(),
        }),
        plugins: z.record(z.boolean()),
        adminRoles: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.guild.upsert({
        where: {
          id: input.id,
        },
        update: {
          welcome: input.welcome,
          plugins: input.plugins,
          adminRoles: input.adminRoles,
          leveling: input.leveling,
        },
        create: {
          id: input.id,
          welcome: input.welcome,
          plugins: input.plugins,
          adminRoles: input.adminRoles,
          leveling: input.leveling,
        },
      }) as GuildData;
    }),

  getGuilds: protectedProcedure.query(async ({ ctx }) => {
    const accessToken = await getAccessTokenFromRequest(ctx.req);

    const guilds = await fetch(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (guilds.status !== 200) throw new Error("Failed to fetch guilds");

    const guildsData = (await guilds.json()) as DiscordGuild[];

    guildsData.forEach((guild) => {
      guild.icon = getGuildIconUrl(guild);
    });

    return guildsData;
  }),
});
