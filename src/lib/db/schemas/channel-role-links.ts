import type { ChannelRoleLink } from "lib/types.ts";
import { getMongoCollection } from "../driver.ts";

const collection = getMongoCollection<ChannelRoleLink>("channel-role-links");

export async function getAndReplaceLinkedRoleForChannel(channelId: string, roleId: string) {
    const doc = await collection.findOneAndUpdate({ channelId }, { $set: { roleId } }, { upsert: true });
    return doc?.roleId;
}

export async function getAndRemoveLinkedRoleForChannel(channelId: string) {
    const doc = await collection.findOneAndDelete({ channelId });
    return doc?.roleId;
}

export async function getAndRemoveLinkedChannelForRole(roleId: string) {
    const doc = await collection.findOneAndDelete({ roleId });
    return doc?.channelId;
}

export async function listChannelRoleLinks() {
    return await collection.find().toArray();
}

export async function getLinkedRoleForChannel(channelId: string) {
    const doc = await collection.findOne({ channelId });
    return doc?.roleId;
}
