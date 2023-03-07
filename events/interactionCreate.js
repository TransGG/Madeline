module.exports = async (client, interaction) => {

    async function runAction(type, commandName, args = []) {
        const command = client.commands.get(commandName)
        if (!command) return console.log(`Command "${commandName}" not found`.red)
        if (command[type]) {

            // Run all the checks
            if (command.requirements && command.requirements[type]) {
                let failed = false;
                for (var i = 0; i < command.requirements[type].length; i++) {
                    let requirement = command.requirements[type][i];

                    // run the client.requirement with the same name
                    if (!client.checks[requirement]) {
                        console.log(`Requirement function "${requirement}" not found`.red)
                        failed = true;
                        break;
                    }

                    if (!await client.checks[requirement](interaction)) {
                        failed = true;
                        break;
                    }

                }
                if (failed) return;
            }

            command[type](client, interaction, args)

        } else return console.log(`Command "${commandName}" does not have a "${type}" action associated with it`.red)
    }

    if (interaction.isChatInputCommand()) runAction("slash", interaction.commandName)
    if (interaction.isAutocomplete()) runAction("autocomplete", interaction.commandName)

    if(interaction.isModalSubmit() || interaction.isSelectMenu() || interaction.isButton()) {
        const commandName = interaction.customId.split("/")[0]
        const args = interaction.customId.split("/").slice(1)
        if (interaction.isModalSubmit()) runAction("modal", commandName, args)
        if (interaction.isSelectMenu())runAction("select", commandName, args)
        if (interaction.isButton()) runAction("button", commandName, args)
    }

    // Not handled at the current time.
    if (interaction.isMessageContextMenuCommand()) console.log("Message Context Menu Command")
    if (interaction.isUserContextMenuCommand()) console.log("User Context Menu Command")

}