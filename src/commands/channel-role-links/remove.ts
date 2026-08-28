import { Subcommand } from "@hyperneutrino/djs-lite";
import { ApplicationCommandOptionType } from "discord.js";
import { getAndRemoveLinkedRoleForChannel } from "lib/db/schemas/channel-role-links.ts";
import assert from "node:assert";

export default new Subcommand({
    name: "remove",
    description: "Remove the linked role for a channel.",
    options: [
        {
            type: ApplicationCommandOptionType.Channel,
            name: "channel",
            description: "The channel whose link to remove.",
            required: true,
        },
    ],
    handler: async (interaction) => {
        assert(interaction.guild);

        const channel = interaction.options.getChannel("channel", true);

        const roleId = await getAndRemoveLinkedRoleForChannel(channel.id);
        if (!roleId) throw "That channel is not linked to a role.";
        return `${channel} is no longer linked to <@&${roleId}>.`;
    },
});
