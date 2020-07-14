const mongoose = require('mongoose')
const express = require('express')

const PORT = process.env.PORT || 8080

const app = express()

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/twoter",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

// for parsing incoming POST data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// for serving all the normal html
app.use(express.static('public'))


// pull in all the models for it.
// const db = {}
// db.User = require( 'models/Users.js' )
// db.Tweets = require( 'models/Tweets.js' )
const db = require('./models');

// clear our prior data (IIFE aka immediately invoked function expression)
//! ** Note, I had to have the comma after the models in 23, else it was 
//!    viewing this paranthesized items as being parameters for the above require!
(async function () {
    console.log(`.. clearing old users/tweets`)
    await db.User.deleteMany()
    await db.Tweet.deleteMany()
})()

// endpoints
app.get('/tweets', async function (req, res) {
    console.log(`[GET /tweets]`)
    // get the list of tweets
    const userList = await db.User.find({}).populate('tweets')

    res.send(userList)
})

app.post('/tweets', async function (req, res) {
    console.log(`[POST] /tweets, body:`, req.body)
    try {
        // first create a new user if not already exists
        let postingUser;
        let postingUserMatch = await db.User.find({ name: req.body.name }).limit(1)

        if (postingUserMatch.length == 0) {
            console.log(` .. user does not exist, creating them!`)
            // create the user
            postingUser = await db.User.create({ name: req.body.name })
            console.log(` ... added the user, id=${postingUser._id}`)
        } else {
            postingUser = postingUserMatch[0]
            console.log(` ! user already exists, using them, id=${postingUser._id}`)
        }

        console.log(`.. checking if user is unique:`, postingUser)

        // save the tweet
        let postedTweet = await db.Tweet.create({
            title: req.body.title,
            thumbnail: req.body.thumbnail
        })
        console.log(`.. * created tweet: id=${postedTweet._id}`)

        // save the tweet-id to the user list
        console.log(` about to add tweet to the users tweet list:`)

        const updateResult = await db.User.updateOne({ name: req.body.name }, { $push: { tweets: postedTweet._id } })
        console.log(` ... finished adding the tweet to the user: `, updateResult)
        res.send({ status: true, message: "Successfully added tweet" })
    } catch (err) {
        console.log(`x sorry invalid tweet`, err)
        res.send({ status: false, message: `Sorry unable to create tweet: ${err.message}` })
    }
})


app.listen(PORT, function () {
    console.log(`Serving app on: http://localhost:${PORT}`)
})