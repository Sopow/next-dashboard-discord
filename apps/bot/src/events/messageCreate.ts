import { MessageAttachment, TextChannel } from "discord.js";
import type { Event, Message } from "../@types";
import { Data, XP } from "../database/utils/functions";
import { generateXPCard } from "../utils/functions";

export const name: Event["name"] = "messageCreate";
export const execute: Event["execute"] = async (message: Message) => {
  const { client } = message;
  const ownerIds = process.env.OWNER_IDS.split(",");
  const args = message.content.slice("t!".length).split(/ +/);
  let commandName = args.shift().toLowerCase();

  if (ownerIds.includes(message.author.id)) {
    if (commandName === "eval") {
      let content = args.join(" ");
      const result = new Promise((resolve) => resolve(eval(content)));

      return result
        .then((output: any) => {
          if (typeof output !== `string`) {
            output = require(`util`).inspect(output, {
              depth: 0,
            });
          }
          if (output.includes(client.token)) {
            output = output.replace(new RegExp(client.token, "gi"), `T0K3N`);
          }
          try {
            message.channel.send(`\`\`\`\js\n${output}\n\`\`\``);
          } catch (e) {
            console.error(e);
          }
        })
        .catch((err) => {
          console.error(err);
          err = err.toString();
          if (err.includes(client.token)) {
            err = err.replace(new RegExp(client.token, "gi"), `T0K3N`);
          }
          try {
            message.channel.send(`\`\`\`\js\n${err}\n\`\`\``);
          } catch (e) {
            console.error(e);
          }
        });
    }
  }

  if (commandName === 'rank') {
    const user = message.mentions.users.first() || message.author;
    const guildData = await Data.getGuildData(client, message.guild);
    const userData = await Data.getGuildMemberData(client, user, message.guild);

    if (!guildData) return await message.reply("Une erreur est survenue lors de la récupération des données du serveur.");
    if (!userData) return await message.reply("Une erreur est survenue lors de la récupération des données de l'utilisateur.");
    const leaderboard = await XP.getGuildLeaderboard(client, message.guild);

    const member = message.guild.members.cache.get(user.id.split("-")[0]);
    const rank = leaderboard.findIndex((u) => u.id.split("-")[0] === user.id) + 1;
    const status = member.presence.status;
    const xp = userData.xp;
    const level = userData.level;
    const username = member.user.username;
    const requiredXPForNextLevel = await XP.calculateRequiredXPForNextLevel(level + 1);
    const avatar = member.user.displayAvatarURL({ dynamic: false, format: "png", size: 2048 });
    
    const rankCard = await generateXPCard({
        background: guildData.leveling.card.background,
        textColor: guildData.leveling.card.textColor,
        progressBarColor: guildData.leveling.card.progressBarColor,
        overlay: guildData.leveling.card.overlay,
    }, {
        avatar: avatar,
        level: level.toString(),
        xp: xp.toString(),
        requiredXPForNextLevel: requiredXPForNextLevel.toString(),
        rank: rank.toString(),
        username: username,
        status: status,
    })

    const attachment = new MessageAttachment(rankCard, "Card.png");

    message.reply({ files: [attachment] });
  }

  // xp system
  if (message.author.bot) return;
  if (message.channel.type === "DM") return;

  const guildData = await Data.getGuildData(client, message.guild);

  const plugins = guildData.plugins;

  if (!plugins.leveling) return;

  const userData = await Data.getGuildMemberData(client, message.author, message.guild);

  if (!userData) await Data.createGuildMemberData(client, message.author, message.guild);

  const cooldownDuration = 60 * 1000; // Durée du cooldown en millisecondes (par exemple, 1 minute)
  const now = Date.now();
  const userCooldownRemoveDate = await XP.isMessageOnCooldown(client, message.author, message.guild);

  if (userCooldownRemoveDate > now) {
    const remainingCooldown = userCooldownRemoveDate - now;
    const remainingCooldownSeconds = Math.floor(remainingCooldown / 1000);

    console.log(`User ${message.author.tag} is on cooldown for ${remainingCooldownSeconds} seconds.`);
    return;
  } else {
    const xpToAdd = Math.floor(Math.random() * 7) + 8;
    const newUser = await XP.add(client, message.author, message.guild, xpToAdd);

    let xpMessage = guildData.leveling.message;


    const replacements = {
      "{{ member.mention }}": message.member.toString(),
      "{{ member.username }}": message.member.user.username,
      "{{ member.level }}": newUser.level.toString(),
    };


    for (const placeholder in replacements) {
      if (Object.hasOwnProperty.call(replacements, placeholder)) {
        const replacementValue =
          replacements[placeholder as keyof typeof replacements];
        xpMessage = xpMessage.replace(
          new RegExp(placeholder, "gi"),
          replacementValue,
        );
      }
    }

    if (newUser.level > userData.level) {
      const xpChannel = message.guild.channels.cache.get(guildData.leveling.channel) as TextChannel;
      xpChannel.send(xpMessage);
    }

    XP.setMessageCooldown(client, message.author, message.guild, new Date(now + cooldownDuration));
  }
}