import { Subcommand } from "@hyperneutrino/djs-lite";
import { ApplicationCommandOptionType } from "discord.js";
import { removeSelfAssignableRole } from "lib/db/schemas/role-categories.ts";

export default new Subcommand({
    name: "remove",
    description: "Remove a role from being self-assignable by supporters.",
    options: [
        {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            description: "The role to remove",
            required: true,
        },
    ],
    async handler(interaction) {
        const role = interaction.options.getRole("role", true);

        await removeSelfAssignableRole(role.id);
        return `<@&${role.id}> is no longer self-selectable.`;
    },
});
