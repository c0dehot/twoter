/*
Tweets

title
thumbnail
createdAt
*/

const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const TweetSchema = new Schema({
    title: { type: String, trim: true, required: "Please enter a title" },
    thumbnail: String,
    createdAt: { type: Date, default: Date.now }
})

// binding "template" to the actual mongo-collection it will be using called 'Tweets'
module.exports = mongoose.model("Tweets", TweetSchema);