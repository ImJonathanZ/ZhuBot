const { request } = require('undici');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`READY!! Logged in as ${client.user.tag}!`);
    }
}