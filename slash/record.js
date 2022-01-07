let RECORDS = require("../models/records");

module.exports.run = async(client, interaction, options) => {
    let check = await RECORDS.findOne({ id: interaction.guildId, channel: interaction.channelId });
    if (check) return interaction.reply("**There is already recorder in this channel**")
    let channel = interaction.member.guild.channels.cache.get(interaction.channelId);
    interaction.reply("**Provide the ids of people will join the record in the following sort `id, id, id ,...` (3 minutes)**").then(msg => {
        const filter = (m) => m.author.id === interaction.member.id;
        channel.awaitMessages({
            filter,
            time: 3 * 60000,
            max: 1
        }).then(async messages => {
            if (!messages.first()) channel.send("**Timeout, retry again later**")
            else {
                channel.send("**Waiting for their confirmation!**")
                let length = 0
                let ids = [];
                messages.first().content.split(", ").filter(e => e).map(async id => {
                    if(id === interaction.member.id) return;
                    length++
                    let user = await interaction.member.guild.members.cache.get(id);
                    if (!user) {
                        channel.send(`**${id} has been excluded, couldn't find them in the server**`)
                        ids.push(`${id}-declined`);
                    } else {
                        user.send(`**(${interaction.member.displayName}) has requested to record your messages in ${channel} channel (yes, no)**`).then(m => {
                            const filter = (m) => m.author.id === user.id;
                            m.channel.awaitMessages({
                                filter,
                                time: 3 * 60000,
                                max: 1
                            }).then(async messages => {
                                if (!messages.first()) {
                                    user.send("**Timeout, you've been excluded**")
                                    channel.send(`**${user.user.username} has been excluded, didn't respond or dms disabled**`)
                                    ids.push(`${id}-declined`);
                                } else if (["yes", "confirm", "agree"].includes(messages.first().content.toLowerCase())) {
                                    channel.send(`**${user.user.username} will be participating!**`)
                                    user.send(`**Confirmed, You are participating in the chat record at ${channel} channel**`);
                                    ids.push(`${id}-accepted`);
                                } else {
                                    ids.push(`${id}-declined`);
                                    channel.send(`**${user.user.username} has been excluded, they declined**`)
                                    user.send(`**Confirmed, You are not going to participate in the chat record at ${channel} channel**`);
                                }
                                if (ids.length === length) {
                                    let confirmed = [interaction.member.id];
                                    ids.filter(id => id.split("-")[1] == "accepted" ? confirmed.push(id.split("-")[0]) : false);
                                    if (confirmed.length > 1) {
                                        let recording = await RECORDS.findOne({ id: interaction.guildId, channel: interaction.channelId });
                                        if (recording) {
                                            recording.records = confirmed;
                                            recording.channel = interaction.channelId;
                                            recording.author = interaction.member.id;
                                            await recording.save();
                                        } else await new RECORDS({
                                            id: interaction.guildId,
                                            channel: interaction.channelId,
                                            author: interaction.member.id,
                                            records: confirmed
                                        }).save();
                                        channel.send(`**Any new message at ${channel} channel is going to be recorded, type \`stop recording\`, \`stop\`, \`end recording\`, \`end\` to stop recording**`)
                                    } else channel.send("**None of the participators accepted**")
                                };
                            });
                        }).catch(() => {});
                    };
                });

            }
        })
    })
}

module.exports.help = {
    name: "record",
    description: "Record messages between you and some certain people",
    options: []
}

module.exports.requirements = {
    userPerms: ["MANAGE_GUILD"],
    clientPerms: []
}