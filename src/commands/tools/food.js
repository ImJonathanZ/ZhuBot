const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getRecentFoodPlaces, searchFoodPlaces } = require("../../database/db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("food")
        .setDescription("Browse food places spotted in the server")
        .addStringOption((option) =>
            option
                .setName("search")
                .setDescription("Filter by restaurant name")
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const query = interaction.options.getString("search");
        const rows = query ? searchFoodPlaces(query) : getRecentFoodPlaces();

        if (rows.length === 0) {
            const msg = query
                ? `No results for **${query}**.`
                : "No food places have been saved yet.";
            return interaction.editReply({ content: msg });
        }

        const embed = new EmbedBuilder()
            .setColor(0xe1306c)
            .setTitle(query ? `Results for: ${query}` : "Recent Food Spots")
            .setFooter({ text: `ZhuBot • ${rows.length} result${rows.length === 1 ? "" : "s"} found` });

        for (const row of rows) {
            const lines = [];

            if (row.address) lines.push(`📍 ${row.address}`);
            else lines.push("📍 No address saved");

            const ratingStr = row.rating ? `⭐ ${row.rating}/5 (${row.review_count ?? "?"} reviews)` : null;
            const priceStr = row.price_level ? `💰 ${row.price_level}` : null;
            if (ratingStr || priceStr) lines.push([ratingStr, priceStr].filter(Boolean).join("  "));

            lines.push(`📸 ${row.instagram_handle ?? "@instagram"}  •  [Instagram Post](${row.instagram_url})`);

            if (row.maps_url) lines.push(`🗺️ [Google Maps](${row.maps_url})`);

            embed.addFields({
                name: row.restaurant_name ?? "Unknown",
                value: lines.join("\n"),
            });
        }

        return interaction.editReply({ embeds: [embed] });
    },
};
