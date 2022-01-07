const { Schema, model } = require("mongoose");

module.exports = model("records", new Schema({
    id: { type: String, default: "" },
    channel: { type: String, default: "" },
    author: { type: String, default: "" },
    records: { type: Array, default: [] },
    messages: { type: Array, default: [] }
}));