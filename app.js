var restify = require('restify');
var builder = require('botbuilder');
var cognitiveServices = require('botbuilder-cognitiveservices');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
// Listen for messages from users 
server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector);

// POST /knowledgebases/8cd55a06-47da-4e85-823b-d914c1b515dc/generateAnswer
// Host: https://westus.api.cognitive.microsoft.com/qnamaker/v2.0
// Ocp-Apim-Subscription-Key: aee2569cdbfa49859e1ce7546fd5f364
// Content-Type: application/json
// {"question":"hi"}

/*
var qnaMakerRecognizer = new cognitiveServices.QnAMakerRecognizer({
    knowledgeBaseId: '8cd55a06-47da-4e85-823b-d914c1b515dc',
    subscriptionKey: 'aee2569cdbfa49859e1ce7546fd5f364'
});

var qnaMakerDialog = new cognitiveServices.QnAMakerDialog({
    recognizers: [qnaMakerRecognizer],
    qnaThreshold: 0.4,
    defaultMessage: 'Allez prendre un verre :) car je n\ai pas compris'
});
*/
//bot.dialog('/', qnaMakerDialog);


//LUIS

var luisEndpoint = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/2df35c0c-d84d-48f3-baac-05f2c32a7bbc?subscription-key=acbd3995bb6748f7b8276209cdad3d98&staging=true&verbose=true&timezoneOffset=0&q=";
var luisRecognizer = new builder.LuisRecognizer(luisEndpoint);
bot.recognizer(luisRecognizer);

bot.dialog('HomePilot', [
    function (session, args, next) {
        var intentResult = args.intent;
        var entities = builder.EntityRecognizer.findEntity(intentResult.entities, 'HomeAutomation.Device');

        session.send(`votre intention ${intentResult.intent}`);

        intentResult.entities.forEach(function(element){
            session.send(`Entity: ${element.entity}`);
            session.send(`Type: ${element.type}`);
        }, this);
    }
]).triggerAction({
    matches: 'HomeAutomation.TurnOn'
});