const { MessageEmbed } = require("discord.js");
let MSGS = require("../models/msgs");
let RECORDS = require("../models/records");
let { RandomString } = require("../utils");

module.exports = async(client, message) => {
    if (message.author.bot || message.channel.type == "DM") return;
    if (["stop recording", "stop", "end recording", "end"].includes(message.content.toLowerCase())) {
        let check = await RECORDS.findOne({ id: message.guildId, channel: message.channelId, author: message.author.id })
        if (check) {
            let key = RandomString(46)
            await new MSGS({
                id: key,
                messages: check.messages
            }).save();
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`**${message.channel} recording has been stopped**\n**[Chat Recording Transcript](${client.config.domain}/transcript/${key})**`)
                ]
            })
            return check.deleteOne();
        }

    };
    let recording = await RECORDS.findOne({ id: message.guildId, channel: message.channelId });
    if (recording && recording.records.includes(message.author.id)) {
        recording.messages.push({
            content: message?.content ?? null,
            author: message.author,
            attachment: message.attachments.first() ?.url?? null,
            date: Date.now()
        });
        await recording.save();
    }
}