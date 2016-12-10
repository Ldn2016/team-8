const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
//const couchbase = require("couchbase");
const app = express();
//const config = require("./config");
const bot = require('./scripted');
const freeBot = require('./freeform')
let dataStore = []; 

app.set('port', (process.env.PORT || 80));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

//module.exports.bucket = (new couchbase.Cluster(config.couchbase.server)).openBucket(config.couchbase.bucket);

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
    //console.log(req);
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
                let text = event.postback.payload;
                //console.log(text);
                return bot.resolve(sender, text, function(err, messages) {
                    return messages.forEach(function(message) {
                        //console.log(message);
                        if(message.responses[0]=="Donate"){
                            sendFinalMessage(sender, message.responses);
                            return;
                        }

                        sendTextMessage(sender, message.content);
                        sendMessageWithButtons(sender, message.responses);
                        return;
                    });
                });
            }

            if(event.message.text == "Mum, how was your day?" || event.message.text == "How was your day?"){
                let text = event.message.text;

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

                logData(text);

                return freeBot.resolve(sender, text, function(err, messages) {
                    return messages.forEach(function(message) {
                        //console.log(message);
                        sendTextMessage(sender, message.content);
                        //sendMessageWithButtons(sender, message.responses);
                        return;
                    });
                });
            }
        });
    });
});

// get logged data
app.get('/data', function (req, res) {
    res.send(dataStore);
});

app.get('/data/top/:num', function(req, res) {
    if(dataStore.length<req.params.num){
        res.send("Not enough data.");
    } else {
        res.send(top(dataStore,req.params.num));
    }
});

var top = function(array, num) {
    var map = {};
    var temp;
    var tempArr = array;
    for (let i = 0; i < num; i++) {
        temp = mode(tempArr);
        map[temp[0]] = temp[1];
        tempArr = tempArr.filter(function(element) {
            return element !== temp[0];
        });
    }
    //console.log(map);
    return map;
}

function mode(array) {
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }

    return [maxEl,maxCount];
}

function logData(text){

    dataStore.push(text);
}

// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.PAGE_ACCESS_TOKEN
const token = "EAASf7Opc87QBAE3R8N9ZBb3UbZAhfZAXZCXkOUfQpMoZCZAjF802vavTqDJ3mhdZCEg1TTSvuI8EIGGpvEG5IZCXZAHyu1P0IK2Knsu1sMhcGt7Cmv0fTTKq2wLXq4O2tV5C2mh7yqLlaaAlQz7acmkh4U9MEikWhpgpUBosOQ6xU1wZDZD";

function sendFinalMessage(sender, responses) {
    let buttons = [{
                        "type": "web_url",
                        "url": "https://donate.alzheimersresearchuk.org/publicnew/",
                        "title": "Donate"
                    }, {
                        "type": "web_url",
                        "url": "http://www.alzheimersresearchuk.org/",
                        "title": "Learn More"
                    }, {
                        "type": "postback",
                        "title": "Start again?",
                        "payload": "How was your day?",
                    }];

    var messageData = {
        "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[
                  {
                    "title":"Memory loss is just one of the symptoms victims of dementia can experience.",
                    //"image_url":"http://d7f6b465.ngrok.io/graph",
                    "subtitle":" It can happen to anyone. Dimentia is a disease, which can one day be eliminated. To find out more or to donate to our cause, follow the links below.",
                    "buttons": buttons
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

    let buttons = [];

    for(let i=0; i<responses.length; i++){
        buttons.push({
                        "type":"postback",
                        "title":responses[i],
                        "payload":responses[i]
                      });
    }

    var messageData = {
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[
                  {
                    "title":"You:",
                    //"image_url":"http://d7f6b465.ngrok.io/graph",
                    //"subtitle":"You can help in the fight with dementia:",
                    "buttons": buttons
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