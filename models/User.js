const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Todo: change type to binData for images
const ImgSchema = new Schema({ name: String, image: Buffer });

// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        required: true
    },
    pictures: {
        type: [ImgSchema],
        required: true
    }
});

module.exports = User = mongoose.model("users", UserSchema);
