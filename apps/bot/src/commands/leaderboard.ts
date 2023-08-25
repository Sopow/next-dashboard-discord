import { ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed, User } from 'discord.js';
import { Interaction } from "../@types";
import { Data, XP } from "../database/utils/functions";
import canvacord from "canvacord";
import Command from "../base/Command";
import Client from "../base/Client";

export default class Leaderboard extends Command {
    static commandName = "leaderboard"
    static description = "Montre le classement des joueurs"
    static category = "leveling"
    static cooldown = 5
    static examples = ["`command:` leaderboard"]
    static isConfig = false
    static ownerOnly = false
    static adminOnly = false
    static data = {
        name: this.commandName,
        description: this.description,
        options: [] = []
    }

    constructor(client: Client) {
        super(client, {
            name: Leaderboard.commandName,
            description: Leaderboard.description,
            category: Leaderboard.category,
            cooldown: Leaderboard.cooldown,
            examples: Leaderboard.examples,
            isConfig: Leaderboard.isConfig,
            ownerOnly: Leaderboard.ownerOnly,
            adminOnly: Leaderboard.adminOnly,
            data: Leaderboard.data
        })
    }

    static async execute(interaction: Interaction, currentPage: number = 1) {
        // Récupérer le top 10 du classement de la guilde
        const leaderboard = await XP.getGuildLeaderboard(interaction.client, interaction.guild);

        const embed = new MessageEmbed()
            .setColor("#2F3136")
            .setTitle("Classement des joueurs")
            .setDescription(`Voici le classement des joueurs du serveur ${interaction.guild.name}`)
            .setFooter(`Commande exécutée par ${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        if (leaderboard.length < 1) {
            embed.setDescription(`Il n'y a aucun utilisateur dans le classement.`);
        } else {
            const rowsPerPage = 10;
            const startIndex = (currentPage - 1) * rowsPerPage;
            const pageData = leaderboard.slice(startIndex, startIndex + rowsPerPage);

            // Ajouter les utilisateurs au classement
            for (const [index, data] of pageData.entries()) {
                const user = interaction.guild.members.cache.get(data.id.split("-")[0])?.user || await interaction.client.users.fetch(data.id.split("-")[0]).catch(() => null) as User;
                if (!user) continue;

                const rank = leaderboard.findIndex((u) => u.id.split("-")[0] === user.id) + 1;
                const level = data.level;
                const xp = data.xp;

                embed.addField(`**${rank}. ${user.tag}**`, `**Niveau:** ${level}\n**XP:** ${xp}`);
            }

            const totalPages = Math.ceil(leaderboard.length / rowsPerPage);
            embed.setFooter(`Page ${currentPage} / ${totalPages}`);

            // Créer les boutons "Précédent" et "Suivant"
            const row = new MessageActionRow().addComponents(
                new MessageButton().setCustomId('previous').setLabel('Précédent').setStyle('PRIMARY').setDisabled(currentPage === 1),
                new MessageButton().setCustomId('next').setLabel('Suivant').setStyle('PRIMARY').setDisabled(currentPage === totalPages)
            );

            // Envoyer l'embed et les boutons en réponse à l'interaction
            await interaction.reply({ embeds: [embed], components: [row] });

            // Attendre une interaction avec les boutons
            const filter = (i: any) => i.customId === 'previous' || i.customId === 'next';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'previous') {
                    currentPage = Math.max(1, currentPage - 1);
                } else if (i.customId === 'next') {
                    currentPage = Math.min(totalPages, currentPage + 1);
                }

                await i.update({ embeds: [embed], components: [row] });
            });

            collector.on('end', () => {
                row.components.forEach(button => button.setDisabled(true));
                interaction.editReply({ components: [row] });
            });
        }
    }
}