const { Schema, model } = require("mongoose");

module.exports = model("msgs", new Schema({
    id: { type: String, default: "" },
    messages: { type: Object, default: {}},
    date: { type: Number, default: Date.now()}
}));