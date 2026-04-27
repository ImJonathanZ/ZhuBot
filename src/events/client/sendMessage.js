/**
 * This file listens to every message sent in the server and runs checks on them.
 * Add new check functions below and call them in the execute() at the bottom.
 */
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { insertFoodPlace } = require("../../database/db");

const USE_GOOGLE_API = false; // Set to true to enable Google Places lookup

// Replies with a gambling help embed + resource buttons if the message contains any gambling keywords
const checkGamba = (message) => {
    // Ignore messages sent by bots to avoid infinite loops
    if (message.author.bot) return;

    const keywords = ["gamble", "bet", "slot", "casino"];

    // Check if any keyword appears anywhere in the message (case-insensitive)
    if (keywords.some((word) => message.content.toLowerCase().includes(word))) {
        // Embed shown as the main message body
        const embed = new EmbedBuilder()
            .setTitle("Gambling Help Resources")
            .setDescription("Excessive gambling is harmful. Reach out for support.")
            .setColor("Red");

        // Row of link buttons — ButtonStyle.Link opens a URL, no interaction handler needed
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Connexontario")
                .setURL("https://connexontario.ca/our-services/gambling-treatment/")
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel("National Helpline")
                .setURL("https://www.ncpgambling.org/help-treatment/national-helpline-1-800-522-4700/")
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel("Gambling Therapy")
                .setURL("https://www.gamblingtherapy.org/")
                .setStyle(ButtonStyle.Link)
        );

        message.reply({ embeds: [embed], components: [row] });
    }
};

// Reacts to any message containing a Spotify link so others can rate the song
const checkSpotify = (message) => {
    // Ignore messages sent by bots
    if (message.author.bot) return;

    if (message.content.includes(`open.spotify.com`)) {
        message.react(`🔥`); // fire = banger
        message.react(`👎`); // thumbs down = skip
    }
};

// Converts Google Places price_level (0–4) to $ symbols
const priceSymbols = (level) => {
    if (level === undefined || level === null) return "N/A";
    return "$".repeat(level) || "Free";
};

