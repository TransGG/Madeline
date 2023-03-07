module.exports = client => {
    // Called from a command with a requirements array including "example"
    client.requirements.example = (interaction) => {
        if (interaction.user.id == "123456") return false;
        return true;
    }
}