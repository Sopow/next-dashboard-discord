import Image from "next/image";
import { DiscordGuild } from "../../../../../@types";
import React from "react";

export const GuildIcon = ({
  guild,
  size,
}: {
  guild: DiscordGuild;
  size: number;
}) => (
  <>
    {guild.icon ? (
      <Image
        height={size}
        width={size}
        src={guild.icon}
        alt="guild icon"
        className="relative z-10 rounded-full border-2 border-white"
      />
    ) : (
      <span
        className="relative z-10 flex items-center justify-center rounded-full border-2 border-white text-white"
        style={{
          width: size,
          height: size,
        }}
      >
        {guild.name
          .toUpperCase()
          .split(" ")
          .map((s) => s.charAt(0)).length > 5
          ? guild.name
              .toUpperCase()
              .split(" ")
              .map((s) => s.charAt(0))
              .slice(0, 5)
              .join("")
          : guild.name
              .toUpperCase()
              .split(" ")
              .map((s) => s.charAt(0))
              .join("")}
      </span>
    )}
  </>
);
