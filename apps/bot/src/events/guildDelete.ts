import type { Event, GuildData } from "../@types";
import Client from "../base/Client";
import { Guild } from "discord.js";
import { Data } from "../database/utils/functions";

export const name: Event["name"] = "guildDelete";
export const once: Event["once"] = true;

export const execute: Event["execute"] = async (
  guild: Guild,
  client: Client,
) => {

  // Supprimer la guilde correspondante de la base de données
  await Data.deleteGuildData(client, guild);
  await Data.deleteGuildMembersData(client, guild);
  await client.removeCommandsForGuild(guild);
  client.log(`Left guild ${guild.name} (${guild.id})`, "info");
};
