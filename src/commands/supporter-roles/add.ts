import { Subcommand } from "@hyperneutrino/djs-lite";
import { ApplicationCommandOptionType } from "discord.js";
import { addSelfAssignedRole } from "lib/db/schemas/role-categories.ts";
import { assertRolePermissionsOver } from "lib/utils.ts";
import assert from "node:assert";

export default new Subcommand({
    name: "add",
    description: "Add a new supporter self-assignable role.",
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "category",
            description: "The category to which to add the role",
            required: true,
            choices: [
                { name: "Color roles", value: "color" },
                { name: "Icon roles", value: "icon" },
            ],
        },
        {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            description: "The role to add",
            required: true,
        },
        {
            type: ApplicationCommandOptionType.String,
            name: "emoji-id",
            description: "The ID of the emoji to display for the role",
        },
    ],
    async handler(interaction) {
        const category = interaction.options.getString("category", true);
        assert(category === "color" || category === "icon");

        const role = interaction.options.getRole("role", true);
        await assertRolePermissionsOver(interaction, role);

        const dropdownEmojiId = interaction.options.getString("emoji-id") ?? undefined;

        if (dropdownEmojiId && !interaction.client.emojis.cache.has(dropdownEmojiId))
            throw "That does not appear to be a valid emoji ID (it needs to be uploaded to this bot).";

        await addSelfAssignedRole(category, role.id, dropdownEmojiId);
        return `<@&${role.id}> is now selectable as ${category === "color" ? "a color" : "an icon"} role.`;
    },
});
