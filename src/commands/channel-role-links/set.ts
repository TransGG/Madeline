import { Subcommand } from "@hyperneutrino/djs-lite";
import { ApplicationCommandOptionType } from "discord.js";
import { getAndReplaceLinkedRoleForChannel } from "lib/db/schemas/channel-role-links.ts";
import { assertRolePermissionsOver } from "lib/utils.ts";

export default new Subcommand({
    name: "set",
    description: "Link a channel and a role for auto-assignment.",
    options: [
        {
            type: ApplicationCommandOptionType.Channel,
            name: "channel",
            description: "The channel to link (I will watch messages here)",
            required: true,
        },
        {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            description: "The role to link (I will assign this role to users who send messages in the channel)",
            required: true,
        },
    ],
    async handler(interaction) {
        const rawChannel = interaction.options.getChannel("channel", true);
        const role = interaction.options.getRole("role", true);

        await assertRolePermissionsOver(interaction, role);

        const channel = await interaction.client.channels.fetch(rawChannel.id).catch(() => null);
        if (!channel) throw "Could not fetch that channel. Make sure I have permission to see that channel.";

        const previousRoleId = await getAndReplaceLinkedRoleForChannel(channel.id, role.id);
        const previousRole = previousRoleId && interaction.guild?.roles.cache.get(previousRoleId);

        return `Messages in ${channel} will now result in ${role} being assigned to the author. ${
            previousRole ? `This replaces the previous link from this channel to <@&${previousRole}>.` : ""
        }`;
    },
});
