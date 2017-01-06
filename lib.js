'use strict'

const request = require('request')

var _ = module.exports = {
  userObj: {},
  unquote: function (str, quoteChar) {
    quoteChar = quoteChar || '"';
    if (str[0] === quoteChar && str[str.length - 1] === quoteChar)
    return str.slice(1, str.length - 1);
    else return str;
  },
  setUp: function(token, jsonObj) {
    request({
  		url: 'https://graph.facebook.com/v2.6/me/thread_settings',
  		qs: {access_token:token},
  		method: 'POST',
  		json: jsonObj
  	}, function(error, response, body) {
  		if (error) {
  			console.log('Error setting up: ', error)
  		} else if (response.body.error) {
  			console.log('Error: ', response.body.error)
  		}
  	})
  },
  setGreeting: function (token, txt) {
    let jsonObj = {
      setting_type: "greeting",
      greeting: { text: txt }
    }
  	_.setUp(token, jsonObj)
  },
  setMenu: function (token, setMenuText) {
  	let jsonObj = {
      setting_type: "call_to_actions",
      thread_state: "existing_thread",
      call_to_actions: setMenuText
    }
  	_.setUp(token, jsonObj)
  },
  setGetStarted: function (token) {
    let jsonObj = {
      setting_type: "call_to_actions",
      thread_state: "new_thread",
      call_to_actions: [
        {
          payload: "get_started"
        }
      ]
    }
  	_.setUp(token, jsonObj)
  },
  getPersonalInfo: function (token, sender, btnArr, greeting) {
    let uri = 'https://graph.facebook.com/v2.6/'+_.unquote(sender, '"');
    request({
  		url: uri,
  		qs: {
        fields: 'first_name,last_name,profile_pic,locale,timezone,gender',
        access_token: token
      },
  		method: 'GET'
  	}, function(error, response, body) {
      body = _.unquote(body, "'");
      body = JSON.parse(body);

      _.userObj.firstName = body.first_name;
      _.userObj.lastName = body.last_name;
      _.userObj.proPic = body.profile_pic;
      _.userObj.locale = body.locale;
      _.userObj.timezone = body.timezone;
      _.userObj.gender = body.gender;

  		if (error) {
  			console.log('Error getting personal info: ', error)
  		} else if (response.body.error) {
        console.log('Error: ', response.body.error)
  		}

      sender = ""+sender;
      _.sendButtonMessage(token, sender, "Hello "+_.userObj.firstName+", "+greeting, btnArr);

  	})
  },
  sendMessage: function(token, sender, msgObj) {
  	request({
  		url: 'https://graph.facebook.com/v2.6/me/messages',
  		qs: {access_token:token},
  		method: 'POST',
  		json: {
  			recipient: {id: sender},
  			message: msgObj,
  		}
  	}, function(error, response, body) {
  		if (error) {
  			console.log('Error sending message: ', error)
  		} else if (response.body.error) {
  			console.log('Error: ', response.body.error)
  		}
  	})
  },
  sendButtonMessage: function (token, sender, question, btnArr) {
  	let messageData = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: question,
          buttons: btnArr
        }
      }
    }

  	_.sendMessage(token, sender, messageData)
  },
  sendTextMessage: function (token, sender, text) {
  	_.sendMessage(token, sender, { text:text })
  },
  sendFile: function (token, sender, fileUrl) {
  	let messageData = {
      attachment: {
        type: "file",
        payload: {
          url: fileUrl
        }
      }
    }
    _.sendMessage(token, sender, messageData)
  },
  sendImage: function (token, sender, imgUrl) {
  	let messageData = {
      attachment: {
        type: "image",
        payload: {
          url: imgUrl
        }
      }
    }
    _.sendMessage(token, sender, messageData)
  },
  sendAudio: function (token, sender, audioUrl) {
  	let messageData = {
      attachment: {
        type: "audio",
        payload: {
          url: audioUrl
        }
      }
    }
    _.sendMessage(token, sender, messageData)
  },
  sendLocation: function (token, sender, text) {
    let messageData = {
      text: text,
      quick_replies: [{ content_type: "location" }]
    }
    _.sendMessage(token, sender, messageData)
  },
  sendQuickReplies: function (token, sender, replyObj) {
  	let messageData = {
      text: replyObj.text,
      quick_replies: replyObj.quick_replies
    }
    _.sendMessage(token, sender, messageData)
  },
  sendGenericMessage: function (token, sender) {
  	let messageData = {
  		"attachment": {
  			"type": "template",
  			"payload": {
  				"template_type": "generic",
  				"elements": [{
  					"title": "First card",
  					"subtitle": "Element #1 of an hscroll",
  					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
  					"buttons": [{
  						"type": "web_url",
  						"url": "https://www.messenger.com",
  						"title": "web url"
  					}, {
  						"type": "postback",
  						"title": "Postback",
  						"payload": "Payload for first element in a generic bubble",
  					}],
  				}, {
  					"title": "Second card",
  					"subtitle": "Element #2 of an hscroll",
  					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
  					"buttons": [{
  						"type": "postback",
  						"title": "Postback",
  						"payload": "Payload for second element in a generic bubble",
  					}],
  				}]
  			}
  		}
  	}
  	_.sendMessage(token, sender, messageData)
  }

};
