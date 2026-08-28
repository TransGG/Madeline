import type { RoleCategory } from "lib/types.ts";
import assert from "node:assert";
import { getMongoCollection, withSession } from "../driver.ts";

const collection = getMongoCollection<RoleCategory>("role-categories");

export async function addSelfAssignedRole(
    category: "color" | "icon",
    roleId: string,
    dropdownEmojiId: string | undefined,
) {
    await withSession((session) =>
        session.withTransaction(async (session) => {
            const overlap = await collection.countDocuments({ roles: { $elemMatch: { roleId } } }, { session });
            if (overlap > 0) throw "That role is already self-selectable.";

            const doc = await collection.findOne({ category });
            if (doc && doc.roles.length >= 25) throw "That category has the maximum number of roles (25) already.";

            await collection.updateOne(
                { category },
                { $push: { roles: { roleId, dropdownEmojiId } } },
                { upsert: true, session },
            );
        }),
    );
}

export async function editSelfAssignedRole(roleId: string, dropdownEmojiId: string | undefined) {
    const { modifiedCount } = await collection.updateOne(
        { roles: { $elemMatch: { roleId } } },
        dropdownEmojiId
            ? { $set: { "roles.$[element].dropdownEmojiId": dropdownEmojiId } }
            : { $unset: { "roles.$[element].dropdownEmojiId": 1 } },
        { arrayFilters: [{ "element.roleId": roleId }] },
    );

    if (modifiedCount === 0) throw "That is not a self-assignable role.";
}

export async function removeSelfAssignableRole(roleId: string) {
    const { modifiedCount } = await collection.updateOne(
        { roles: { $elemMatch: { roleId } } },
        { $pull: { roles: { roleId } } },
    );
    if (modifiedCount === 0) throw "That is not a self-assignable role.";
}

export async function listSelfAssignableRoles(category: "color" | "icon") {
    const doc = await collection.findOne({ category });
    return doc?.roles ?? [];
}

export async function reorderRole(roleId: string, position: number) {
    await withSession((session) =>
        session.withTransaction(async (session) => {
            const doc = await collection.findOne({ roles: { $elemMatch: { roleId } } }, { session });
            if (!doc) throw "That is not a self-assignable role.";

            if (position > doc.roles.length) throw "That position is beyond the number of roles in the category.";

            const index = doc.roles.findIndex((role) => role.roleId === roleId);
            assert(index !== -1);
            assert(doc.roles[index]);

            const roles = doc.roles.slice(0, index).concat(doc.roles.slice(index + 1));
            roles.splice(position - 1, 0, doc.roles[index]);

            await collection.updateOne({ roles: { $elemMatch: { roleId } } }, { $set: { roles } }, { session });
        }),
    );
}
