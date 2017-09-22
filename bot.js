var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var https = require('https');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !lame
            case 'lame-joke':

                var offset = Math.floor(Math.random() * 500);
                https.get('https://lamejokes.org/feeds/getjokes.php?count=1&offset=' + offset + '&sort=alltime', (res) => {
                  console.log('statusCode:', res.statusCode);
                  console.log('headers:', res.headers);

                  res.on('data', (d) => {
                    process.stdout.write(d);

                    var jokeData = JSON.parse(d);

                    if (jokeData[0].question == null || jokeData[0].question.trim() == '') {
                      bot.sendMessage({
                          to: channelID,
                          message: jokeData[0].punch
                      });
                    } else {
                      bot.sendMessage({
                          to: channelID,
                          message: "Question: " + jokeData[0].question + "\n\n\n" + "Answer: " + jokeData[0].punch
                      });
                    }
                  });

                }).on('error', (e) => {
                  console.error(e);
                });
            break;
            // Just add any case commands if you want to..
         }
     }
});
