import { Subcommand } from "@hyperneutrino/djs-lite";
import { listChannelRoleLinks } from "lib/db/schemas/channel-role-links.ts";
import assert from "node:assert";

export default new Subcommand({
    name: "list",
    description: "List currently linked channels and roles.",
    handler: async (interaction) => {
        assert(interaction.guild);

        const links = await listChannelRoleLinks();

        if (links.length === 0) return "There are no channel-role links.";
        if (links.length === 1) return `<#${links[0]?.channelId}> is linked to <@&${links[0]?.roleId}>.`;

        return `The following channels and roles are linked:\n${links.map((link) => `- <#${link.channelId}> -> <@&${link.roleId}>`).join("\n")}`;
    },
});
