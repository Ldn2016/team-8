const talkify = require('talkify');

const Bot = talkify.Bot;

const BotTypes = talkify.BotTypes;

const SingleLineMessage = BotTypes.SingleLineMessage;

const TrainingDocument = BotTypes.TrainingDocument;
const Skill = BotTypes.Skill;

const freeBot = new Bot();

freeBot.trainAll([
    new TrainingDocument('Hello','hello?'),
     
    new TrainingDocument('Time', 'time?')
], function () {
    console.log(' freeBot> Ready.');
});

const hello = new Skill('Hello', 'Hello', function (context, request, response) {

    return response.send(messagePicker(context, "Hello, my son, Ivan the Great!", "Hello?", "I don't know you!!!"));
});

const time = new Skill('Time', 'Time', function (context, request, response) {

    return response.send(messagePicker(context, "It's two o'clock.", "Its morning i think?", "What year is it?"));
});

freeBot.addSkill(hello);
freeBot.addSkill(time);

const messagePicker = function(context, msg1, msg2, msg3){
    let message = {};
    console.log(context);
    if(context.repeat === undefined) {
        console.log("context.repeat === null");
        context.repeat = 0;
        message = new SingleLineMessage(msg1);
    }
    else if(context.repeat < 5) message = new SingleLineMessage(msg1);
    else if(context.repeat < 10) message = new SingleLineMessage(msg2);
    else if(context.repeat < 15) message = new SingleLineMessage(msg3);
    else {
        context.repeat = 0;
        console.log("reseting!");
        message = new SingleLineMessage(msg3);
    } 

    context.repeat++;
    return message;
}

module.exports = freeBot;