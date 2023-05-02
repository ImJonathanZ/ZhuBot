const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Guild } = require("discord.js");

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync("./src/commands");
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith(".js"));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                if ("data" in command && "execute" in command) {
                    commands.set(command.data.name, command);
                    // console.log(`Loaded data: ${command.data}`);
                    commandArray.push(command.data.toJSON());
                    //console.log(`Loaded command: ${commandArray[1]}`);
                    console.log(`Loaded command: ${command.data.name} through commmand handler`);
                } else {
                    console.log(
                        `[WARNING] The command at ../../commands/${folder}/${file} is missing a required "data" or "execute" property.`
                    );
                }
            }
        }
        
        const rest = new REST({ version: "9" }).setToken(process.env.token);
        try {
            console.log("Started refreshing application (/) commands.");
            await rest.put(Routes.applicationCommands(process.env.applicationID), {
                body: client.commandArray,
            });
            console.log("Successfully reloaded application (/) commands.");
        } catch (error) {
            console.error("Failed to reload application (/) commands.");
            console.error(error);
        }
    };
};
