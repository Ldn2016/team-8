const talkify = require('talkify');

const Bot = talkify.Bot;

const BotTypes = talkify.BotTypes;

const SingleLineMessage = BotTypes.SingleLineMessage;

const TrainingDocument = BotTypes.TrainingDocument;

const Skill = BotTypes.Skill;

const freeBot = new Bot();

// skill names and training Documents
var skillNames = [];
var inputs = [];
var trainingDocuments = [];
var delimiter = ';';

// responses for skills
var firstResponses = [];
var secondResponses = [];
var thirdResponses = [];
var responseSkillNames = [];
var skillObjects = [];

// read file in
fs = require('fs');
var allText = fs.readFileSync('./skills.csv').toString();
var allTextLines = allText.split(/\r\n|\n/);

fs2 = require('fs');
var responsesText = fs2.readFileSync('./responses.csv').toString();
var allResponsesLines = responsesText.split(/\r\n|\n/);

// proces the skills and inputs
function processSkillNames() {
    for(var i=0; i<allTextLines.length - 1; i++) {
        skillNames[i] = allTextLines[i].split(delimiter)[0];
        inputs[i] = allTextLines[i].split(delimiter)[1];
        trainingDocuments[i] = new TrainingDocument(skillNames[i],inputs[i]);
    }
}

// proces the responses
function processSkillResponses() {
    for(var i=0; i<allResponsesLines.length - 1; i++) {
        responseSkillNames[i] = allResponsesLines[i].split(delimiter)[0];
        firstResponses[i] = allResponsesLines[i].split(delimiter)[1];
        secondResponses[i] = allResponsesLines[i].split(delimiter)[2];
        thirdResponses[i] = allResponsesLines[i].split(delimiter)[3];
    }
}


processSkillNames();
processSkillResponses() 

// commence bootcamp - add TrainingDocuments
freeBot.trainAll(trainingDocuments, function () {
    console.log(' freeBot> Ready.');
});


// add skills
for (var i=0; i < allResponsesLines.length -1; i++) {
    let first, second, third;
    first = firstResponses[i];
    second = secondResponses[i];
    third = thirdResponses[i];
    
    console.log("Loop: " + i + ". First is " + first + ", second is " + second + ", third is " + third + ".");
	
    skillObjects[i] = new Skill(responseSkillNames[i], responseSkillNames[i], function (context, request, response) {
        return response.send(messagePicker(context, first, second, third));
        
    });
    
    freeBot.addSkill(skillObjects[i], 0.85);
}

const defaultSkill = new Skill ('default_skill', undefined, function (context, request, response) {
    return response.send(messagePicker(context, "Sorry, can you repeat that?", "What are you talking about?", "WHAT!?!"));
});

freeBot.addSkill(defaultSkill);

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
    else if(context.repeat < 3) message = new SingleLineMessage(msg1);
    else if(context.repeat < 6) message = new SingleLineMessage(msg2);
    else if(context.repeat < 9) message = new SingleLineMessage(msg3);
    else {
        context.repeat = 0;
        console.log("reseting!");
        message = new SingleLineMessage(msg3);
        message.responses=["Donate","Test"];
    } 
    context.repeat++;
    return message;
}

module.exports = freeBot;