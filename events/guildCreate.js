const { MessageEmbed } = require("discord.js");

module.exports = async(client, guild) => {
    commands = guild ? guild.commands : client.application?.commands
    client.commands.map(cmd => {
        commands.create(cmd.help).catch(async() => {
            await (await (client.users.fetch(guild.ownerId))).send({
                embeds: [
                    new MessageEmbed().setDescription(`**Couldn't set \`slash commands\` on your server \`${guild.name}\`\nUse this: [\`Click me\`](https://discord.com/oauth2/authorize?client_id=927231576427880538&permissions=8&scope=bot%20applications.commands)**`).setColor("RED").setTimestamp()
                ]
            }).catch(() => {});
        });
    });
}