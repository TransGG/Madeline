module.exports = client => {
    // Call using client.parseOptions() anywhere!
    client.parseOptions = (options, multiple) => {
        // Take in the options in BASE64 and parse them, return back as a Discord.JS select component 

        // Example:
        // [{title: "Hello", description: "World", roleID: "1234567890"}, {title: "Hello", description: "World", roleID: "1234567890" emoji: "324890384"}]

        // Parse the options
        const parsedOptions = JSON.parse(Buffer.from(options, "base64").toString("utf-8"));

        // Create the select component
        const select = new client.Discord.MessageSelectMenu()
            .setCustomId("add-roles")
            .setPlaceholder("Select a role")
            .setMinValues(1)
            .setMaxValues(multiple ? parsedOptions.length : 1);

        parsedOptions.map(option => {
            select.addOptions([
                {
                    label: option.title,
                    description: option.description,
                    value: option.roleID,
                    emoji: option.emoji ? option.emoji : null
                }
            ]);
        });

        return select;

    }
}