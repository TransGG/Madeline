import { Subcommand } from "@hyperneutrino/djs-lite";
import { ApplicationCommandOptionType, MessageFlags } from "discord.js";
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

        const rawChannel = interaction.options.getChannel("channel", true);
        const rawRole = interaction.options.getRole("role", true);

        const channel = await interaction.guild.channels.fetch(rawChannel.id).catch(() => null);
        const role = await interaction.guild.roles.fetch(rawRole.id).catch(() => null);

        if (!channel) {
            return interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: "Could not fetch that channel. Make sure I have permission to see that channel.",
            });
        }

        if (!role) {
            return interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: "Failed to fetch role. This should not be possible; please contact a developer.",
            });
        }

        const me = await interaction.guild.members.fetchMe();
    },
});