// Triggered when an Instagram link is posted in #we-eat❓
// Scrapes the caption from the post, searches Google Places for the restaurant, and replies with an embed
const checkInstagram = async (message) => {
    if (message.author.bot) return;
    if (message.channel.name !== "test") return;
    if (!message.content.includes("instagram.com")) return;

    // Extract the Instagram URL from the message
    const url = message.content.match(/https?:\/\/(www\.)?instagram\.com\/\S+/)?.[0];
    if (!url) return;

    // Fetch the Instagram page — User-Agent header is required for Instagram to return full HTML
    const igRes = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });

    // Pull caption and thumbnail image from og meta tags
    const caption = igRes.data.match(/<meta property="og:description" content="([^"]+)"/)?.[1];
    const thumbnail = igRes.data.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    if (!caption) return message.reply("Couldn't read the caption from that post.");

    // Decode all HTML entities (emoji codes, &quot;, &amp;, etc.)
    const decodedCaption = caption
        .replace(/&quot;/gi, '"')
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(parseInt(code, 10)))
        .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));

    // Strip Instagram og:description preamble: "N likes, N comments - account on Date: \"caption\""
    const captionBody = decodedCaption
        .replace(/^[\d,]+ likes.*?:\s*"/, "")  // remove leading metadata line
        .replace(/"\.$/, "")                    // remove trailing ".
        .replace(/"$/, "");                     // remove trailing "

    // Clean caption for display — strip hashtags, mentions, and excess whitespace
    const cleanCaption = captionBody
        .replace(/#\w+/g, "")
        .replace(/@\w+/g, "")
        .replace(/\s{2,}/g, "\n")
        .trim()
        .slice(0, 300);

    // Try to extract restaurant name from next to a 📍 pin emoji first,
    // otherwise fall back to the full cleaned caption
    const pinMatch = captionBody.match(/📍\s*([^\n#@]+)/);
    const searchQuery = pinMatch
        ? pinMatch[1].trim().slice(0, 200)
        : captionBody.replace(/#\w+/g, "").replace(/@\w+/g, "").replace(/\s+/g, " ").trim().slice(0, 200);

    // Extract the Instagram account handle from the URL
    const handleMatch = url.match(/instagram\.com\/([^/?#]+)/);
    const handle = handleMatch ? `@${handleMatch[1]}` : "@instagram";

    console.log("[Instagram] Caption:", captionBody);
    console.log("[Instagram] Pin match:", pinMatch ? `"${pinMatch[1].trim()}"` : "none");
    console.log("[Instagram] Search query:", `"${searchQuery}"`);

    // Base embed shared by both branches
    const embed = new EmbedBuilder()
        .setColor(0xe1306c)
        .setAuthor({
            name: handle,
            iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/132px-Instagram_logo_2016.svg.png",
            url: `https://www.instagram.com/${handleMatch?.[1] ?? ""}`,
        })
        .setTimestamp();

    if (thumbnail) embed.setThumbnail(thumbnail);

    if (USE_GOOGLE_API) {
        console.log("[Google] API key present:", !!process.env.GOOGLE_PLACES_API_KEY);
        // Search Google Places Text Search API for the restaurant
        const googleRes = await axios.get("https://maps.googleapis.com/maps/api/place/textsearch/json", {
            params: { query: searchQuery, key: process.env.GOOGLE_PLACES_API_KEY },
        });
        console.log("[Google] Status:", googleRes.data.status);
        console.log("[Google] Error message:", googleRes.data.error_message ?? "none");
        console.log("[Google] Results count:", googleRes.data.results.length);
        if (googleRes.data.results[0]) console.log("[Google] Top result:", googleRes.data.results[0].name, "|", googleRes.data.results[0].formatted_address);
        const place = googleRes.data.results[0];

        if (place) {
            // Restaurant found — build full embed with details
            const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;
            embed
                .setTitle(place.name)
                .setURL(mapsUrl)
                .setDescription(cleanCaption)
                .addFields(
                    { name: "📍 Address", value: place.formatted_address },
                    { name: "⭐ Rating", value: place.rating ? `${place.rating} / 5  (${place.user_ratings_total ?? "?"} reviews)` : "N/A", inline: true },
                    { name: "💰 Price", value: priceSymbols(place.price_level), inline: true }
                )
                .setFooter({
                    text: "ZhuBot • Powered by Google Places",
                    iconURL: "https://www.gstatic.com/images/branding/product/1x/maps_round_32dp.png",
                });

            try {
                insertFoodPlace({
                    instagram_url: url,
                    instagram_handle: handle,
                    restaurant_name: place.name,
                    caption: cleanCaption,
                    thumbnail_url: thumbnail ?? null,
                    google_place_id: place.place_id,
                    address: place.formatted_address,
                    rating: place.rating ?? null,
                    review_count: place.user_ratings_total ?? null,
                    price_level: priceSymbols(place.price_level),
                    maps_url: mapsUrl,
                    discord_user_id: message.author.id,
                    discord_channel_id: message.channel.id,
                });
            } catch (e) {
                console.error("[DB] Failed to insert food place:", e.message);
            }

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setLabel("Google Maps").setEmoji("🗺️").setURL(mapsUrl).setStyle(ButtonStyle.Link),
                new ButtonBuilder().setLabel("Instagram Post").setEmoji("📸").setURL(url).setStyle(ButtonStyle.Link)
            );

            return message.channel.send({ embeds: [embed], components: [row] });
        }
    }

    // Fallback: Google API off, or no result found — just show the caption and a link to the post
    embed
        .setTitle("Food Spotted 👀")
        .setURL(url)
        .setDescription(cleanCaption)
        .setFooter({ text: "ZhuBot • Could not find location on Google Maps" });

    try {
        insertFoodPlace({
            instagram_url: url,
            instagram_handle: handle,
            restaurant_name: searchQuery,
            caption: cleanCaption,
            thumbnail_url: thumbnail ?? null,
            google_place_id: null,
            address: null,
            rating: null,
            review_count: null,
            price_level: null,
            maps_url: null,
            discord_user_id: message.author.id,
            discord_channel_id: message.channel.id,
        });
    } catch (e) {
        console.error("[DB] Failed to insert food place:", e.message);
    }

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Instagram Post").setEmoji("📸").setURL(url).setStyle(ButtonStyle.Link)
    );
    message.channel.send({ embeds: [embed], components: [row] });
};

// Fired on every message — runs all checks in order
module.exports = {
    name: "messageCreate",
    async execute(interaction, client) {
        await checkGamba(interaction);
        await checkSpotify(interaction);
        await checkInstagram(interaction);
    },
};
