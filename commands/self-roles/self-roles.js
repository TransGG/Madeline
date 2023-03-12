const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");
const { embeds, options } = require("./../../config/roles");

exports.slash = async (client, interaction) => {
  // Create the select component
  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("self-roles|menu")
      .setPlaceholder("Choose A Role Group")
  );

  options.map((option) => {
    row.components[0].addOptions({
      label: option.label,
      value: option.value,
      description: option.description,
      emoji: option.emoji,
    });
  });

  const msg = await interaction.channel.send({
    embeds: embeds,
    components: [row],
  });

  interaction.reply({
    content: `Self-Role embed sent to <#${interaction.channel.id}>!`,
    ephemeral: true,
  });
};

exports.select = async (client, interaction, args) => {
  const action = args[0];
  const values = interaction.values;
  const roles = interaction.member.roles.cache.map((role) => role.id);

  if (action == "menu") {
    const group = options.find((option) => option.value == values[0]);
    const multiple = group.multiple;
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`self-roles|role|${group.value}`)
        .setPlaceholder(group.placeholder)
        .setMinValues(0)
        .setMaxValues(multiple ? group.roles.length : 1)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`self-roles|back|${group.value}`)
        .setLabel("Previous Group")
        .setStyle("PRIMARY")
        .setDisabled(group.value == 0),
      new ButtonBuilder()
        .setCustomId(`self-roles|close`)
        .setLabel("Close")
        .setStyle("DANGER"),
      new ButtonBuilder()
        .setCustomId(`self-roles|next|${group.value}`)
        .setLabel("Next Group")
        .setStyle("PRIMARY")
        .setDisabled(group.value == options.length - 1)
    );

    group.roles.map((role) => {
      row.components[0].addOptions({
        default: roles.includes(role.roleID),
        label: role.label,
        value: role.roleID,
        description: role.description,
        emoji: role.emoji,
      });
    });

    let imageEmbed = new EmbedBuilder()
      .setColor(group.color)
      .setImage(group.image);

    let groupEmbed = new EmbedBuilder()
      .setTitle(group.label)
      .setDescription(group.embed_description + "\n‎")
      .setColor(group.color)
      .setImage("https://i.imgur.com/t3zhm4k.png")
      .addFields(
        group.roles.map((role) => ({
          name: `${role.hasOwnProperty("menuEmojiOverride") ? client.emojis.cache.get(role.menuEmojiOverride) : client.emojis.cache.get(role.emoji)} ${role.label}`,
          value: `<@&${role.roleID}>`,
          inline: true,
        }))
      )
      .setFooter({
        text: group.embed_footer,
      });

    interaction.reply({
      content: `Add/Remove a role from the menu below!`,
      embeds: [imageEmbed, groupEmbed],
      components: [row, row2],
      ephemeral: true,
    });
  } else if (action == "role") {
    const group = options.find((option) => option.value == args[1]);

    let added = [];
    let removed = [];

    group.roles.map((role) => {
      if (values.includes(role.roleID)) {
        if (!roles.includes(role.roleID)) {
          interaction.member.roles.add(role.roleID);
          added.push(`<@&${role.roleID}>`);
        }
      } else {
        if (roles.includes(role.roleID)) {
          interaction.member.roles.remove(role.roleID);
          removed.push(`<@&${role.roleID}>`);
        }
      }
    });

    let content = "The following roles have been updated:\n";
    if (added.length > 0) content += `\n***Added:*** ${added.join(", ")}\n`;
    if (removed.length > 0) content += `\n***Removed:*** ${removed.join(", ")}`;

    interaction.reply({
      content: content,
      ephemeral: true,
    });
  } else if (action == "back" || action == "next") {
    const oldGroup = options.find((option) => option.value == args[1]);
    if(action == "back") {
      const oldGroupIndex = options.findIndex((option) => option.value == args[1]);
      if(oldGroupIndex == 0) return interaction.reply({content: "You are already on the first group, you cannot go back further.", ephemeral: true});
      const newGroup = options[oldGroupIndex - 1];

      // TODO: Create a function to handle this
    }
  } else if (action == "close") {
    interaction.update({
      content: `Self-Role embed closed!`,
      embeds: [],
      components: [],
      ephemeral: true,
    });
  }
};

// exports.button = async (client, interaction) => {}

exports.setup = async (client, guilds) => {
  guilds.map((guild) =>
    guild.commands.create({
      name: "self-roles",
      description: "Send the self-roles embed to the current channel",
    })
  );
};
