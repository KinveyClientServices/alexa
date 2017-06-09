var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var Kinvey = require('kinvey-node-sdk');
var app = express();
app.use(bodyParser.json());

var kid = process.env.kid || "kid_rkRcPjfhe";
var masterSecret = process.env.master_secret || "";

console.log("starting Alexa integration stub");

app.post("/skilltest", function(req,res){

  console.log(req.body);

  // step 1: validate user
  // (right now we just log in as "master" in the initialize function)
  if request.session,access_token......

  // step 2: act on the intent
  // if (req.body.request.intent.name === "GetBooks" ) {

  var outputSpeech = "Hi there, the list of books is ";
  Kinvey.DataStore.collection('patient',Kinvey.DataStoreType.Network).find().subscribe(function onNext(books) {
    console.log("FOUND BOOKS:");
    books.forEach(function (book) {
      console.log("- "+book.title);
      outputSpeech += book.title+", ";
    });
    console.log("END OF LIST");
    var response = { version: "1.0",
                     response:{
                       outputSpeech: {
                         type: "PlainText",
                       }
                     }
                   };
    response.response.outputSpeech.text = outputSpeech;
    console.log(response);
    return res.status(200).send(response);
  });
});

Kinvey.initialize({
    appKey:      kid,
    appSecret:   masterSecret
}).then(function(activeUser) {
  return Kinvey.ping();
}).then(function(ping) {
    console.log("Connected to environment: "+kid+" ("+ping.appName+":"+ping.environmentName+")");
    return Kinvey.User.login({
        username : kid,
        password : masterSecret
    });
}).then(function(activeUser) {
  var port = process.env.PORT||3001;
  app.listen(port, function(){console.log("listening on :"+port)});
});
