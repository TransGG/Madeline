const {
    readdir,
    lstatSync
} = require("fs");

const {
    Client,
    GatewayIntentBits,
    Collection
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ]
});

var colors = require('colors');

try {
    client.config = require('./config/config.json');
} catch (e) {
    console.log("Config file not found. Please create a config.json file in the config folder.".red);
    process.exit(1);
}

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    console.log(err.stack);
});

client.commands = new Collection();

readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    console.log("\n--- Loading Events ---\n".yellow);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        console.log(`Loading Event: ${file}`.yellow);
    });
    console.log("\n--- End Loading Events ---\n".yellow);
});


readdir("./commands/", (err, topDir) => {
    let loaded = 0;
    let left = true

    if (err) return console.error(err);
    topDir.forEach(topDirFile => {
        if (!lstatSync(`./commands/${topDirFile}`).isDirectory()) return
        readdir(`./commands/${topDirFile}`, (err, subDir) => {
            if (err) return console.error(err);
            loaded += subDir.length
            if (topDir.indexOf(topDirFile) == topDir.length - 1) left = false

            subDir.forEach(subDirFile => {
                if (client.commands.size == 0) console.log("\n--- Loading Commands ---\n".green)
                let isFile = lstatSync(`./commands/${topDirFile}/${subDirFile}`).isFile()
                if (isFile) {
                    if (!subDirFile.includes(".")) return;
                    let fileSplit = subDirFile.split(".");
                    if (fileSplit.length < 2) return;
                    if (fileSplit[1] != "js") return;
                    let pull = require(`./commands/${topDirFile}/${subDirFile}`)
                    client.commands.set(fileSplit[0], pull)
                    console.log(`Loading Command: ${fileSplit[0]}`.green)
                    if (loaded == client.commands.size && !left) console.log("\n--- End Loading Commands ---\n".green)
                }
            })
        })
    })
});

readdir("./plugins/", (err, files) => {
    console.log("\n--- Loading Plugins ---\n".blue);
    if (err) return console.error(err);
    files.forEach(file => {
        require(`./plugins/${file}`)(client);
        console.log(`Loaded Plugin: ${file}`.blue);
    });
    console.log("\n--- End Loading Plugins ---\n".blue);
});

client.login(client.config.token);