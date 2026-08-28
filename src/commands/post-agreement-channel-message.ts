import { SlashCommand } from "@hyperneutrino/djs-lite";
import {
    ApplicationCommandOptionType,
    ApplicationIntegrationType,
    ComponentType,
    InteractionContextType,
    PermissionFlagsBits,
    TextInputStyle,
} from "discord.js";
import { assertRolePermissionsOver } from "lib/utils.ts";

export default new SlashCommand({
    name: "post-agreement-channel-message",
    description: "Post the message for an agree-to-hide channel.",
    contexts: [InteractionContextType.Guild],
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    integrationTypes: [ApplicationIntegrationType.GuildInstall],
    options: [
        {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            description: "The role to assign when the user agrees",
            required: true,
        },
    ],
    async handler(interaction) {
        const role = interaction.options.getRole("role", true);
        await assertRolePermissionsOver(interaction, role);

        await interaction.showModal({
            customId: `::post-agreement:${role.id}`,
            title: "Agreement Message Content",
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            customId: "content",
                            style: TextInputStyle.Paragraph,
                            label: "The content of the message to post",
                        },
                    ],
                },
            ],
        });
    },
});
