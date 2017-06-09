var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var Kinvey = require('kinvey-node-sdk');
var app = express();
app.use(bodyParser.json());

var michostname = "https://auth.kinvey.com";
var kid = process.env.kid || "kid_rkRcPjfhe";
var masterSecret = process.env.master_secret || "";

console.log("starting Alexa integration stub");

app.post("/skilltest", function(req,res){

  console.log(req.body);

  // step 1: validate user
  var username = "";
  var token = req.body.session.user.accessToken;

  validateUser(token, (err,user) => {
    if (user.id) {
      username = user.id
    }

    // output json structure
    var response = { version: "1.0",
                     response:{
                       outputSpeech: {
                         type: "PlainText",
                       }
                     }
                   };

    // step 2: act on the intent
    if (req.body.request.type === "LaunchRequest" ) {
      // Having "Kin-vey m mbass" synthesize renders our product name most closely....
      response.response.outputSpeech.text = "Hi "+username+", Kin-vey m mbass at your service";
      console.log(response);
      return res.status(200).send(response);
    }

    if (req.body.request.type === "IntentRequest" && req.body.request.intent.name === "GetBooks") {
      var outputSpeech = "Hi there "+username+", the list of books is ";
      Kinvey.DataStore.collection('books',Kinvey.DataStoreType.Network).find().subscribe(function onNext(books) {
        console.log("FOUND BOOKS:");
        books.forEach(function (book) {
          console.log("- "+book.title);
          outputSpeech += book.title+", ";
        });
        console.log("END OF LIST");
        response.response.outputSpeech.text = outputSpeech;
        console.log(response);
        return res.status(200).send(response);
      });
    }
  });
});

// INITIALIZE KINVEY SDK
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

// EXCHANGES KINVEY KAS ACCESS TOKEN FOR USER INFORMATION
function validateUser(token, cb) {
  if (token === null) {
    cb(null,{});
  }
  var options = {
    url: michostname+"/v3/oauth/validate?access_token="+token,
    json: true
  };
  request(options, (error, response, resBody) => {
    if (!error && response.statusCode == 200) {
      return cb(null,resBody);
    } else if (!error && response.statusCode != 200) {
      return cb(resBody,null);
    } else {
      return cb(error,null);
    }
  });
}