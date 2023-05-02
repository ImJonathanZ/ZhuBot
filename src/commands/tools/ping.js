const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(interaction, client) {
        const message = await interaction.deferReply(
            { fetchReply: true}
        );

        const newMessage = `Pong! Latency is ${message.createdTimestamp - interaction.createdTimestamp}ms.\nAPI Latency is ${Math.round(client.ws.ping)}ms`;
        await interaction.editReply(
            { content: newMessage}
        );
    },
};
