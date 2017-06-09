# Reference Alexa Kinvey integration

## Setup:

* Create Kinvey environment
* Create Alexa Skill
* In the Intent builder, add an intent called "GetBooks" and pick an utterance such as "get me a list of books"
  ![Intent config](alexaintent.png?raw=true "Intent config")
* In Alexa Skill config, set up Account Linking ![Account link config](alexaconfig.png?raw=true "Account link config")
* In Kinvey MIC config, choose your preferred Auth handler, and add redirect uris 
  as per Skill config direction ![MIC config](micconfig.png?raw=true "MIC config")

