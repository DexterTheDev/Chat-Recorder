const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
    const { port } = require("../config");
    const fastify = require('fastify')({ logger: false });
    const { Liquid } = require("liquidjs");
    const path = require("path");

    const engine = new Liquid({
        root: path.join(__dirname, "components"),
        extname: ".liquid",
    });

    require("./routes.json").map(route => {
        fastify.register(require(route));
    })

    fastify.register(require('fastify-static'), {
        root: path.join(__dirname, 'public'),
        prefix: '/public/'
    });

    fastify.register(require("point-of-view"), {
        engine: {
            liquid: engine,
        },
    });

    fastify.register(require('fastify-secure-session'), {
        cookieName: 'connect.sid',
        secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
        cookie: {
            path: '/',
            maxAge: 86400000000
        },
        saveUninitialized: false
    });

    fastify.addHook('preHandler', (req, res, done) => {
        req.user = getUser(req.session.get('token_type'), req.session.get('access_token'));
        req.client = client;
        req.render = async(file, data = {}) => {
            req.session.set("callback", req.url);
            const baseData = {
                client,
                user: await req.user ? await client.users.fetch((await req.user).id).catch(() => {}) : null,
            };
            res.view(`\\dashboard\\components\\${file}`, Object.assign(baseData, data))
        }
        done()
    });

    fastify.setErrorHandler(async(error, request, reply) => {
        client.channels.cache.get(client.config.logs).send({
            embeds: [new MessageEmbed()
                .setTitle(`Visitor: ${await request.user ? (await request.user).username : "Anonymous"}`)
                .setDescription(`\`\`\`diff\n+ ERROR ${reply.statusCode}\`\`\`\`\`\`js\n${error}\`\`\``)
                .setTimestamp()
                .setColor("RED")
                .setFooter({ text: "Automatically sent error from the site" })
            ]
        })
        request.render("./handlers/error.liquid", { status: reply.statusCode })
    });

    fastify.setNotFoundHandler(async(request, reply) => {
        request.render("./handlers/error.liquid", { status: 404 })
    })

    const start = async() => {
        try {
            await fastify.listen(port);
            console.log(`${client.user.username} website is connected...`);
        } catch (error) {
            fastify.log.error(error);
            process.exit(1);
        }
    }
    start();
};

const getUser = async(type, access) => {
    if (type && access) {
        const userData = require("axios").get('https://discord.com/api/users/@me', {
            responseType: 'json',
            headers: {
                authorization: `${type} ${access}`
            }
        }).catch(() => {});
        const userGuilds = require("axios").get('https://discord.com/api/users/@me/guilds', {
            responseType: 'json',
            headers: {
                authorization: `${type} ${access}`
            }
        }).catch(() => {});

        let user = Object.assign((await userData)?.data ?? "", (await userGuilds)?.data ?? "");
        return user ? user : null;
    }
}