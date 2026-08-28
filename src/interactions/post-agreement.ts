import { ModalHandler } from "@hyperneutrino/djs-lite";
import { ButtonStyle, ComponentType, PermissionFlagsBits } from "discord.js";
import assert from "node:assert";

export default new ModalHandler(async (interaction, roleId) => {
    assert(roleId);
    assert(interaction.guild);
    assert(interaction.channel?.isSendable());

    const me = await interaction.guild.members.fetchMe();

    if (!me.permissions.has(PermissionFlagsBits.ManageRoles))
        throw "I do not have the Manage Roles permission, which is required for this functionality.";

    const role = await interaction.guild.roles.fetch(roleId);
    assert(role, "Failed to fetch role.");

    if (role.managed) throw "That role is managed (e.g. a bot role or the booster role) so I cannot assign it.";

    if (role.comparePositionTo(me.roles.highest) >= 0)
        throw "That role is higher than or equal to my highest role, so I cannot assign it.";

    await interaction.channel.send({
        content: interaction.fields.getTextInputValue("content"),
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Secondary,
                        customId: `::assign-role:${roleId}`,
                        label: "I understand, please hide this channel.",
                    },
                ],
            },
        ],
    });

    return "Agreement message posted.";
});
