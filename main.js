const Discord = require('discord.js');

const ZhuBot = new Discord.Client();
const prefix = '!';
const fs = require('fs');

ZhuBot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    ZhuBot.commands.set(command.name, command);
}

ZhuBot.once('ready', () => {
    console.log("ZhuBot Online");
}
);


ZhuBot.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot)
    return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'test'){
        ZhuBot.commands.get('test').execute(message, args);
    }
    else if(command === 'yo'){

    }

});

fs.readFile('key.txt', 'utf8',(err, data) => {
    const key = data;
    ZhuBot.login(key);
})





