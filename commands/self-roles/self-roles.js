const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  ButtonBuilder,
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

  let group = options.find((option) => option.value == values[0]);

  if(!group) group = options.find((option) => option.value == args[1]);

  const hasRequirements = group.hasOwnProperty("requirements");
  const hasRequirementsMet = hasRequirements && !group.requirements.some((requirement) => roles.includes(requirement))

  if (action == "menu") {
    await interaction.update({});

    const multiple = group.multiple;
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`self-roles|role|${group.value}`)
        .setPlaceholder(hasRequirementsMet ? "Missing Subscription Requirements" : group.placeholder)
        .setMinValues(0)
        .setMaxValues(multiple ? group.roles.length : 1)
        .setDisabled(hasRequirementsMet)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`self-roles|back|${group.value}`)
        .setLabel("Previous Group")
        .setStyle(2)
        .setDisabled(group.value == 0),
      new ButtonBuilder()
        .setCustomId(`self-roles|close`)
        .setLabel("Close")
        .setStyle(4),
      new ButtonBuilder()
        .setCustomId(`self-roles|next|${group.value}`)
        .setLabel("Next Group")
        .setStyle(2)
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
      .setTitle(`***${group.label}***`)
      .setDescription(group.embed_description + "\n‎")
      .setColor(group.color)
      .setImage("https://raw.githubusercontent.com/TransGG/assets/refs/heads/main/embed-sizer.png")
      .addFields(
        group.roles.map((role) => ({
          name: `${
            role.hasOwnProperty("menuEmojiOverride")
              ? client.emojis.cache.get(role.menuEmojiOverride)
              : client.emojis.cache.get(role.emoji)
          } ${role.label}`,
          value: `<@&${role.roleID}>`,
          inline: true,
        }))
      )
      .setFooter({
        text: group.embed_footer,
      });

    interaction.followUp({
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

    content +=
      "\n> *To close this message click the `Dismiss Message` button below.*";

    interaction.reply({
      content: content,
      ephemeral: true,
    });
  }
};

exports.button = async (client, interaction, args) => {
  let group = null;
  const roles = interaction.member.roles.cache.map((role) => role.id);

  if (args[0] == "close") {
    interaction.deferUpdate();
    return interaction.deleteReply();
  } else if (args[0] == "back") {
    const oldGroupIndex = options.findIndex(
      (option) => option.value == args[1]
    );
    if (oldGroupIndex == 0)
      return interaction.reply({
        content:
          "You are already on the first group, you cannot go back further.",
        ephemeral: true,
      });
    group = options[oldGroupIndex - 1];
  } else if (args[0] == "next") {
    const oldGroupIndex = options.findIndex(
      (option) => option.value == args[1]
    );
    if (oldGroupIndex == options.length - 1)
      return interaction.reply({
        content: "You are already on the last group, you cannot go further.",
        ephemeral: true,
      });
    group = options[oldGroupIndex + 1];
  }

  const hasRequirements = group.hasOwnProperty("requirements");
  const hasRequirementsMet = hasRequirements && !group.requirements.some((requirement) => roles.includes(requirement))

  const multiple = group.multiple;
  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`self-roles|role|${group.value}`)
      .setPlaceholder(hasRequirementsMet ? "Missing Subscription Requirements" : group.placeholder)
      .setMinValues(0)
      .setMaxValues(multiple ? group.roles.length : 1)
      .setDisabled(hasRequirementsMet)
  );
  
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`self-roles|back|${group.value}`)
      .setLabel("Previous Group")
      .setStyle(2)
      .setDisabled(group.value == 0),
    new ButtonBuilder()
      .setCustomId(`self-roles|close`)
      .setLabel("Close")
      .setStyle(4),
    new ButtonBuilder()
      .setCustomId(`self-roles|next|${group.value}`)
      .setLabel("Next Group")
      .setStyle(2)
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
    .setTitle(`***${group.label}***`)
    .setDescription(group.embed_description + "\n‎")
    .setColor(group.color)
    .setImage("https://raw.githubusercontent.com/TransGG/assets/refs/heads/main/embed-sizer.png")
    .addFields(
      group.roles.map((role) => ({
        name: `${
          role.hasOwnProperty("menuEmojiOverride")
            ? client.emojis.cache.get(role.menuEmojiOverride)
            : client.emojis.cache.get(role.emoji)
        } ${role.label}`,
        value: `<@&${role.roleID}>`,
        inline: true,
      }))
    )
    .setFooter({
      text: group.embed_footer,
    });

  await interaction.deferUpdate();
  await interaction.deleteReply();

  await interaction.followUp({
    content: `Add/Remove a role from the menu below!`,
    embeds: [imageEmbed, groupEmbed],
    components: [row, row2],
    ephemeral: true,
  });

  


};

exports.setup = async (client, guilds) => {
  guilds.map((guild) =>
    guild.commands.create({
      name: "self-roles",
      description: "Send the self-roles embed to the current channel",
    })
  );
};
