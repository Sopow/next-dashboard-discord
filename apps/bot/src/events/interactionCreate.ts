import type { Event, Interaction, SlashCommand } from "../@types";
import { Data } from "../database/utils/functions";

export const name: Event["name"] = "interactionCreate";
export const execute: Event["execute"] = async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;
  if (!interaction.client._ready)
    return await interaction.reply(
      "The bot is still loading, please wait a few seconds and try again.",
    );

  const command: SlashCommand = interaction.client.commands.get(
    interaction.commandName,
  );
  if (!command) return;

  const guildData = await Data.getGuildData(
    interaction.client,
    interaction.guild,
  );

  if (!guildData) return;

  const plugins = guildData.plugins;

  if (!plugins[command.category as keyof typeof plugins]) {
    return await interaction.reply(
      "Cette commande n'est pas disponible car le plugin correspondant n'est pas activé."
    );
  }

  if (plugins.utilities) {
    const adminRoles = guildData.adminRoles
      ? (guildData.adminRoles as string[]).map(
        (roleId: string) => interaction.guild.roles.cache.get(roleId).id,
      )
      : [];

    if (
      adminRoles.length > 0 ?
        (command.adminOnly &&
          !(interaction.member as any)._roles.some((r: string) =>
            adminRoles.includes(r),
          )) : (command.adminOnly && !interaction.memberPermissions.has("ADMINISTRATOR"))
    )
      return await interaction.reply(
        "Cette commande est réservée aux modérateurs ayant la permission Administrateur sur le bot dans le serveur.",
      );
  }

  if (command.ownerOnly && interaction.user.id.includes(process.env.OWNER_IDS))
    return await interaction.reply(
      "Cette commande est réservée au propriétaire du bot.",
    );

  if (command.isConfig && !interaction.memberPermissions.has("MANAGE_GUILD"))
    return await interaction.reply(
      "Cette commande est réservée aux modérateurs ayant la permission `MANAGE_GUILD` sur le serveur.",
    );

  const userId = interaction.user.id;
  const commandName = command.commandName;
  const cooldownSeconds = command.cooldown || 3;

  const isOnCooldown = await interaction.client.database.checkCooldown(
    userId,
    commandName,
    cooldownSeconds,
  );
  if (isOnCooldown) {
    return await interaction.reply(
      `Vous êtes en cooldown. Veuillez attendre ${cooldownSeconds} secondes avant de réutiliser la commande \`${commandName}\``,
    );
  } else {
    command.execute(interaction);
    interaction.client.database.applyCooldown(
      userId,
      commandName,
      cooldownSeconds,
    );
  }
};
