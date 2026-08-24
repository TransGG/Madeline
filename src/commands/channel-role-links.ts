import { SlashCommandWithSubcommands } from "@hyperneutrino/djs-lite";
import { ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits } from "discord.js";

export default new SlashCommandWithSubcommands({
    name: "channel-role-links",
    description: "Configure channel-to-role links.",
    contexts: [InteractionContextType.Guild],
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    integrationTypes: [ApplicationIntegrationType.GuildInstall],
});
