module.exports = async (client) => {
    console.log("\nBot started!\n".rainbow.bold);

    let i = 0
    console.log("\n--- Loading Startup Commands ---\n".magenta);
    client.commands.forEach(async command => {
        let key = client.commands.keyAt(i)
        i++

        if (command.setup) {
            console.log(`Setting up ${key}...`.magenta);
            command.setup(client, await client.guilds.cache)
        }
    });
    console.log("\n--- Done Loading Startup Commands ---\n".magenta);
    
}