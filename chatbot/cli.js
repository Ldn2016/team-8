const readline = require('readline');
const bot = require('./index');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'YOU> '
});

rl.prompt();

rl.on('line', (line) => {
    bot.resolve(101, line, function(err, responses) {
        if(err) {
            say('Whoops something went wrong.');
            return say(err);
        }

        if(!responses) {
            return bot.resolve(101, line, this);
        }

        for(let response of responses) {
            say(response.content);
        }
    });
}).on('close', () => {
    say('Have a great day!');
    process.exit(0);
});

function say(lines) {
    if(lines instanceof Array) {
        for(let line of lines) {
            say(line);
        }
        return true;
    }

    if(!(typeof lines === 'string') && !(lines instanceof String)) {
        return say(JSON.stringify(lines));
    }

    for(let line of lines.split('\n')) {
        console.log(' BOT> ', line);
    }
    return true;
}