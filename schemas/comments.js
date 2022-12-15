const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    postId:{
        type: Number,
        required: true
    },
    commentId:{
        type: Number,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }    
})

module.exports = mongoose.model("Comments", commentsSchema);