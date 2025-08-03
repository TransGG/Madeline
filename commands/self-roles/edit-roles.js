const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ApplicationCommandOptionType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { options } = require("../../config/roles");
const { getRoles, setRoles } = require("../../db/db");

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

exports.select = async (client, interaction, args) => {
  if (args[0] == "add-role" && args.length <= 4) {
    await interaction.deferUpdate();

    const group = interaction.values[0];
    const roles = await getRoles(group);

    if (roles.length >= 25) {
      await interaction.editReply({
        content: "This category already has the maximum number of roles (25). You will need to remove an existing role to add another role.",
        components: [],
      });

      return;
    }

    if (roles.some((role) => role.roleID == args[1])) {
      await interaction.editReply({
        content: "This category already has that role.",
        components: [],
      });

      return;
    }

    await interaction.editReply({
      content: "Select the role AFTER WHICH to insert the new option.",
      components: [
        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId(`edit-roles|add-role|${group}|${args[1]}|${args[2]}|${args[3]}`)
            .setPlaceholder("Select a role.")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions({
              label: "[Insert option at start]",
              value: "-",
              description: "Select this to insert the new option at the start of the list.",
              emoji: "⬅️",
            })
            .addOptions(roles.map((role) => ({
              label: role.label,
              value: role.roleID,
              description: role.description,
              emoji: role.emoji,
            }))),
        ),
      ],
    });
  } else if (args[0] == "add-role") {
    await interaction.showModal(
      new ModalBuilder()
        .setCustomId(`edit-roles|add-role|${args[1]}|${args[2]}|${args[3]}|${args[4]}|${interaction.values[0]}`)
        .setTitle("New Role Option")
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("label")
              .setStyle(TextInputStyle.Short)
              .setLabel("Label")
              .setPlaceholder("The label for the dropdown option")
              .setMaxLength(100)
              .setRequired(true),
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("description")
              .setStyle(TextInputStyle.Short)
              .setLabel("Description")
              .setPlaceholder("The description for the dropdown option")
              .setMaxLength(100)
              .setRequired(true),
          ),
        ),
    );
  } else if (args[0] == "remove-role" && args.length <= 1) {
    await interaction.deferUpdate();

    const group = interaction.values[0];
    const roles = await getRoles(group);

    if (roles.length <= 1) {
      await interaction.editReply({
        content: "There are no roles to remove from this group (you cannot remove the last role from a group).",
        components: [],
      });

      return;
    }

    await interaction.editReply({
      content: "Select the role to remove.",
      components: [
        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId(`edit-roles|remove-role|${group}`)
            .setPlaceholder("Select a role.")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(roles.map((role) => ({
              label: role.label,
              value: role.roleID,
              description: role.description,
              emoji: role.emoji,
            }))),
        ),
      ],
    });
  } else if (args[0] == "remove-role") {
    await interaction.update({
      content: "Removing role...",
      components: [],
    });

    const group = args[1];
    let roles = await getRoles(group);
    const target = interaction.values[0];

    const index = roles.findIndex((role) => role.roleID == target);

    if (index == -1) {
      await interaction.editReply("Could not find that role option (perhaps someone else removed it while you were acting).");
      return;
    }

    roles = [...roles.slice(0, index), ...roles.slice(index + 1)];

    await setRoles(group, roles);
    await interaction.editReply("Role removed.");
  } else if (args[0] == "update-role" && args.length <= 3) {
    await interaction.deferUpdate();

    const group = interaction.values[0];
    const roles = await getRoles(group);

    if (roles.length <= 0) {
      await interaction.editReply({
        content: "There are no roles to update in this group.",
        components: [],
      });

      return;
    }

    await interaction.editReply({
      content: "Select the role to update.",
      components: [
        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId(`edit-roles|update-role|${group}|${args[1]}|${args[2]}`)
            .setPlaceholder("Select a role.")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(roles.map((role) => ({
              label: role.label,
              value: role.roleID,
              description: role.description,
              emoji: role.emoji,
            }))),
        ),
      ],
    });
  } else if (args[0] == "update-role") {
    await interaction.showModal(
      new ModalBuilder()
        .setCustomId(`edit-roles|update-role|${args[1]}|${args[2]}|${args[3]}|${interaction.values[0]}`)
        .setTitle("Update Role Option")
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("label")
              .setStyle(TextInputStyle.Short)
              .setLabel("Label (blank = no edit)")
              .setPlaceholder("The label for the dropdown option")
              .setMaxLength(100)
              .setRequired(false),
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("description")
              .setStyle(TextInputStyle.Short)
              .setLabel("Description (blank = no edit)")
              .setPlaceholder("The description for the dropdown option")
              .setMaxLength(100)
              .setRequired(false),
          ),
        ),
    );
  }
}
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