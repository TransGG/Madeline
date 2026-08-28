import { SlashCommand } from "@hyperneutrino/djs-lite";
import {
    ApplicationIntegrationType,
    Colors,
    ComponentType,
    InteractionContextType,
    MessageFlags,
    PermissionFlagsBits,
    SeparatorSpacingSize,
} from "discord.js";
import assert from "node:assert";

export default new SlashCommand({
    name: "post-role-prompt",
    description: "Post the root role prompt for self-assigning supporter roles.",
    contexts: [InteractionContextType.Guild],
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    integrationTypes: [ApplicationIntegrationType.GuildInstall],
    async handler(interaction) {
        assert(interaction.channel?.isSendable());

        await interaction.channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [
                {
                    type: ComponentType.Container,
                    accentColor: Colors.Blue,
                    components: [
                        {
                            type: ComponentType.MediaGallery,
                            items: [
                                {
                                    media: {
                                        url: "https://github.com/TransGG/assets/blob/main/roles-index-header.png?raw=true",
                                    },
                                },
                            ],
                        },
                        { type: ComponentType.Separator, spacing: SeparatorSpacingSize.Large },
                        {
                            type: ComponentType.TextDisplay,
                            content: `# Self Roles\nWelcome to the premium self-selectable role directory! You can select a color role and an item role (if you're Supporter+ or above). Please select a group.`,
                        },
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.StringSelect,
                                    customId: "::select-category",
                                    options: [
                                        {
                                            label: "Color Roles (Supporter and above)",
                                            value: "color",
                                            description: "Select or remove a supporter-only color role.",
                                        },
                                        {
                                            label: "Icon Roles (Supporter+ and above)",
                                            value: "icon",
                                            description: "Select or remove an icon role.",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        return "Role prompt posted.";
    },
});
