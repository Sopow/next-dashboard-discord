import { Client, Collection, ClientOptions, Guild } from "discord.js";
import log from "../utils/logger";
import database from "../database";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import type { SlashCommand } from "../@types";
import { Data, XP } from "../database/utils/functions";

export default class Bot extends Client {
  _ready: boolean = false;
  collection: Collection<string, any>;
  commands: Collection<string, any> = new Collection();
  cooldowns: Collection<string, any>;
  cache: Collection<string, any>;
  log: any;
  database: database;
  translations: Map<any, Function>;
  xp: XP;
  data: Data;

  constructor(options?: ClientOptions) {
    super(options);
    this.cache = new Collection();
    this.cooldowns = new Collection();
    this.log = log;
    this.database = new database(this);
    this.xp = new XP(this);
    this.data = new Data(this);
  }

  loadCommandsForGuild = async (guild: Guild) => {
    const guildData = await this.database.prisma.client.guild.findUnique({
      where: { id: guild.id },
    });
    const plugins = guildData.plugins;

    const activePluginCategories = Object.entries(plugins)
      .filter(([, isActive]) => isActive)
      .map(([category]) => category);

    const activeCommands = this.commands
      .filter((v: SlashCommand) => {
        // Filter commands that belong to active plugins
        const category = v.category as keyof typeof plugins;
        return activePluginCategories.includes(category);
      })
      .sort((a: SlashCommand, b: SlashCommand) => {
        // Sort commands by category
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        return 0;
      })
      .map((v: SlashCommand) => v.data);

    const rest = new REST({ version: "9" }).setToken(this.token);

    try {
      this.log(
        `Started refreshing application (/) commands for guild ${guild.name} (${guild.id}).`,
      );

      this.removeCommandsForGuild(guild).then(async () => {

        await rest.put(Routes.applicationGuildCommands(this.user.id, guild.id), {
          body: activeCommands,
        });


        this.log(
          `Successfully reloaded application (/) commands for guild ${guild.name} (${guild.id}). Loaded the following commands: ${activeCommands
            ? activeCommands.map((v) => v.name).join(", ")
            : "none"}.`
        );
      });
    } catch (error) {
      this.log(error);

      this.log(
        `An error has occurred while reloading application (/) commands for guild ${guild.name} (${guild.id}).`
      );
    }
  };

  removeCommandsForGuild = async (guild: Guild) => {
    const rest = new REST({ version: "9" }).setToken(this.token);

    try {
      // First, retrieve existing commands
      const existingCommands = await rest.get(
        Routes.applicationGuildCommands(this.user.id, guild.id)
      ) as SlashCommand[];

      // Delete existing commands
      const deletePromises = existingCommands.map(async (command: any) => {
        const deleteUrl = `${Routes.applicationGuildCommands(
          this.user.id,
          guild.id
        )}/${command.id}`;
        await rest.delete(deleteUrl as `/${string}`);
      });

      await Promise.all(deletePromises);

      this.log(
        `Successfully removed application (/) commands for guild ${guild.name} (${guild.id}).`
      );
    } catch (error) {
      this.log(error);
    }
  };

  loadCommands = async () => {
    const guilds: Guild[] = this.guilds.cache.toJSON();
    for (const guild of guilds) {
      await this.loadCommandsForGuild(guild);
    }

    this.log(`Loaded ${this.commands.size} commands.`);
  };

  onDBUpdateReloadCommands = async () => {
  };
}
