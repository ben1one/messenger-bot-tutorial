'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

let j = 0;

let myYep = {
    uk: 0,
    us: 0,
    au: 0
};

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function(req, res) {
    res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// to post data
app.post('/webhook/', function(req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text.toLowerCase()
            if (text === 'yep') {
                myYep = {
                    uk: 0,
                    us: 0,
                    au: 0
                };
                yep(sender, "0")
                continue
            }
            sendTextMessage(sender, (j++) + " Text received, echo: " + text.substring(0, 200))
        }
        if (event.postback) {
            let text = JSON.stringify(event.postback)
            yep(sender, text)
            console.log(`${myYep.uk} ${myYep.us}  ${myYep.au} `);
            //sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})


const token = "EAAIGYIOEAgcBANZBxG150it0ymaaZAUyOd85kx4t0aIP82l0NgKHfKcFFzYHWGOdAGcRDSvA5NqUsjPq1i60cdOuPNCnsisABzxZBvRWPnsx18gtzAlI6s1X9HenWCokaUWkAZCYZCS3Y38BUBoiIMDBduCpGz6h5BCg3oVXKEgZDZD"

function sendTextMessage(sender, text) {
    let messageData = {
        text: text
    }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: token
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Question #1",
                    "subtitle": "HOW WOULD YOU GREET YOUR FRIEND?",
                    "image_url": "http://content.screencast.com/users/BenSuen/folders/Jing/media/bee319dd-2d2d-48f3-a09b-5e30deec1fbd/2016-06-10_1640.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "G'DAY",
                        "payload": "Payload for 1 element in a generic bubble",
                    }, {
                        "type": "postback",
                        "title": "Hello",
                        "payload": "Payload for 2 element in a generic bubble",
                    }, {
                        "type": "postback",
                        "title": "Hi",
                        "payload": "Payload for 3 element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: token
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function yep(sender, questionNum) {
    let messageData = {};

    let messageData1 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Question #1",
                    "subtitle": "HOW WOULD YOU GREET YOUR FRIEND?",
                    "image_url": "http://content.screencast.com/users/BenSuen/folders/Jing/media/bee319dd-2d2d-48f3-a09b-5e30deec1fbd/2016-06-10_1640.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "G'DAY",
                        "payload": "1-au",
                    }, {
                        "type": "postback",
                        "title": "Hello",
                        "payload": "1-uk",
                    }, {
                        "type": "postback",
                        "title": "Hi",
                        "payload": "1-us",
                    }],
                }]
            }
        }
    };
    let messageData2 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Question #2",
                    "subtitle": "LET'S HAVE SOME BREAKFAST. WHAT WOULD YOU LIKE?",
                    "image_url": "http://content.screencast.com/users/BenSuen/folders/Jing/media/bee319dd-2d2d-48f3-a09b-5e30deec1fbd/2016-06-10_1640.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "VEGEMITE",
                        "payload": "2-au",
                    }, {
                        "type": "postback",
                        "title": "BUTTERMILK PANCAKES",
                        "payload": "2-us",
                    }, {
                        "type": "postback",
                        "title": "SCRAMBLED EGGS BACON & BEAN",
                        "payload": "2-uk",
                    }],
                }]
            }
        }
    }
    let messageData3 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Question #3",
                    "subtitle": "WHICH IS YOUR FAVORITE LANDMARK?",
                    "image_url": "http://content.screencast.com/users/BenSuen/folders/Jing/media/bee319dd-2d2d-48f3-a09b-5e30deec1fbd/2016-06-10_1640.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "STATUE OF LIBERTY",
                        "payload": "3-us",
                    }, {
                        "type": "postback",
                        "title": "OPERA HOUSE",
                        "payload": "3-au",
                    }, {
                        "type": "postback",
                        "title": "BIG BEN",
                        "payload": "3-uk",
                    }],
                }]
            }
        }
    }
		let messageData4 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Question #4",
                    "subtitle": "WE ALL HAVE A PAIR, DON'T WE? WHAT WOULD YOU CALL THEM?",
                    "image_url": "http://content.screencast.com/users/BenSuen/folders/Jing/media/bee319dd-2d2d-48f3-a09b-5e30deec1fbd/2016-06-10_1640.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "SNEAKERS",
                        "payload": "4-us",
                    }, {
                        "type": "postback",
                        "title": "TRAINERS",
                        "payload": "4-uk",
                    }, {
                        "type": "postback",
                        "title": "JOGGERS",
                        "payload": "4-au",
                    }],
                }]
            }
        }
    }
		let messageData5 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Question #5",
                    "subtitle": "WE ARE HALF WAY THROUGH. LET'S BREAK FOR LUNCH! WHAT WOULD YOU LIKE?",
                    "image_url": "http://content.screencast.com/users/BenSuen/folders/Jing/media/bee319dd-2d2d-48f3-a09b-5e30deec1fbd/2016-06-10_1640.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "FISH & CHIPS",
                        "payload": "5-uk",
                    }, {
                        "type": "postback",
                        "title": "HAMBURGER",
                        "payload": "5-us",
                    }, {
                        "type": "postback",
                        "title": "BARBIE",
                        "payload": "5-au",
                    }],
                }]
            }
        }
    }

		let messageUK = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "UK",
                    "subtitle": "WE ARE HALF WAY THROUGH. LET'S BREAK FOR LUNCH! WHAT WOULD YOU LIKE?",
                    "image_url": "http://content.screencast.com/users/BenSuen/folders/Jing/media/bee319dd-2d2d-48f3-a09b-5e30deec1fbd/2016-06-10_1640.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "FISH & CHIPS",
                        "payload": "5-uk",
                    }, {
                        "type": "postback",
                        "title": "HAMBURGER",
                        "payload": "5-us",
                    }, {
                        "type": "postback",
                        "title": "BARBIE",
                        "payload": "5-au",
                    }],
                }]
            }
        }
    }

		let messageUS = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "US",
                    "subtitle": "WE ARE HALF WAY THROUGH. LET'S BREAK FOR LUNCH! WHAT WOULD YOU LIKE?",
                    "image_url": "http://content.screencast.com/users/BenSuen/folders/Jing/media/bee319dd-2d2d-48f3-a09b-5e30deec1fbd/2016-06-10_1640.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "FISH & CHIPS",
                        "payload": "5-uk",
                    }, {
                        "type": "postback",
                        "title": "HAMBURGER",
                        "payload": "5-us",
                    }, {
                        "type": "postback",
                        "title": "BARBIE",
                        "payload": "5-au",
                    }],
                }]
            }
        }
    }

		let messageAU = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "AU",
                    "subtitle": "WE ARE HALF WAY THROUGH. LET'S BREAK FOR LUNCH! WHAT WOULD YOU LIKE?",
                    "image_url": "http://content.screencast.com/users/BenSuen/folders/Jing/media/bee319dd-2d2d-48f3-a09b-5e30deec1fbd/2016-06-10_1640.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "FISH & CHIPS",
                        "payload": "5-uk",
                    }, {
                        "type": "postback",
                        "title": "HAMBURGER",
                        "payload": "5-us",
                    }, {
                        "type": "postback",
                        "title": "BARBIE",
                        "payload": "5-au",
                    }],
                }]
            }
        }
    }

    if (questionNum.indexOf('0') != -1) {
        messageData = messageData1;
    }
    if (questionNum.indexOf('1') != -1) {
        messageData = messageData2;
    }
    if (questionNum.indexOf('2') != -1) {
        messageData = messageData3;
    }
		if (questionNum.indexOf('3') != -1) {
        messageData = messageData4;
    }
		if (questionNum.indexOf('4') != -1) {
        messageData = messageData5;
    }

		//Last Question
		if (questionNum.indexOf('5') != -1) {
        let myArrary = [myYep.uk, myYep.us, myYep.au];
				 		myArrary = myArrary.sort();
				let largetst = 	myArrary[2]	; //Last element
				if(myYep.uk==largetst){messageData = messageUK;}
				if(myYep.us==largetst){messageData = messageUS;}
				if(myYep.au==largetst){messageData = messageAU;}
    }

    if (questionNum.indexOf('uk') != -1) {
        myYep.uk++;
    }
    if (questionNum.indexOf('us') != -1) {
        myYep.us++;
    }
    if (questionNum.indexOf('au') != -1) {
        myYep.au++;
    }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: token
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// spin spin sugar
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
