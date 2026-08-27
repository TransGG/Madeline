import type { ChannelRoleLink } from "lib/types.ts";
import { getMongoCollection } from "../driver.ts";

const collection = getMongoCollection<ChannelRoleLink>("channel-role-links");

export async function getAndReplaceLinkedRoleForChannel(channelId: string, roleId: string) {
    const doc = await collection.findOneAndUpdate({ channelId }, { $set: { roleId } }, { upsert: true });
    return doc?.roleId;
}
