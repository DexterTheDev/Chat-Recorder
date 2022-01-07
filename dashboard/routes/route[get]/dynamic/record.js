let MSGS = require("../../../../models/msgs");
let moment = require("moment");

const index = async(fastify, options, done) => {
    fastify.get("/transcript/:record", async(req, res) => {
        if (!req.params.record) res.send("Unknow transcript");
        else {
            let record = await MSGS.findOne({ id: req.params.record })
            if (!record) res.send("Unknow transcript")
            else {
                if (record.messages.length <= 0) {
                    record.deleteOne();
                    res.send("Unknow transcript");
                } else {
                    await record.messages.map(async msg => {
                        msg.avatar = (await req.client.users.fetch(msg.author.id).catch(() => {})).displayAvatarURL();
                        msg.dateNow = moment(msg.date).format('DD/MM/YY hh:mm A');
                        msg.media = msg.attachment?.endsWith(".mp4") ? "video" : msg.attachment?.endsWith(".mp3") ? "music" : "attach"

                        let mention = msg.content.split("<@!")[1] || msg.content.split("<@")[1];
                        msg.content = mention ? msg.content?.replace(`<@${msg.content.split("<@!")[1] ? "!" : ""}${mention?.split(">")[0]}>`, `<a target="_blank" href="https://discord.com/users/${mention?.split(">")[0]}" class="bg-blurple-200 text-blurple-300 rounded px-1 hover:underline">@${(await req.client.users.fetch(mention?.split(">")[0]).catch(() => {}))?.username ?? "Null"}</a>`) : msg.content;
                    })
                    req.render("./dynamic/records.liquid", { msgs: await record.messages })
                }
            }
        }
    });

    done()
};

module.exports = index;