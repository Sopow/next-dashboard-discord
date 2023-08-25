import { api } from "~/src/utils/api";
import GuildSkeleton from "./Skeleton";
import { DiscordGuild } from "../../../../../@types";
import GuildButton from "./Button";
import React from "react";

const Guilds = ({
  search,
  t
}) => {
  const { data: guilds } = api.discord.getGuilds.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return guilds
    ? guilds
        .filter(
          (g) =>
            (parseInt(g.permissions) & 0x20 || // Administrator
              parseInt(g.permissions) & 0x8) && // Manage Server
            g.name.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
        .map((guild: DiscordGuild) => (
          <GuildButton guild={guild} key={guild.id} t={t} />
        ))
    : Array(4)
        .fill(null)
        .map((_, index) => <GuildSkeleton key={index} />);
};

export default Guilds;