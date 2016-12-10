const talkify = require('talkify');

const Bot = talkify.Bot;

const BotTypes = talkify.BotTypes;

const SingleLineMessage = BotTypes.SingleLineMessage;

const TrainingDocument = BotTypes.TrainingDocument;
const Skill = BotTypes.Skill;

const bot = new Bot();

bot.trainAll([
    new TrainingDocument('Hello','hello?'), 
    new TrainingDocument('Hello','are you there?'), 
    new TrainingDocument('Hello','mum?'), 
    new TrainingDocument('Hello', "It's me, Ivan!"),
    new TrainingDocument('Hello', "Mum,stay where u are"),

    new TrainingDocument('Mum_how_was_your_day', 'Mum, how was your day?'),
    new TrainingDocument('How_much_did_you_do', "Did you work a lot? "),
    new TrainingDocument('Who_is_lucy', "Lucy, Who is Lucy?"),
    new TrainingDocument('She_is_fine', "Did you see the Dr?"),
    new TrainingDocument('Yes_we_did', "You did, Ill call u!"),
    new TrainingDocument('On_the_phone', "Mum, ur on the phone"),
    new TrainingDocument('Worrying_me', "Have you eaten today?"),
    new TrainingDocument('Is_confused', "You are worrying me!"),
    new TrainingDocument('Where_are_you', "Where are you?"),

    new TrainingDocument('Mum_I_cant_find_you', "Mum I can't find you anywhere Where are you?"),
], function () {
    console.log(' BOT> Ready.');
});

// Scenario 1

const Mum_how_was_your_day = new Skill('Mum_how_was_your_day_skill', 'Mum_how_was_your_day', function (context, request, response) {
    return response.send(messageFactory("Great, I was just doing some gardening", ["Did you work a lot? "]));
});

const How_much_did_you_do = new Skill('How_much_did_you_do_skill', 'How_much_did_you_do', function (context, request, response) {
    return response.send(messageFactory("As much as I could without the gloves which went missing earlier last week! How is Lucy?", ["Lucy, Who is Lucy?"]));
});
const Who_is_lucy = new Skill('Who_is_lucy_skill', 'Who_is_lucy', function (context, request, response) {
    return response.send(messageFactory("Yes sorry, I meant Bailey. How is Bailey?",["Did you see the Dr?","Have u eaten today?"]));
});

// Scenario 1 Branch 1
const She_is_fine = new Skill('She_is_fine_skill', 'She_is_fine', function (context, request, response) {
    return response.send(messageFactory("When? I didn't have an appointment did I?",["You did, Ill call u!"]));
});
const Yes_we_did = new Skill('Yes_we_did_skill', 'Yes_we_did', function (context, request, response) {
    return response.send(messageFactory("Yes, of course, let me find the phone…",["Mum, ur on the phone"]));
});

const On_the_phone = new Skill('On_the_phone_skill', 'On_the_phone', function (context, request, response) {
    return response.send(messageFactory("Wait, who are you?",["It's me, Ivan!"]));
});

// Scenario 1 Branch 2


const Worrying_me = new Skill('Worrying_me_skill', 'Worrying_me', function (context, request, response) {
    return response.send(messageFactory("Yes...wait..no..I think I did?",["You are worrying me!"]));
});


const Is_confused = new Skill('Is_confused_skill', 'Is_confused', function (context, request, response) {
    return response.send(messageFactory("I'm sorry, I am just getting very confused right now.",["Where are you?"]));
});

const Where_are_you = new Skill('Where_are_you_skill', 'Where_are_you', function (context, request, response) {
    return response.send(messageFactory("I don't know. I don't know how I ended up here. Can you please help me?",["Mum,stay where u are"]));
});

// End sequence
const hello = new Skill('hello_skill', 'Hello', function (context, request, response) {

    if (context.repeat != null) {
        if (context.repeat < 1) {
            context.repeat += 1;
            return response.send(messageFactory("...",["Hello?", "mum?", "are you there?"]));
        }
        else return response.send(messageFactory("Memory loss is just one of the symptoms victims of dementia can experience, and it can happen to anyone. Dimentia is a disease, which can one day be eliminated. To find out more or to donate to our cause, follow the links below.",["Donate", "Learn more", "Start again?"]));     

    }
    else context.repeat = 0;
    return response.send(messageFactory("...",["Hello?", "mum?", "are you there?"]));
});

const messageFactory = function (text, responses) {

    let message = new SingleLineMessage(text);
    message.responses = responses;
    return message;
};

bot.addSkill(Mum_how_was_your_day);
bot.addSkill(How_much_did_you_do);
bot.addSkill(Who_is_lucy);
bot.addSkill(She_is_fine);
bot.addSkill(Yes_we_did);
bot.addSkill(On_the_phone);
bot.addSkill(Worrying_me);
bot.addSkill(Is_confused);
bot.addSkill(Where_are_you);

bot.addSkill(hello);

module.exports = bot;