const talkify = require('talkify');

const Bot = talkify.Bot;

const BotTypes = talkify.BotTypes;

const SingleLineMessage = BotTypes.SingleLineMessage;

const TrainingDocument = BotTypes.TrainingDocument;

const Skill = BotTypes.Skill;

const freeBot = new Bot();

var skillNames = [];
var inputs = [];
var trainingDocuments = []
var firstResponses = [];
var secondResponses = [];
var thirdResponses = [];

// read file in
fs = require('fs');
var allText = fs.readFileSync('./skills.csv').toString();
var allTextLines = allText.split(/\r\n|\n/);

// proces the skills and inputs
function processSkills() {
    for(var i=0; i<allTextLines.length - 1; i++) {
        skillNames[i] = allTextLines[i].split(',')[0];
        inputs[i] = allTextLines[i].split(',')[1];
        firstResponses[i] = allTextLines[i].split(',')[2];
        secondResponses[i] = allTextLines[i].split(',')[3];
        thirdResponses[i] = allTextLines[i].split(',')[4];
        trainingDocuments[i] = new TrainingDocument(skillNames[i],inputs[i]);
    }
}

processSkills();

console.log(trainingDocuments);


freeBot.trainAll(trainingDocuments, function () {
    console.log(' freeBot> Ready.');
});

var skills = [];

for (var i=0; i < allTextLines.length -1; i++) {
    let first, second, third;
    first = firstResponses[i];
    second = secondResponses[i];
    third = thirdResponses[i];

    skills[i] = new Skill(skillNames[i], skillNames[i], function (context, request, response) {
        return response.send(messagePicker(context, first, second, third));
        
    });
    
    //console.log("Before adding skill it is: " + skill);
    
    freeBot.addSkill(skills[i]);
}


// for (var i=0; i<allTextLines.length -1; i++){
//     freeBot.addSkill(skills[i]);    
// }

// console.log("OUTSIDE: " +first);
    
function messagePicker(context, msg1, msg2, msg3){

    let message = {};
    if(context.repeat === undefined) {

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