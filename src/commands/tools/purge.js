/**
 * This command is used to delete a certain amount of messages from a channel
 * A user can be specified to delete messages from. Note this will only delete messages from user within Amount number of messages
 */

const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Deletes a certain amount of messages")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("The amount of messages to delete")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to delete messages from")
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const amount = interaction.options.getInteger("amount");
        const user = interaction.options.getUser("user");
        let filter = null;
        if (amount > 100) {
            return interaction.reply({
                content: "You can only delete 100 messages at a time",
                ephemeral: true,
            });
        }

        if (user) {
            const messages = await interaction.channel.messages.fetch({
                limit: amount,
            });
            filter = messages.filter((m) => m.author.id === user.id);
            await interaction.channel.bulkDelete(filter, true);
        } else {
            await interaction.channel.bulkDelete(amount, true);
        }

        const embed = new EmbedBuilder()
            .setTitle("Purged!")
            .setDescription(
                `${interaction.user} successfully deleted ${filter?.size ?? amount} messages from ${
                    user?.tag ?? "everyone"
                }`
            )
            .setColor("Red")
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
