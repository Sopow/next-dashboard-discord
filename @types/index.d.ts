export interface AccessControlProps {
    roles: GuildRole[];
    newGuildData?: GuildData;
    setnewGuildData?: any;
    t?: (key: string) => string;
}

export interface ChangeLanguageProps {
    locales: string[];
    locale: string;
    push: (path: string, as?: string, options?: object) => void;
    path: string;
    openMenu: boolean;
    onMenuToggle: () => void;
}

export interface Shard {
    id: number;
    guilds: number;
    status:
    | "READY"
    | "CONNECTING"
    | "RECONNECTING"
    | "IDLE"
    | "NEARLY"
    | "DISCONNECTED";
}

export interface Country {
    name: string;
    language: string;
    alpha2Code: string;
    flag: string;
}

export interface SidebarContent {
    name: string;
    href: () => void;
    icon: any;
    disabled?: boolean;
}

export interface SidebarProps {
    t?: any;
    isTherePlugins: boolean;
    guild: DiscordGuild;
    onToggle: (pluginName: string, isChecked: boolean) => void | null;
}

export interface Plugin {
    name: string;
    href: () => void;
    icon: any;
    disabled: boolean;
}

export interface DiscordGuild {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
    approximate_member_count: number;
    memberCount: number;
}

import { Guild } from '!prisma/client';

export type Plugins = "utilities" | "moderation" | "leveling";

export interface PluginsConfig {
    [key: string]: boolean;
}

interface GuildData extends Guild {
    welcome: {
        message: string;
        channel: string;
    };
    leveling: {
        message: string;
        channel: string;
        card: {
            background: string;
            progressBarColor: string;
            textColor: string;
            overlay: string;
        }
    }
    adminRoles: string[];
    plugins: PluginsConfig;
}

export interface GuildMember {
    user: User;
    nick: string | null;
    roles: string[];
}

export interface GuildRole {
    id: string;
    name: string;
    color: number;
}

export interface GuildChannel {
    id: string;
    name: string;
    type: number;
}

export interface User {
    id: string;
    username: string;
    avatar: string | null;
    avatar_decoration_data: any | null;
    banner: string | null;
    banner_color: string | null;
    discriminator: string;
    flags: number;
    global_name: string;
    locale: string;
    mfa_enabled: boolean;
    premium_type: number;
    public_flags: number;
    email: string | null;
    verified: boolean;
    phone: string | null;
}

interface Client {
    test: any;
}
/**
 * Discord Slash Command Interaction.
 */
interface Interaction {
    /**
     * The Discord Client.
     * @readonly
     */
    client: Client
}

/**
 * Discord Message.
 */
interface Message {
    /**
     * The Discord Client.
     * @type {Client}
     * @readonly
     */
    client: Client
}

/**
 * A CommandInteraction object used to create Discord Slash Commands.
 */


/**
 * A command object used for formatting SlashCommands (used in the help command).
 */
interface command {
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
     * The user's experience.
     *
     */
    xp: number;

    /**
     * The user's level.
     */
    level: number;
    /**
     * The user's coins
     */
    coins: number;
}