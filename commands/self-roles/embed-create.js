const { ApplicationCommandOptionType } = require("discord.js");

exports.slash = async (client, interaction) => {
    // Get the embed and options
    const embed = interaction.options.getString("embed");
    const options = interaction.options.getString("options");
    const multiple = interaction.options.getBoolean("multiple") ?? false;

    // Get the channel
    const channel = interaction.channel

    // Parse the embed
    const parsedEmbed = JSON.parse(Buffer.from(embed, "base64").toString("utf-8"));

    let parsedOptions = null;

    if(options) 
        parsedOptions = client.parseOptions(options, multiple);

    const msg = await channel.send({ embeds: [parsedEmbed], components: [parsedOptions] });

    interaction.reply({ content: `Embed sent to <#${channel.id}>!`, ephemeral: true });
   
}
// exports.autocomplete = async (client, interaction) => {}
// exports.modal = async (client, interaction) => {}
// exports.select = async (client, interaction) => {}
// exports.button = async (client, interaction) => {}

exports.setup = async (client, guilds) => {
    guilds.map(guild => guild.commands.create({
        name: "embed-create",
        description: "Send an embed to a channel",
        options: [
            {
                name: "embed",
                description: "The base64 code for the embed to",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "options",
                description: "The base64 options for the embed roles.",
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: "multiple",
                description: "Wether or not the user can select multiple roles in this embed.",
                type: ApplicationCommandOptionType.Boolean,
                required: false
            }
        ]
    }));
}
