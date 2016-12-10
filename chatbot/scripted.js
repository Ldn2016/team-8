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

    new TrainingDocument('Mum_how_was_your_day', 'Mum, how was your day?'),
    new TrainingDocument('How_much_did_you_do', "How much did you do, I hope you didn't overwork yourself!"),
    new TrainingDocument('Who_is_lucy', "Who is Lucy, are you refering to the puppy we got?"),
    new TrainingDocument('She_is_fine', "She's fine, Mum I'm getting a bit worried, did you go to that doctor appointment?"),
    new TrainingDocument('Yes_we_did', "Yes, we did, for this morning Could you give me your number so I can call you I recently got a new phone."),
    new TrainingDocument('Ok_mum_you_are_worrying_me', "Ok mum, you are worrying me now I'll be over in 20 minutes"),
    new TrainingDocument('Mum_I_cant_find_you', "Mum I can't find you anywhere Where are you?"),
], function () {
    console.log(' BOT> Ready.');
});

const Mum_how_was_your_day = new Skill('Mum_how_was_your_day_skill', 'Mum_how_was_your_day', function (context, request, response) {
    let message = new SingleLineMessage("Great, I was just doing some gardening");
    message.responses = ["How much did you do, I hope you didn't overwork yourself!"];
    return response.send(message);
});

const How_much_did_you_do = new Skill('How_much_did_you_do_skill', 'How_much_did_you_do', function (context, request, response) {
    let message = new SingleLineMessage("As much as I could without the gloves which went missing earlier last week! How is Lucy?");
    message.responses = ["Who is Lucy, are you refering to the puppy we got?"];
    return response.send(message);
});
const Who_is_lucy = new Skill('Who_is_lucy_skill', 'Who_is_lucy', function (context, request, response) {
    let message = new SingleLineMessage("Yes sorry, I meant Bailey. How is Bailey?");
    message.responses = ["She's fine, Mum I'm getting a bit worried, did you go to that doctor appointment?"];
    return response.send(message);
});
const She_is_fine = new Skill('She_is_fine_skill', 'She_is_fine', function (context, request, response) {
    return response.send(new SingleLineMessage("What doctor appointment? We didn't make one did we?"));
});
const Yes_we_did = new Skill('Yes_we_did_skill', 'Yes_we_did', function (context, request, response) {
    return response.send(new SingleLineMessage("Yes, of course, it's..... \n I can't remember"));
});
const Ok_mum_you_are_worrying_me = new Skill('Ok_mum_you_are_worrying_me_skill', 'Ok_mum_you_are_worrying_me', function (context, request, response) {
    return response.send(new SingleLineMessage("Who are you?"));
});
const Mum_I_cant_find_you = new Skill('Mum_I_cant_find_you_skill', 'Mum_I_cant_find_you', function (context, request, response) {
    context.repeat = 0;
    return response.send(new SingleLineMessage(""));
});
const hello = new Skill('hello_skill', 'Hello', function (context, request, response) {

    if (context.repeat != null) {
        if (context.repeat < 3) {
        
            context.repeat += 1;
        }
        else return response.send(new SingleLineMessage("GAME OVER"));     
        return response.send(new SingleLineMessage(""));
    }
    return response.send(new SingleLineMessage(""));
});

const kJokeSkill = new Skill('my_knock_knock_joke_skill', 'knock_joke', function (context, request, response) {
    if (!context.kJokes) {
        context.kJokes = [];
    }

    let newJoke = knockKnockJokes();
    let counter = 0;
    while(counter < 11 && context.kJokes.indexOf(newJoke) !== -1) {
        newJoke = knockKnockJokes();
        counter++;
    }

    if(counter === 11) {
        return response.send(new SingleLineMessage('Sorry I am out of knock knock jokes. :('));
    }

    context.kJokes.push(newJoke);
    return response.send(new SingleLineMessage(newJoke));
});

const cJokeSkill = new Skill('my_chuck_norris_joke_skill', 'chuck_norris_joke', function(context, request, response) {
    return cnApi.getRandom().then(function(data) {
        return response.send(new SingleLineMessage(data.value.joke));
    });
});

bot.addSkill(kJokeSkill);
bot.addSkill(cJokeSkill);

bot.addSkill(Mum_how_was_your_day);
bot.addSkill(How_much_did_you_do);
bot.addSkill(Who_is_lucy);
bot.addSkill(She_is_fine);
bot.addSkill(Yes_we_did);
bot.addSkill(Ok_mum_you_are_worrying_me);
bot.addSkill(Mum_I_cant_find_you);
bot.addSkill(hello);

module.exports = bot;