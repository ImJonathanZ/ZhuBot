/**
 * This is a file that will be used to check if a message contains a certain word or phrase and then respond to it.
 */
const checkGamba = (message) => {
    if (message.author.bot) return;
    if (
        message.content.toLowerCase().includes(`gamble`) ||
        message.content.toLowerCase().includes(`bet`) ||
        message.content.toLowerCase().includes(`slot`) ||
        message.content.toLowerCase().includes(`casino`)
    ) {
        message.reply({
            content: `Excessive gambling is bad. Go get help.\nhttps://www.gamblersanonymous.org/ga/`,
        });
    }
};

const checkSpotify = (message) => {
    if (message.author.bot) return;
    if (message.content.includes(`open.spotify.com`)) {
        message.react(`🔥`);
        message.react(`👎`);
    }
};

module.exports = {
    name: "messageCreate",
    async execute(interaction, client) {
        await checkGamba(interaction);
        await checkSpotify(interaction);
    },
};
