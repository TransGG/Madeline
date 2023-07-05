const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = (client) => {
  client.parseButtons = (buttons) => {
    // [{"label": "Hello", "style": 2, "roleID": "1234567890"}]

    const parsedButtons = JSON.parse(
      Buffer.from(buttons, "base64").toString("utf-8")
    );

    const row = new ActionRowBuilder();

    parsedButtons.map((button) => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`add-role|${button.roleID}`)
          .setLabel(button.label)
          .setStyle(button.style ? button.style : 1)
      );
    });

    return row;
  };
};
