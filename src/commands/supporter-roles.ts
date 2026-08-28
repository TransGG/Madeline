import { SlashCommandWithSubcommands } from "@hyperneutrino/djs-lite";
import { ApplicationIntegrationType, InteractionContextType, PermissionFlagsBits } from "discord.js";

export default new SlashCommandWithSubcommands({
    name: "supporter-roles",
    description: "Configure self-assignable roles.",
    contexts: [InteractionContextType.Guild],
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    integrationTypes: [ApplicationIntegrationType.GuildInstall],
});
