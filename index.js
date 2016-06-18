'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

let j = 0;

let myYep = {uk:0, us:0, au:0};

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// to post data
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text.toLowerCase()
            if (text === 'yep') {
							  myYep = {uk:0, us:0, au:0};
                yep(sender, 1)
                continue
            }
            sendTextMessage(sender, (j++)+" Text received, echo: " + text.substring(0, 200))
        }
				if (event.postback) {
					let text = JSON.stringify(event.postback)
					yep(sender, event.postback+ `${myYep.uk} ${myYep.us}  ${myYep.au} `)
					//sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
					continue
				}
    }
    res.sendStatus(200)
})


const token = "EAAIGYIOEAgcBANZBxG150it0ymaaZAUyOd85kx4t0aIP82l0NgKHfKcFFzYHWGOdAGcRDSvA5NqUsjPq1i60cdOuPNCnsisABzxZBvRWPnsx18gtzAlI6s1X9HenWCokaUWkAZCYZCS3Y38BUBoiIMDBduCpGz6h5BCg3oVXKEgZDZD"

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
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
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
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


		if(questionNum.startsWith('1')){
				messageData = messageData2;
		}
		if(questionNum.startsWith('2')){
				messageData = messageData3;
		}		
		if(questionNum.endsWith('uk')){
				myYep.uk++;
		}
		if(questionNum.endsWith('us')){
				myYep.us++;
		}
		if(questionNum.endsWith('au')){
				myYep.au++;
		}
		if(questionNum =='1'){
				messageData = messageData1;
		}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
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
