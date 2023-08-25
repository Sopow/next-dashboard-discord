import type { SlashCommand, Interaction, command, UserData } from "../@types";
import {
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
  MessageEmbed,
  MessageComponentInteraction,
} from "discord.js";
import { capitalize, removeEmoji, unCapitalize } from "../utils/functions";
import Command from "../base/Command";
import Client from "../base/Client";

export default class Help extends Command {
  static commandName = "help";
  static description = "Montre le menu d'aide";
  static category = "utilities";
  static cooldown = 5;
  static examples = ["`command:` help"];
  static isConfig = false;
  static ownerOnly = false;
  static adminOnly = false;
  static data = {
    name: this.commandName,
    description: this.description,
    options: [
      {
        type: 3,
        name: "command",
        description: "La commande dont vous voulez voir l'aide",
        required: false,
      },
    ],
  };

  constructor(client: Client) {
    super(client, {
      name: Help.commandName,
      description: Help.description,
      category: Help.category,
      cooldown: Help.cooldown,
      examples: Help.examples,
      isConfig: Help.isConfig,
      ownerOnly: Help.ownerOnly,
      adminOnly: Help.adminOnly,
      data: Help.data,
    });
  }

  static async execute(interaction: Interaction) {
    const guildCommands = await interaction.guild.commands.fetch();
    const commands = interaction.client.commands
      .filter((r: command) => r.category !== "owner")
      .map((v: command) => {
        if (
          v.data?.options?.length !== 0 &&
          v.data?.options
            .filter((r: { choices: any }) => !r.choices)
            .filter((r: { type: number }) => r.type !== 3)
            .filter((r: { type: number }) => r.type !== 6)
            .filter((r: { type: number }) => r.type !== 4).length !== 0
        ) {
          return v.data?.options.map((c: { name: any; description: any }) => {
            return {
              cooldown: v.cooldown,
              category: v.category,
              options: v.data?.options.filter(
                (r: { name: any }) => r.name === c.name,
              )[0].options,
              name: v.name,
              description: removeEmoji(c.description),
              id: guildCommands.filter(
                (r: { name: any }) => r.name === v.name.toLowerCase(),
              ).first()?.id,
            };
          });
        } else
          return {
            cooldown: v.cooldown,
            category: v.category,
            options: v.data?.options?.filter(
              (r: { type: number }) =>
                r.type === 3 || r.type === 6 || r.type === 4,
            ),
            name: v.name,
            description: removeEmoji(v.data.description),
            id: guildCommands.filter(
              (r: { name: any }) => r.name === v.name.toLowerCase(),
            ).first()?.id,
          };
      })
      .flat();

    if (interaction.options.getString("command")) {
      const command: any = commands.filter(
        (r: any) => r.name === interaction.options.getString("command"),
      )[0];
      if (!command) interaction.reply(`Commande introuvable`);

      const embed = new MessageEmbed().addField(
        "Description",
        command.description,
      );

      if (command.options) {
        embed.addField(
          "Utilisation",
          `/${command.name} ` +
          command.options
            .map((v: any) =>
              `\`${v.required ? `<${v.name}>` : `[${v.name}]`}\``
            )
            .join(", ")
        );

        embed.addField(
          "Détails des options",
          command.options
            .map((v: any) => `> \`${v.name}:\` ${v.description}`)
            .join("\n")
        );
      }
      if (command.examples)
        embed.addField(
          "Exemples",
          command.examples.map((v: string) => `/${command.name} ${v}`).join("\n"),
        );
      if (command.cooldown)
        embed.addField(
          "Temps de recharge",
          !isNaN(command.cooldown)
            ? command.cooldown + " secondes"
            : command.cooldown,
        );
      embed.setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({
          dynamic: true,
        }),
      });
      embed.setTitle(`Commande : ${command.name}`);
      embed.setColor("#70926c");
      embed.setTimestamp();
      return await interaction.reply({
        embeds: [embed],
      });
    } else {
      const commandsByCategory: { [category: string]: command[] } = {};

      commands.forEach((cmd: command) => {
        if (!commandsByCategory[cmd.category]) {
          commandsByCategory[cmd.category] = [];
        }
        commandsByCategory[cmd.category].push(cmd);
      });

      console.log(commandsByCategory);

      const categories = Object.keys(commandsByCategory);

      const category_selector = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId(interaction.id)
          .setPlaceholder("Choisissez une catégorie.")
          .setMinValues(1)
          .setMaxValues(1)
          .addOptions(
            categories.map((category) => ({
              label: category,
              description: `Commandes dans la catégorie "${category}"`,
              value: category.toLowerCase(),
            })),
          ),
      );

      const go_back_button = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(interaction.id + "_back")
          .setEmoji("◀️")
          .setStyle("SECONDARY"),
      );

      const baseEmbed = {
        author: {
          name: "TGS Aide",
          icon_url: interaction.client.user.displayAvatarURL(),
        },
        description: ``,
        color: "#70926c",
        thumbnail: {
          url: interaction.client.user.displayAvatarURL(),
        },
        fields: categories.map((category) => ({
          name: `${capitalize(category)} Commands`,
          value: `\`${commandsByCategory[category]
            .map((cmd) => unCapitalize(cmd.name))
            .join("`, `")}\``,
        })),
      };

      await interaction.reply({
        embeds: [JSON.parse(JSON.stringify(baseEmbed))],
        components: [category_selector],
      });

      const filter = (i: MessageComponentInteraction) =>
        i.user.id === interaction.user.id &&
        i.customId.startsWith(interaction.id);
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
      });

      let collectorTimeout = setTimeout(async () => {
        let component = category_selector.toJSON();
        component.components[0].disabled = true;
        interaction.editReply({ components: [new MessageActionRow(component)] });
        collector.stop();
      }, 120000);

      collector.on("collect", async (i: any) => {
        clearTimeout(collectorTimeout);
        collectorTimeout = setTimeout(async () => {
          let component = category_selector.toJSON();
          component.components[0].disabled = true;
          interaction.editReply({
            components: [new MessageActionRow(component)],
          });
          collector.stop();
        }, 120000);

        if (i.customId === interaction.id + "_back") {
          await interaction.editReply({
            embeds: [JSON.parse(JSON.stringify(baseEmbed))],
            components: [category_selector],
          });
        } else if (i.customId === interaction.id) {
          let category: string = i.values[0];
          let description: Array<any> = [];
          let cmds: Array<command> = [];
          for (const cmd of commandsByCategory[category]) {
            if (cmds.length === 25) {
              description.push(`\`/${cmd.name}\`: ${cmd.description ?? "none"}`);
              await interaction.editReply({
                components: [category_selector, go_back_button],
                embeds: [
                  {
                  }
                ]
              });
              description = [];
            } else {
              cmds.push(cmd);
            }
          }
          for (const cmd of cmds) {
            description.push(`</${unCapitalize(cmd.name)}:${cmd.id}> - ${cmd.description ?? "none"}`);
          }
          interaction.editReply({
            components: [category_selector, go_back_button],
            embeds: [
              {
                author: {
                  name: `${capitalize(category)} Commandes`,
                  icon_url: interaction.client.user.displayAvatarURL(),
                },
                description: description.join("\n"),
                color: "#70926c",
              },
            ],
          });
        }
        i.deferUpdate().catch(() => { });
      });
    }
  }
}