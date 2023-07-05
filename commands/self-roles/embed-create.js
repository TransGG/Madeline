const { ApplicationCommandOptionType } = require("discord.js");

exports.slash = async (client, interaction) => {
  let data = interaction.options.getString("data");
  let buttons = interaction.options.getString("buttons");

  const channel = interaction.channel;

  const parsedJSON = JSON.parse(Buffer.from(data, "base64").toString("utf-8"))
    .messages[0].data;

  if (buttons) parsedJSON.components = [client.parseButtons(buttons)];

  const msg = await channel.send(parsedJSON);

  interaction.reply({
    content: `Embed sent to <#${channel.id}>!`,
    ephemeral: true,
  });
};

exports.setup = async (client, guilds) => {
  guilds.map((guild) =>
    guild.commands.create({
      name: "embed-create",
      description: "Send an embed to a channel",
      options: [
        {
          name: "data",
          description: "The base64 code for the data",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "buttons",
          description: "The base64 buttons for the embed roles.",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    })
  );
};
