exports.button = async (client, interaction) => {
  const roleID = interaction.customId.split("|")[1];
  const role = interaction.guild.roles.cache.get(roleID);
  const member = interaction.member;

  if (member.roles.cache.has(roleID)) {
    member.roles.remove(roleID);
    interaction.reply({
      content: `Removed role ${role.name} from ${member.user.tag}`,
      ephemeral: true,
    });
  } else {
    member.roles.add(roleID);
    interaction.reply({
      content: `Added role ${role.name} to ${member.user.tag}`,
      ephemeral: true,
    });
  }
};
