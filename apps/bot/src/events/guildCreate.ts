import type { Event, GuildData } from "../@types";
import Client from "../base/Client";
import { Guild } from "discord.js";
import { Data } from "../database/utils/functions";

export const name: Event["name"] = "guildCreate";
export const once: Event["once"] = true;

export const execute: Event["execute"] = async (
  guild: Guild,
  client: Client,
) => {
  console.log("guildCreate");

  
  await Data.createGuildData(client, guild);
  await client.loadCommandsForGuild(guild);
  client.log(`Joined guild ${guild.name} (${guild.id})`, "info");
};
