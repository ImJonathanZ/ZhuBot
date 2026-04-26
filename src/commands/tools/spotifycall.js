const { SlashCommandBuilder } = require("discord.js");

const SpotifyWebApi = require("spotify-web-api-node");

// credentials are optional
var scopes = [
        `playlist-modify`,
        "playlist-modify-public",
        "playlist-modify-private",
    ],
    redirectUri = "https://github.com/ImJonathanZ/ZhuBot",
    clientSecret = `068c2a6d39d7492992d43b6874c86360`,
    clientId = "679e0f355d7f400db7a80c1c30448716",
    state = "some-state-of-my-choice";

var spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId,
    clientSecret: clientSecret
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

// https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
console.log('authorizeURL--------------------------------' + spotifyApi.getAccessToken());

module.exports = {
    data: new SlashCommandBuilder()
        .setName("spotifytop")
        .setDescription("Spotify stuff"),

    async execute(interaction) {
        interaction.reply({ content: `Yeas: ${spotifyApi.getAccessToken()}` });

        
    },
};
// https://github.com/ImJonathanZ/ZhuBot?code=AQAL8Y2Rd81YmNAMUEaGbdmkw1YgmSKMoKOXQxzIMrGozwWMG3sdxNH3GrPqm5fS0UMsBqOT7aGVTgooHpc7OFFTU7Om0akGpZujjm5tMj61YKFp0egPt33AjM8SIRtaz4wpucqJTFNxrUFRQfJ8Qj3Yiyy1OB-fn-1AhXYeHcuXRrcgA0u2nd_lhQ-qgrZRiz2yHR9ptcN5Bfl3v38zwPWZS18wzSd-RLC6DSv6UZnddlv54X1IxAztGueKs5VXncvPyMzddzMof0w&state=some-state-of-my-choice