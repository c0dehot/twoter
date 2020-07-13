const mongoose = require('mongoose')
const express = require('express')

const PORT = process.env.PORT || 8080

const app = express()

// for parsing incoming POST data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// for serving all the normal html
app.use(express.static('public'))


// pull in all the models for it.
// const db = {}
// db.User = require( 'models/Users.js' )
// db.Tweets = require( 'models/Tweets.js' )
const db = require('./models')

// endpoints
app.get('/tweets', async function (req, res) {
    // get the list of tweets
    const userList = await db.User.find({}).populate('tweets')

    res.send(userList)
})

app.post('/tweets', async function (req, res) {
    // first create a new user if not already exists
    let postingUser = db.User.find({ name: req.body.name })
    if (!postingUser._id) {
        // create the user
        postingUser = db.User.create({ name: req.body.name })
    }

    // save the tweet
    let postedTweet = db.Tweet.create({
        title: req.body.title,
        thumbnail: req.body.thumbnail
    })

    // save the tweet-id to the user list
    //! BUGBUG: fix PUSH
    db.User.updateOne({ name: req.body.name }, { $push: { postedTweet._id } })
})


app.listen(PORT, function () {
    console.log(`Serving app on: http://localhost:${PORT}`)
})