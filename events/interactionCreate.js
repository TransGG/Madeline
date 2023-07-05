module.exports = async (client, interaction) => {
  async function runAction(type, commandName, args = []) {
    const command = client.commands.get(commandName);
    if (!command) return console.log(`Command "${commandName}" not found`.red);
    if (command[type]) {
      command[type](client, interaction, args);
    } else
      return console.log(
        `Command "${commandName}" does not have a "${type}" action associated with it`
          .red
      );
  }

  if (interaction.isChatInputCommand())
    runAction("slash", interaction.commandName);
  if (interaction.isAutocomplete())
    runAction("autocomplete", interaction.commandName);

  if (
    interaction.isModalSubmit() ||
    interaction.isStringSelectMenu() ||
    interaction.isButton()
  ) {
    const commandName = interaction.customId.split("|")[0];
    const args = interaction.customId.split("|").slice(1);
    if (interaction.isModalSubmit()) runAction("modal", commandName, args);
    if (interaction.isStringSelectMenu())
      runAction("select", commandName, args);
    if (interaction.isButton()) runAction("button", commandName, args);
  }

  // Not handled at the current time.
  if (interaction.isMessageContextMenuCommand())
    console.log("Message Context Menu Command");
  if (interaction.isUserContextMenuCommand())
    console.log("User Context Menu Command");
};
