import { ButtonHandler } from "@hyperneutrino/djs-lite";
import assert from "node:assert";

export default new ButtonHandler(async (interaction, roleId) => {
    assert(roleId);
    assert(interaction.guild);

    const member = await interaction.guild.members.fetch(interaction.user);
    assert(member);

    await member.roles.add(roleId, "Assigning agreement role on user interaction.");

    return `Okay, role assigned.`; // User should not see this message anyway
});
