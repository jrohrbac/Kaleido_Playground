const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ImageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: Buffer
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = User = mongoose.model("Image", ImageSchema);