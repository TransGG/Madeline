exports.slash = async (client, interaction) => {}
exports.autocomplete = async (client, interaction) => {}
exports.modal = async (client, interaction) => {}
exports.select = async (client, interaction) => {}
exports.button = async (client, interaction) => {}

exports.setup = async (client, guilds) => {
    guilds.map(guild => guild.commands.create({
        name: "base",
        description: "A basic example command",
    }));
}
