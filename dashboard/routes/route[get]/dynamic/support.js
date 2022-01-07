const index = async(fastify, options, done) => {
    fastify.get("/support", async(req, res) => {
        res.redirect(req.client.config.support);
    });
    done()
};

module.exports = index;