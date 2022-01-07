const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");

module.exports = async(client) => {
    client.user.setActivity(`Transcripting channels`)
    require("../dashboard/index")(client);
    mongoose.connect(client.config.mongodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if (err) return console.error(err);
        console.log(`${client.user.username} database is connected...`)
    });
    console.log(`${client.user.username} bot is connected...`);
    client.guilds.cache.map(guild => {
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
    });
};