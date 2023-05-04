const wait = require('node:timers/promises').setTimeout;
const checkGamba = (message) => {
    if (message.author.bot) return;
    if (
        message.content.toLowerCase().includes(`gamble`) ||
        message.content.toLowerCase().includes(`bet`) ||
        message.content.toLowerCase().includes(`slot`) ||
        message.content.toLowerCase().includes(`casino`)
    ) {
        message.reply({
            content: `Gambling is bad. Go get help. https://www.gamblersanonymous.org/ga/`,
            
        });
        
    }
};


module.exports = {
    name: "messageCreate",
    async execute(interaction, client) {
        await checkGamba(interaction);
        
    },
};
