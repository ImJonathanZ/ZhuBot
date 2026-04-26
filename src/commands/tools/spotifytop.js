const { SlashCommandBuilder } = require("discord.js");

const SpotifyWebApi = require("spotify-web-api-node");

// credentials are optional
var scopes = [
        `playlist-modify`,
        "playlist-modify-public",
        "playlist-modify-private",
    ],
    redirectUri = "https://github.com/ImJonathanZ/ZhuBot",
    clientSecret = ``,
    clientId = "",
    state = "some-state-of-my-choice";

var spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId,
    clientSecret: clientSecret
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

console.log(authorizeURL);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("spotifycall")
        .setDescription("Spotify stuff"),

    async execute(interaction) {
        interaction.reply({ content: authorizeURL });

        spotifyApi.authorizationCodeGrant(` `).then(
            function (data) {
                console.log("The token expires in " + data.body["expires_in"]);
                console.log("The access token is " + data.body["access_token"]);
                console.log(
                    "The refresh token is " + data.body["refresh_token"]
                );

                // Set the access token on the API object to use it in later calls
                spotifyApi.setAccessToken(data.body["access_token"]);
                spotifyApi.setRefreshToken(data.body["refresh_token"]);
            },
            function (err) {
                console.log("Something went wrong!", err);
            }
        );
    },
};
// https://github.com/ImJonathanZ/ZhuBot?code=AQAL8Y2Rd81YmNAMUEaGbdmkw1YgmSKMoKOXQxzIMrGozwWMG3sdxNH3GrPqm5fS0UMsBqOT7aGVTgooHpc7OFFTU7Om0akGpZujjm5tMj61YKFp0egPt33AjM8SIRtaz4wpucqJTFNxrUFRQfJ8Qj3Yiyy1OB-fn-1AhXYeHcuXRrcgA0u2nd_lhQ-qgrZRiz2yHR9ptcN5Bfl3v38zwPWZS18wzSd-RLC6DSv6UZnddlv54X1IxAztGueKs5VXncvPyMzddzMof0w&state=some-state-of-my-choice