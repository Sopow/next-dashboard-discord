import { api } from "~/src/utils/api";
import { GuildIcon } from "./Icon";
import { DiscordGuild } from "../../../../../@types";
import Link from "next/link";
import React from "react";

const GuildButton = ({ guild, t }: { guild: DiscordGuild; t }) => {
  const isConfigured = api.discord.getGuildData.useQuery(guild.id, {
    refetchOnWindowFocus: false,
  }).data;

  const nameForRole = (guild: DiscordGuild) => {
    if (guild.owner) {
      return "Owner";
    } else if (parseInt(guild.permissions) & 0x20) {
      return "Administrator";
    } else if (parseInt(guild.permissions) & 0x8) {
      return "Manager";
    } else {
      return "Unable to find role";
    }
  };

  return (
    <div
      className="h-fit rounded-t-3xl"
      style={{
        background:
          "linear-gradient(0deg, hsla(251, 30%, 7%, 1) 0%, hsla(252, 17%, 17%, 1) 100%)",
      }}
    >
      <div className="w-full overflow-clip rounded-t-3xl shadow transition-all duration-200">
        <div className="relative flex h-40 items-center justify-center overflow-hidden">
          <div
            style={{
              background: guild.icon ? `url(${guild.icon})` : null,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            className={`absolute h-full w-full blur-md ${
              guild.icon ? "scale-[1.5]" : "bg-gray-800"
            }`}
          ></div>
          <GuildIcon guild={guild} size={80} />
        </div>
      </div>
      <div className="flex flex-row justify-around gap-2 py-4">
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-md pb-1 font-bold text-white">
            {guild.name.length > 12
              ? guild.name.slice(0, 12) + "..."
              : guild.name}
          </h1>
          <p className="text-sm text-gray-500">{nameForRole(guild)}</p>
        </div>
        <Link href={`/guilds/${guild.id}`}>
          <button
            className={`rounded-lg px-4 py-2 text-white transition-all duration-200 ${
              isConfigured ? "bg-[#40A361]" : "bg-[#6e6e6e]"
            } hover:bg-opacity-50`}
          >
            {isConfigured ? t("manage") : t("add")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default GuildButton;