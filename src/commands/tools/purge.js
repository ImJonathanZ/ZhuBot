//This command is used to delete a certain amount of messages from a channel
//The user can also specify a user to delete messages from (optional)

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Deletes a certain amount of messages")
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
            const filter = messages.filter((m) => m.author.id === user.id);
            await interaction.channel.bulkDelete(filter, true);
        } else {
            await interaction.channel.bulkDelete(amount, true);
        }

        const embed = new EmbedBuilder()
            .setTitle("Purged!")
            .setDescription(
                `${interaction.user} successfully deleted ${amount} messages from ${
                    user?.tag ?? "everyone"
                }`
            )
            .setColor("Red")
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
