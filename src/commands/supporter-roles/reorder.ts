import { Subcommand } from "@hyperneutrino/djs-lite";
import { ApplicationCommandOptionType } from "discord.js";
import { reorderRole } from "lib/db/schemas/role-categories.ts";
import assert from "node:assert";

export default new Subcommand({
    name: "reorder",
    description: "Reorder the supporter self-selectable roles.",
    options: [
        {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            description: "The role to move",
            required: true,
        },
        {
            type: ApplicationCommandOptionType.Integer,
            name: "position",
            description: "The position in which to place the role (1 = first)",
            required: true,
        },
    ],
    async handler(interaction) {
        assert(interaction.guild);

        const role = interaction.options.getRole("role", true);
        const position = interaction.options.getInteger("position", true);

        await reorderRole(role.id, position);
        return `<@&${role.id}> has been moved to #${position} within its category.`;
    },
});
