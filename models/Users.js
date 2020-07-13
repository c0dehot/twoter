/*
Users 
name
location
tweets: [ their list of tweets ]
createdAt
*/

const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: "Username is REQUIRED" },
    location: String,
    tweets: [{ type: Schema.Types.ObjectId, ref: "Tweets" }],
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Users", UserSchema);