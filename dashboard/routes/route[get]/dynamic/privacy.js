const index = async(fastify, options, done) => {
    fastify.get("/privacy", async(req, res) => {
        req.render("./dynamic/privacy.liquid")
    });
    done();
};

module.exports = index;