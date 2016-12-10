const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const bot = require('./scripted');

app.set('port', (process.env.PORT || 80));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// index
app.get('/', function (req, res) {
    res.send('hello world i am a secret bot')
});

// for facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'verify_token') {
        return res.send(req.query['hub.challenge'])
    }
    return res.send('Error, wrong token')
});

// to post data
app.post('/webhook/', function (req, res) {
    let data = req.body;
    if(data.object !== 'page') {
        return;
    }

    let pageEntry = data.entry;

    res.send();
    return pageEntry.forEach(function(entry) {
        return entry.messaging.forEach(function(event) {
            let sender = event.sender.id;
            //console.log(sender);
            
            if(event.postback != undefined) {
                var text = event.postback.payload;
                //console.log(text);
                return bot.resolve(sender, text, function(err, messages) {
                    return messages.forEach(function(message) {
                        //console.log(message);
                        sendTextMessage(sender, message.content);
                        sendMessageWithButtons(sender, message.responses);
                        return;
                    });
                });
            }


            if (event.message && event.message.text) {
                let text = event.message.text;
                return bot.resolve(sender, text, function(err, messages) {
                    return messages.forEach(function(message) {
                        console.log(message);
                        sendTextMessage(sender, message.content);
                        sendMessageWithButtons(sender, message.responses);
                        return;
                    });
                });
            }
        });
    });
});


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.PAGE_ACCESS_TOKEN
const token = "EAASf7Opc87QBAE3R8N9ZBb3UbZAhfZAXZCXkOUfQpMoZCZAjF802vavTqDJ3mhdZCEg1TTSvuI8EIGGpvEG5IZCXZAHyu1P0IK2Knsu1sMhcGt7Cmv0fTTKq2wLXq4O2tV5C2mh7yqLlaaAlQz7acmkh4U9MEikWhpgpUBosOQ6xU1wZDZD";

function sendTextMessage(sender, text) {
    let messageData = { text:text };

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
    });
}

function sendMessageWithButtons(sender, responses) {

    var messageData = {
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[
                  {
                    "title":"What would you like to say?",
                    //"image_url":"http://d7f6b465.ngrok.io/graph",
                    //"subtitle":"You can help in the fight with dementia:",
                    "buttons":[
                      {
                        "type":"postback",
                        "title":responses[0],
                        "payload":responses[0]
                      }
                    ]
                  }
                ]
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
    });
}

function sendGenericMessage(sender) {
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
    };
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
    });
}

// spin spin sugar
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
});