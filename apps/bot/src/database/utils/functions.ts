import { Guild, User } from "discord.js";
import Client from "../../base/Client";
import { GuildData, UserData } from "../../../../../@types";

export class XP {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public static async add(
        client: Client,
        user: User,
        guild: Guild,
        xpToAdd: number,
        xpMultiplier: number = 1,
    ) {
        const userData = await Data.getGuildMemberData(client, user, guild);
        if (!userData) await Data.createGuildMemberData(client, user, guild);

        const newXP = userData.xp + (xpToAdd * xpMultiplier);

        const newLevel = await this.calculateLevel(newXP);

        const newUser = await Data.updateGuildMemberData(client, user, guild, {
            ...userData,
            xp: newXP,
            level: newLevel,
        });


        return newUser;
    }

    public static async remove(
        client: Client,
        user: User,
        guild: Guild,
        xpToRemove: number,
    ) {
        const prisma = client.database.prisma.client;

        const userData = await Data.getGuildMemberData(client, user, guild);

        const newXP = userData.xp - xpToRemove;

        const newLevel = await this.calculateLevel(newXP);

        const newUser = await Data.updateGuildMemberData(client, user, guild, {
            ...userData,
            xp: newXP,
            level: newLevel,
        });

        return newUser;
    }

    public static async calculateLevel(xp: number): Promise<number> {
        const baseXP = 100; // XP nécessaire pour atteindre le niveau 1

        // Si l'XP est inférieur à 100, le niveau est 0
        if (xp < baseXP) {
            return 0;
        }

        const level = Math.floor(Math.log(xp / baseXP) / Math.log(2)) + 1;

        return level;
    }



    public static async calculateRequiredXPForNextLevel(level: number): Promise<number> {
        const baseXP = 100; // XP nécessaire pour atteindre le niveau 1

        // Calcul de l'XP nécessaire en fonction du niveau en utilisant la même formule que calculateLevel
        const requiredXP = Math.floor(baseXP * (Math.pow(2, level - 1)));

        return requiredXP;
    }

    public static async getGuildLeaderboard(client: Client, guild: Guild, limit: number = 10) {
        const leaderboard = await client.database.prisma.client.guildMember.findMany({
            where: { id: { endsWith: `-${guild.id}` } },
            orderBy: { xp: "desc" },
            take: limit,
        });

        return leaderboard;
    }

    public static setMessageCooldown(client: Client, user: User, guild: Guild, cooldown: Date) {
        const redis = client.database.redis.client;

        redis.set(`message-cooldown:${user.id}-${guild.id}`, cooldown.getTime());
    }

    public static async isMessageOnCooldown(client: Client, user: User, guild: Guild): Promise<number> {
        const redis = client.database.redis.client;

        const cooldown = await redis.get(`message-cooldown:${user.id}-${guild.id}`);

        if (!cooldown) return 0;

        return parseInt(cooldown);
    }

    public static async resetMessageCooldown(client: Client, user: User, guild: Guild) {
        const redis = client.database.redis.client;

        redis.del(`message-cooldown:${user.id}-${guild.id}`);
    }
}

export class Data {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public static async getGuildData(client: Client, guild: Guild) {
        const prisma = client.database.prisma.client;

        const guildData = await prisma.guild.findUnique({
            where: { id: guild.id },
        }) as GuildData;

        return guildData;
    }

    public static async getGuildMemberData(client: Client, user: User, guild: Guild) {
        const prisma = client.database.prisma.client;

        const guildMemberData = await prisma.guildMember.findUnique({
            where: { id: `${user.id}-${guild.id}` },
        });

        return guildMemberData;
    }

    public static async createGuildData(client: Client, guild: Guild) {
        const prisma = client.database.prisma.client;

        const guildData = await prisma.guild.create({
            data: {
                id: guild.id,
                adminRoles: [],
                plugins: {
                    utilities: false,
                    moderation: false,
                    leveling: false,
                },
                welcome: {
                    message: "Welcome {{ member.mention }} !",
                    channel: ""
                },
                leveling: {
                    message: "GG {{ member.mention }} ! You just leveled up to level {{ member.level }} !",
                    channel: "",
                    card: {
                        background: "#fff",
                        progressBarColor: "#fff",
                        textColor: "#fff",
                        overlay: "#000",
                    }
                }
            },
        }) as GuildData;

        return guildData;
    }

    public static async createGuildMemberData(client: Client, user: User, guild: Guild) {
        const prisma = client.database.prisma.client;

        const guildMemberData = await prisma.guildMember.create({
            data: {
                id: `${user.id}-${guild.id}`,
                xp: 0,
                level: 0,
                coins: 0,
            },
        }) as UserData;

        return guildMemberData;
    }

    public static async updateGuildData(client: Client, guild: Guild, newData: GuildData) {
        const prisma = client.database.prisma.client;

        const guildData = await prisma.guild.update({
            where: { id: guild.id },
            data: {
                ...newData
            },
        }) as GuildData;

        return guildData;
    }

    public static async updateGuildMemberData(client: Client, user: User, guild: Guild, newData: UserData) {
        const prisma = client.database.prisma.client;

        const guildMemberData = await prisma.guildMember.update({
            where: { id: `${user.id}-${guild.id}` },
            data: {
                ...newData
            },
        }) as UserData;

        return guildMemberData;
    }

    public static async deleteGuildData(client: Client, guild: Guild) {
        const prisma = client.database.prisma.client;

        const guildData = await prisma.guild.delete({
            where: { id: guild.id },
        }) as GuildData;

        return guildData;
    }

    public static async deleteGuildMembersData(client: Client, guild: Guild) {
        const prisma = client.database.prisma.client;

        const guildMemberData = await prisma.guildMember.deleteMany({
            where: { id: { endsWith: `-${guild.id}` } },
        });

        return guildMemberData;
    }
}