const checkGamba = (message) => {
    if (message.author.bot) return;
    if (
        message.content.toLowerCase().includes(`gamble`) ||
        message.content.toLowerCase().includes(`bet`) ||
        message.content.toLowerCase().includes(`slot`) ||
        message.content.toLowerCase().includes(`casino`)
    ) {
        message.reply(`Gambling is bad. Go get help.`);
    }
};


module.exports = {
    name: "messageCreate",
    execute(message) {
        checkGamba(message);
    },
};
