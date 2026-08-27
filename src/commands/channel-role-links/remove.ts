import { SlashCommand } from "@hyperneutrino/djs-lite";
import { ApplicationCommandOptionType } from "discord.js";
import assert from "node:assert";

export default new SlashCommand({
    name: "remove",
    description: "Remove the linked role for a channel or vice versa.",
    options: [
        {
            type: ApplicationCommandOptionType.Channel,
            name: "channel",
            description: "The channel whose link to remove",
            required: false,
        },
        {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            description: "The role whose link to remove",
            required: false,
        },
    ],
    handler: async (interaction) => {
        assert(interaction.guild);
    },
});
