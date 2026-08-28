import { Subcommand } from "@hyperneutrino/djs-lite";
import { ApplicationCommandOptionType } from "discord.js";
import { editSelfAssignedRole } from "lib/db/schemas/role-categories.ts";

export default new Subcommand({
    name: "edit",
    description: "Edit the display emoji for a supporter self-assignable role.",
    options: [
        {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            description: "The role to edit",
            required: true,
        },
        {
            type: ApplicationCommandOptionType.String,
            name: "emoji-id",
            description: "The ID of the emoji to display for the role (leave blank to remove)",
        },
    ],
    async handler(interaction) {
        const role = interaction.options.getRole("role", true);
        const dropdownEmojiId = interaction.options.getString("emoji-id") ?? undefined;

        if (dropdownEmojiId && !interaction.client.emojis.cache.has(dropdownEmojiId))
            throw "That does not appear to be a valid emoji ID (it needs to be uploaded to this bot).";

        await editSelfAssignedRole(role.id, dropdownEmojiId);
        return `The display details for <@&${role.id}> have been edited.`;
    },
});
