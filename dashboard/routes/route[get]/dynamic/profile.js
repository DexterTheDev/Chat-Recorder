let MSGS = require("../../../../models/msgs");

const index = async(fastify, options, done) => {
    fastify.get("/profile", async(req, res) => {
        if (!(await req.user)) res.redirect("/auth");
        else {
            let ids = []
            await (await MSGS.find({})).filter(message => {
                message.messages.map(async msg => {
                    if (msg.author.id == (await req.user).id) return !ids.includes(message.id) ? ids.push(message.id) : ""
                })
            });
            req.render("./dynamic/profile.liquid", { ids, avatar: (await req.client.users.fetch((await req.user).id).catch(() => {})).displayAvatarURL() })
        }
    });
    done();
};

module.exports = index;