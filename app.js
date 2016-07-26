var builder = require('botbuilder');
var restify = require('restify');

//Server Setup
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

//Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID, //feaa42f3-e01e-4149-b90b-56bcaec38070
    appPassword: process.env.MICROSOFT_APP_PASSWORD //NegWuJZmtpMvX4XKftem7oc
    //appId: feaa42f3-e01e-4149-b90b-56bcaec38070, //feaa42f3-e01e-4149-b90b-56bcaec38070
    //appPassword: NegWuJZmtpMvX4XKftem7oc //NegWuJZmtpMvX4XKftem7oc
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//Dialog
var intents = new builder.IntentDialog();

bot.dialog('/', intents);

intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);
