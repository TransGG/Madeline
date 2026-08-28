import { EventHandler } from "@hyperneutrino/djs-lite";
import { Events } from "discord.js";
import { getLinkedRoleForChannel } from "lib/db/schemas/channel-role-links.ts";

export default new EventHandler({
    event: Events.MessageCreate,
    async handler(message) {
        if (!message.guild || !message.member || message.author.bot) return;

        const roleId = await getLinkedRoleForChannel(message.channel.id);
        if (!roleId) return;
        if (message.member.roles.cache.has(roleId)) return;

        await message.member.roles.add(roleId, `Adding linked role for message sent in ${message.channel.id}.`);
    },
});
