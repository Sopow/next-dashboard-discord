import { SlashCommandBuilder } from "@discordjs/builders";
import Client from "../base/Client";
import type { CommandInteraction, Interaction, Message } from "discord.js";

/**
 * Discord Slash Command Interaction.
 */
interface Interaction extends CommandInteraction {
  /**
   * The Discord Client.
   * @type {Client}
   * @readonly
   */
  client: Client;
}

/**
 * Discord Message.
 */
interface Message extends Message {
  /**
   * The Discord Client.
   * @type {Client}
   * @readonly
   */
  client: Client;
}

/**
 * A CommandInteraction object used to create Discord Slash Commands.
 */
interface SlashCommand {
  /**
   * The name of the command.
   */
  commandName: string;
  /**
   * The category of the command.
   */
  category: string;
  /**
   * The description of the command.
   */
  description: string;
  /**
   * The cooldown of the command.
   */
  cooldown?: number | 3;
  /**
   * The category of the command.
   */
  category: "utilities" | "moderation" | "leveling" | "owner" | "config";
  /**
   * The examples of the command.
   */
  examples?: string[];
  /**
   * If this command is only for the mods.
   */
  adminOnly?: boolean;
  /**
   * If this command is a config command.
   */
  isConfig?: boolean;
  /**
   * If this command is only for the owner.
   */
  ownerOnly?: boolean;
  /**
   * The data as SlashCommandBuilder.
   */
  data: JSON<any>;
  /**
   * This is the function that will be called when the command is executed.
   * @param Interaction The CommandInteraction object from the interactionCreate event.
   */
  execute: (...args: any[]) => void;
}

/**
 * A command object used for formatting SlashCommands (used in the help command).
 */
interface command {
  /**
   * The id of the command.
   * @type {string}
   */
  id?: string;
  /**
   * The name of the command.
   */
  cooldown: number;
  /**
   * The category of the command.
   */
  category: string;
  /**
   * The options as SlashCommandBuilder.
   */
  options: any[];
  /**
   * The name of the command.
   */
  name: string;
  /**
   * The description of the command.
   */
  description: string;
  /**
   * If this option is required or not.
   */
  required?: boolean;
  /**
   * The data as SlashCommandBuilder.
   */
  data?: command;
  /**
   * Examples of the command.
   */
  examples?: string[];
}

/**
 * An object used to use events.
 */
interface Event {
  /**
   * The name of the event.
   */
  name: string;
  /**
   * If this event must be called only once.
   */
  once?: boolean;
  /**
   * The function that will be called when the event is triggered.
   */
  execute: (...args: any[]) => void;
}

/**
 * Player's Data Interface.
 */
interface UserData {
  /**
   * The user's Discord ID.
   * @readonly
   */
  readonly id: string;
  /**
   * The user's Discord Tag.
   */
  tag: string;
  /**
   * The user's experience.
   *
   */
  xp: number;
}

interface GuildData {
  /**
   * The guild's Discord ID.
   * @readonly
   */
  readonly id: string;
  /**
   * The guild's welcome message.
   */
  welcome: {
    /**
     * The welcome message.
     * @type {string}
     */
    message: string;
    /**
     * The welcome channel.
     * @type {string}
     */
    channel: string;
  };

  /**
   * The guild's admin roles.
   */
  adminRoles: string[];

  /**
   * The guild's plugins
   */

  plugins: {
    /**
     * The guild's utilities plugin.
     * @type {boolean}
     */
    utilities: boolean;
    /**
     * The guild's moderation plugin.
     */
    moderation: boolean;

    /**
     * The guild's leveling plugin.
     * @type {boolean}
     */
    leveling: boolean;
  };
}
