import { MessageAttachment, MessageEmbed } from "discord.js";
import { Interaction } from "../@types";
import { Data, XP } from "../database/utils/functions";
import canvacord from "canvacord";
import Command from "../base/Command";
import Client from "../base/Client";
import { generateXPCard } from "../utils/functions";

export default class Rank extends Command {
    static commandName = "rank";
    static description = "Montre le rank d'un joueur";
    static category = "leveling";
    static cooldown = 5;
    static examples = ["`command:` rank"];
    static isConfig = false;
    static ownerOnly = false;
    static adminOnly = false;
    static data = {
        name: this.commandName,
        description: this.description,
        options: [
            {
                type: 6,
                name: "user",
                description: "L'utilisateur dont vous voulez voir le rank",
                required: false,
            },
        ],
    };

    constructor(client: Client) {
        super(client, {
            name: Rank.commandName,
            description: Rank.description,
            category: Rank.category,
            cooldown: Rank.cooldown,
            examples: Rank.examples,
            isConfig: Rank.isConfig,
            ownerOnly: Rank.ownerOnly,
            adminOnly: Rank.adminOnly,
            data: Rank.data
        })
    }

    static async execute(interaction: Interaction) {
        const user = interaction.options.getUser("user") || interaction.user;
        const guildData = await Data.getGuildData(interaction.client, interaction.guild);
        const userData = await Data.getGuildMemberData(interaction.client, user, interaction.guild);

        if (!guildData) return await interaction.reply("Une erreur est survenue lors de la récupération des données du serveur.");
        if (!userData) return await interaction.reply("Une erreur est survenue lors de la récupération des données de l'utilisateur.");
        const leaderboard = await XP.getGuildLeaderboard(interaction.client, interaction.guild);

        const member = interaction.guild.members.cache.get(user.id.split("-")[0]);
        const rank = leaderboard.findIndex((u) => u.id.split("-")[0] === user.id) + 1;
        const status = member.presence.status;
        const xp = userData.xp;
        const level = userData.level;
        const username = member.user.username;
        const requiredXPForNextLevel = await XP.calculateRequiredXPForNextLevel(level + 1);
        const avatar = member.user.displayAvatarURL({ dynamic: false, format: "png" });
        
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

        interaction.reply({ files: [attachment] });
    }
}