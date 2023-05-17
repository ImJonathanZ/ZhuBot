/**
 * This command is used to delete a certain amount of messages from a channel
 * A user can be specified to delete messages from. Note this will only delete messages from user within Amount number of messages
 */

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lfg")
        .setDescription("Calls for a specific person to get online")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to call online")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        let randInt = Math.floor(Math.random() * 3);
        interaction.reply({
            content: `Calling ${user} online!`,
            ephemeral: true,
        });
        switch (randInt) {
            case 0:
                await interaction.channel.send({
                    content:
                        `Long ago, the four Discord members lived together in harmony. Then, everything changed when ${user.username} fell asleep. ` +
                        `Only the Avatar, master of all four roasting techniques, could complete the five stack, but when the world needed him most, he vanished. ` +
                        `A hundred years passed and my brother and I discovered the new Avatar, an Val pro named ${user}. And although his Valorant skills are great, ` +
                        `he has a lot to learn before he's ready to carry the team. But I believe ${
                            user.username.split("(")[0]
                        } can carry the world.`,
                });
                break;
            case 1:
                await interaction.channel.send({
                    content:
                        `In a world far, far away, where depression ruled the galaxies and crying echoed through the cosmos, a great quest was about to unfold. ` +
                        `Legends spoke of a chosen one, destined to unite the scattered factions of the internet and bring harmony to the Discord realm. ` +
                        `In this epic tale, amidst the vast expanse of the interstellar network, ${user} emerged as the unlikely hero. ` +
                        `Their presence was foretold by ancient prophecies, whispered among the stars. ` +
                        `${user.username} possessed the power to finish the five stack.`,
                });
                break;
            case 2:
                await interaction.channel.send({
                    content: `Yo I can't think of any more messages, ${user} just GET ONLINE.`,
                });
                break;
        }
    },
};
