const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");
const { options } = require("../../config/roles");

exports.slash = async (client, interaction) => {
  const subcommand = interaction.options.getSubcommand(true);

  if (subcommand == "add-role") {
    const role = interaction.options.getRole("role", true);
    
    if (role.comparePositionTo(role.guild.members.me.roles.highest) >= 0) {
      await interaction.reply({
        content: "This role is too high up for this bot to assign.",
        ephemeral: true,
      });

      return;
    }

    const emojiR = interaction.options.getString("emoji", true);
    const menuEmojiR = interaction.options.getString("menu-emoji", false) ?? "";

    const emoji = emojiR.match(/^<a?:[^:]+:\d+>$/) ? emojiR.split(":")[2].slice(0, -1) : emojiR;
    const menuEmoji = menuEmojiR.match(/^<a?:[^:]+:\d+>$/) ? menuEmojiR.split(":")[2].slice(0, -1) : menuEmojiR;

    if (emoji.includes("|") || menuEmoji.includes("|")) {
      await interaction.reply({
        content: "A provided emoji is invalid and appears to break parsing.",
        ephemeral: true,
      });

      return;
    }

    await interaction.reply({
      content: "Choose the role group to which to add the new role option.",
      ephemeral: true,
      components: [
        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId(`edit-roles|add-role|${role.id}|${emoji}|${menuEmoji}`)
            .setPlaceholder("Choose A Role Group")
            .addOptions(options.map((option) => ({
              label: option.label,
              value: option.value,
              description: option.description,
              emoji: option.emoji,
            }))),
        ),
      ],
    });
  } else if (subcommand == "remove-role") {
    await interaction.reply({
      content: "Choose the role group from which to remove the new role option.",
      ephemeral: true,
      components: [
        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("edit-roles|remove-role")
            .setPlaceholder("Choose A Role Group")
            .addOptions(options.map((option) => ({
              label: option.label,
              value: option.value,
              description: option.description,
              emoji: option.emoji,
            }))),
        ),
      ],
    });
  } else if (subcommand == "update-role") {
    const emojiR = interaction.options.getString("emoji", false) ?? "";
    const menuEmojiR = interaction.options.getString("menu-emoji", false) ?? "";

    const emoji = emojiR.match(/^<a?:[^:]+:\d+>$/) ? emojiR.split(":")[2].slice(0, -1) : emojiR;
    const menuEmoji = menuEmojiR.match(/^<a?:[^:]+:\d+>$/) ? menuEmojiR.split(":")[2].slice(0, -1) : menuEmojiR;

    if (emoji.includes("|") || menuEmoji.includes("|")) {
      await interaction.reply({
        content: "A provided emoji is invalid and appears to break parsing.",
        ephemeral: true,
      });

      return;
    }

    await interaction.reply({
      content: "Choose the role group to which the role option to edit belongs.",
      ephemeral: true,
      components: [
        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId(`edit-roles|update-role|${emoji}|${menuEmoji}`)
            .setPlaceholder("Choose A Role Group")
            .addOptions(options.map((option) => ({
              label: option.label,
              value: option.value,
              description: option.description,
              emoji: option.emoji,
            }))),
        ),
      ],
    });
  }
};
exports.setup = async (client, guilds) => {
  guilds.map((guild) =>
    guild.commands.create({
      name: "edit-roles",
      description: "Edit the available self-selectable roles",
      defaultMemberPermissions: '0',
      dmPermission: false,
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "add-role",
          description: "Add a role option",
          options: [
            {
              type: ApplicationCommandOptionType.Role,
              name: "role",
              description: "The role to make self-assignable",
              required: true,
            },
            {
              type: ApplicationCommandOptionType.String,
              name: "emoji",
              description: "The emoji for the option",
              required: true,
            },
            {
              type: ApplicationCommandOptionType.String,
              name: "menu-emoji",
              description: "If set, the emoji to display in the menu, different from the dropdown option",
            }
          ],
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "remove-role",
          description: "Remove a role option",
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "update-role",
          description: "Edit the display of a role option",
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: "emoji",
              description: "The emoji for the option (leave blank to not edit)",
            },
            {
              type: ApplicationCommandOptionType.String,
              name: "menu-emoji",
              description: "If set, the emoji to display in the menu, different from the dropdown option ('-' to remove)",
            }
          ]
        }
      ],
    }),
  );
};