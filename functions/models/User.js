const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String },
    password: { type: String },
    displayName: { type: String },
});

module.exports = User = mongoose.model("user", userSchema);