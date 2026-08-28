import { type APIRole, type Interaction, PermissionFlagsBits, Role } from "discord.js";
import assert from "node:assert";

export async function assertRolePermissionsOver(interaction: Interaction, role: Role | APIRole) {
    assert(interaction.guild);

    const me = await interaction.guild.members.fetchMe();

    if (!me.permissions.has(PermissionFlagsBits.ManageRoles))
        throw "I do not have the Manage Roles permission, which is required for this functionality.";

    if (role.managed) throw "That role is managed (e.g. a bot role or the booster role) so I cannot assign it.";

    const fetched = role instanceof Role ? role : await interaction.guild.roles.fetch(role.id);
    assert(fetched);

    if (fetched.comparePositionTo(me.roles.highest) >= 0)
        throw "That role is higher than or equal to my highest role, so I cannot assign it.";
}
