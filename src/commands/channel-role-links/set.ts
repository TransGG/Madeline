import { Subcommand } from "@hyperneutrino/djs-lite";
import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { getAndReplaceLinkedRoleForChannel } from "lib/db/schemas/channel-role-links.ts";
import assert from "node:assert";

export default new Subcommand({
    name: "set",
    description: "Link a channel and a role for auto-assignment.",
    options: [
        {
            type: ApplicationCommandOptionType.Channel,
            name: "channel",
            description: "The channel to link (I will watch messages here)",
        },
        {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            description: "The role to link (I will assign this role to users who send messages in the channel)",
        },
    ],
    handler: async (interaction) => {
        assert(interaction.guild);

        const me = await interaction.guild.members.fetchMe();

        if (!me.permissions.has(PermissionFlagsBits.ManageRoles))
            throw "I do not have the Manage Roles permission, which is required for this functionality.";

        const rawChannel = interaction.options.getChannel("channel", true);
        const rawRole = interaction.options.getRole("role", true);

        const channel = await interaction.guild.channels.fetch(rawChannel.id).catch(() => null);
        if (!channel) throw "Could not fetch that channel. Make sure I have permission to see that channel.";

        const role = await interaction.guild.roles.fetch(rawRole.id).catch(() => null);
        assert(role, "Failed to fetch role.");

        if (role.managed) throw "That role is managed (e.g. a bot role or the booster role) so I cannot assign it.";

        if (role.comparePositionTo(me.roles.highest) >= 0)
            throw "That role is higher than or equal to my highest role, so I cannot assign it.";

        const previousRoleId = await getAndReplaceLinkedRoleForChannel(channel.id, role.id);
        const previousRole = previousRoleId && interaction.guild.roles.cache.get(previousRoleId);

        return `Messages in ${channel} will now result in ${role} being assigned to the author. ${
            previousRole ? `This replaces the previous link from this channel to <@&${previousRole}>.` : ""
        }`;
    },
});
