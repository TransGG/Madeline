import { EventHandler } from "@hyperneutrino/djs-lite";
import { Events } from "discord.js";
import { getLinkedRoleForChannel } from "lib/db/schemas/channel-role-links.ts";

export default new EventHandler({
    event: Events.MessageCreate,
    handler: async (message) => {
        if (!message.guild || !message.member || message.author.bot) return;

        const roleId = await getLinkedRoleForChannel(message.channel.id);
        if (!roleId) return;
        if (message.member.roles.cache.has(roleId)) return;

        const role = await message.guild.roles.fetch(roleId);
        if (!role) throw new Error(`Could not fetch linked role \`${roleId}\` for ${message.channel}.`);

        await message.member.roles.add(role, `Adding linked role for message sent in ${message.channel.id}.`);
    },
});
