const {
  ApplicationCommandOptionType,
} = require("discord.js");
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