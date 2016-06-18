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

            if(text=="consultation"){
              consultation(sender, age);
              continue
            }
            
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

function consultation(sender, action) {
  let messageData = {}
    let age = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Question #1",
                    "subtitle": "HOW OLD ARE YOU?",
                    "image_url": "http://media.ef.com/sitecore/__/~/media/universal/tiles/2016/1-19x1/tile-language-v2/00.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "7-13",
                        "payload": "age1",
                    }, {
                        "type": "postback",
                        "title": "18-25",
                        "payload": "age3",
                    },{
                        "type": "postback",
                        "title": "19-24",
                        "payload": "age4",
                    },
                     {
                        "type": "postback",
                        "title": "25+",
                        "payload": "age5",
                    }],
                }]
            }
        }
    }
    if(action =="age"){messageData = age;}
    
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
                    "image_url": "http://makione.com/ef/yep-bot/1.png",
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
                    "image_url": "http://makione.com/ef/yep-bot/2.png",
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
                    "image_url": "http://makione.com/ef/yep-bot/3.png",
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
                    "image_url": "http://makione.com/ef/yep-bot/4.png",
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
                    "image_url": "http://makione.com/ef/yep-bot/5.png",
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
                    "title": "YOUR PERSONALITY IS SO BRITISH",
                    "subtitle": "Jolly Good! By your answers it seems like Great Britain, or even Buckingham palace is your second home. Hail a black cab and get a British accent to match your Royal style. Click to proceed to the next step – Your chance to win a trip to live and study in England!",
                    "image_url": "http://makione.com/ef/yep-bot/uk.png",
                    "buttons": [{
                        "type": "web_url",
                        "title": "SHARE YOUR RESULT",
                        url: "https://www.facebook.com/dialog/feed?app_id=406791752862060&redirect_uri=http://www.ef.com/Campaign/2015/YourEnglishPersonality/frontend/close.html&display=popup&name=Have%20I%20told%20you%20I%20am%20from%20England%3F!&caption=www.ef.com/hello&description=My%20personality%20is%20so%20British%20that%20you%20should%20call%20me%20your%20Royal%20Highness!%20Is%20your%20personality%20Australian%2C%20American%20or%20British%3F%20Take%20this%20quiz%20for%20a%20chance%20to%20win%20a%20trip%20to%20live%20and%20study%20abroad!%0A&link=http%3A%2F%2Fwww.ef.com%2Fcampaign%2Fyourenglishpersonality%2F&picture=http%3A%2F%2Fmedia2.ef.com%2F~%2Fmedia%2Fefcom%2Fcampaign%2F2015%2FYourEnglishPersonality%2FFB_English_Quiz_sharing3.png",
                    }, {
                        "type": "web_url",
                        "title": "WIN A TRIP",
                        url: "http://www.ef.com/fp/brochure/04/form/",
                    }, {
                        "type": "postback",
                        "title": "FREE CONSULTATION",
                        "payload": "consultation",
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
                    "title": "YOUR PERSONALITY IS SO AMERICAN",
                    "subtitle": "Howdy Buddy, if we didn’t know better we would have guessed you were American! Whether you would end up in LA, NY or somewhere in between we are sure you would love the American way of life. Now cruise on to get an American accent to match your style. Click to proceed to the next step – Your chance to win a two week language course in the states!",
                    "image_url": "http://makione.com/ef/yep-bot/us.png",
										"buttons": [{
                        "type": "web_url",
                        "title": "SHARE YOUR RESULT",
                        url: "https://www.facebook.com/dialog/feed?app_id=406791752862060&redirect_uri=http://www.ef.com/Campaign/2015/YourEnglishPersonality/frontend/close.html&display=popup&name=I%20am%20secretly%20an%20American!&caption=www.ef.com/hello&description=My%20personality%20is%20so%20American%20I%20could%20be%20a%20Hollywood%20star!%20Would%20you%20like%20to%20have%20my%20autograph%3F%20What%20is%20your%20English-speaking%20personality%3F%20Check%20out%20here%20for%20a%20chance%20to%20win%20a%20trip%20to%20live%20and%20study%20in%20USA%2C%20UK%20or%20Australia!&link=http%3A%2F%2Fwww.ef.com%2Fcampaign%2Fyourenglishpersonality%2F&picture=http%3A%2F%2Fmedia2.ef.com%2F~%2Fmedia%2Fefcom%2Fcampaign%2F2015%2FYourEnglishPersonality%2FFB_English_Quiz_Sharing1.png",
                    }, {
                        "type": "web_url",
                        "title": "WIN A TRIP",
                        url: "http://www.ef.com/fp/brochure/04/form/",
                    }, {
                        "type": "postback",
                        "title": "FREE CONSULTATION",
                        "payload": "consultation",
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
                    "title": "YOUR PERSONALITY IS SO AUSTRALIAN",
                    "subtitle": "G'day Mate, are you sure you are not a fellow Australian? From the beaches to the outback – we are fairly sure you would fit right into the relaxed Australian lifestyle. Hop on like a Kangaroo and match that chilled out Aussie style of yours with a casual Australian accent. Click to proceed to the next step – Your chance to win a trip to live and study down under!",
                    "image_url": "http://makione.com/ef/yep-bot/au.png",
										"buttons": [{
                        "type": "web_url",
                        "title": "SHARE YOUR RESULT",
                        url: "https://www.facebook.com/dialog/feed?app_id=406791752862060&redirect_uri=http://www.ef.com/Campaign/2015/YourEnglishPersonality/frontend/close.html&display=popup&name=Did%20you%20know%20I%20am%20an%20Australian%3F!&caption=www.ef.com/hello&description=I%E2%80%99m%20hoping%20like%20a%20Kangaroo%20with%20joy.%20My%20personality%20is%20a%20perfect%20match%20with%20the%20lifestyle%20in%20the%20land%20down%20under!%20Check%20what%20your%20second%20homeland%20is.%20There%20is%20a%20chance%20to%20win%20a%20trip%20to%20live%20and%20study%20in%20USA%2C%20UK%20or%20Australia!%0A&link=http%3A%2F%2Fwww.ef.com%2Fcampaign%2Fyourenglishpersonality%2F&picture=http%3A%2F%2Fmedia2.ef.com%2F~%2Fmedia%2Fefcom%2Fcampaign%2F2015%2FYourEnglishPersonality%2FFB_English_Quiz_sharing2.png",
                    }, {
                        "type": "web_url",
                        "title": "WIN A TRIP",
                        url: "http://www.ef.com/fp/brochure/04/form/",
                    }, {
                        "type": "postback",
                        "title": "FREE `CONSULTATION`",
                        "payload": "consultation",
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
