const index = async(fastify, options, done) => {

    fastify.get("/", async(req, res) => {
        req.render("index.liquid")
    });

    done()
};

module.exports = index;