const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    birthdate: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    subscription: {
        type: String,
        enum: ['basic', 'premium'],
        default: "basic"
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
