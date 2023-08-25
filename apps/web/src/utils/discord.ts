import env from "~/src/env";
import { getBaseUrl } from "./api";
import { DiscordGuild, GuildRole } from "../../../../@types";

export const DISCORD_ENDPOINT = "https://discord.com/api/v10";

// https://discord.com/developers/docs/reference#image-formatting
export const getGuildIconUrl = (guild: DiscordGuild) => {
  if (!guild.icon) return null;

  const format = guild.icon.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${format}`;
};

export const buildInviteUrl = (guildId: string | null) =>
  `https://discord.com/api/oauth2/authorize?client_id=${env.DISCORD_CLIENT_ID
  }&scope=bot%20applications.commands${guildId ? `&guild_id=${guildId}` : ""}&response_type=code&redirect_uri=${encodeURIComponent(
    `${getBaseUrl()}/guilds`,
  )}`;


export const getGuild = async (guildId: string) => {
  const guild = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}`, {
    headers: {
      Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
    },
  });


  if (guild.status !== 200) return null;

  const guildData = (await guild.json()) as DiscordGuild;
  guildData.icon = getGuildIconUrl(guildData);

  return guildData;
};

export const getGuildMemberCount = async (guildId: string) => {
  const guild = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}/preview`, {
    headers: {
      Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
    },
  });

  if (guild.status !== 200) return null;

  const guildData = (await guild.json()) as DiscordGuild;
  guildData.memberCount = guildData.approximate_member_count;
  return guildData.memberCount;
};

export const getTopGuilds = async () => {
  const guilds = await fetch(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
    headers: {
      Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
    },
  });

  if (guilds.status !== 200) return null;

  const guildsData = (await guilds.json()) as DiscordGuild[];

  const guildsWithMemberCount = await Promise.all(guildsData.slice(0, 20).map(async (guild) => {
    const memberCount = await getGuildMemberCount(guild.id);
    const icon = getGuildIconUrl(guild);
    return { ...guild, memberCount, icon };
  }));

  // Trier les guildes par nombre de membres décroissant
  guildsWithMemberCount.sort((guildA, guildB) => guildB.memberCount - guildA.memberCount);

  return {
    guilds: guildsWithMemberCount,
    totalGuilds: guildsData.length,
  }
};


export const getGuildRoles = async (guildId: string) => {
  const roles = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}/roles`, {
    headers: {
      Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
    },
  });

  if (roles.status !== 200) return null;

  const rolesData = (await roles.json()) as GuildRole[];

  return rolesData;
};

export const getGuildChannels = async (guildId: string) => {
  const channels = await fetch(
    `${DISCORD_ENDPOINT}/guilds/${guildId}/channels`,
    {
      headers: {
        Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
      },
    },
  );

  if (channels.status !== 200) return null;

  const channelsData = (await channels.json()) as GuildRole[];

  return channelsData;
};
