import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import Client from "../base/Client";
import type { Event, GuildData } from "../@types";
import { Data } from "../database/utils/functions";

export const name: Event["name"] = "guildMemberAdd";
export const execute: Event["execute"] = async (
  member: GuildMember,
  client: Client,
) => {
  const guild = member.guild;
  // Récupérer les données de la guilde depuis la base de données à l'aide de Prisma
  const guildData = await Data.getGuildData(client, guild);

  if (!guildData || !guildData.plugins) return;


  const replacements = {
    "{{ member.mention }}": member.toString(),
    "{{ member.tag }}": member.user.tag,
    "{{ member.username }}": member.user.username,
  };

  let welcomeMessage = guildData.welcome.message;

  for (const placeholder in replacements) {
    if (Object.hasOwnProperty.call(replacements, placeholder)) {
      const replacementValue =
        replacements[placeholder as keyof typeof replacements];
      welcomeMessage = welcomeMessage.replace(
        new RegExp(placeholder, "gi"),
        replacementValue,
      );
    }
  }

  const welcomeChannel = guild.channels.cache.get(
    guildData.welcome.channel,
  ) as TextChannel;

  if (!welcomeChannel) return;

  const embed = new MessageEmbed()
    .setColor("GREEN")
    .setDescription(welcomeMessage)

  welcomeChannel.send({ embeds: [embed] });
};
