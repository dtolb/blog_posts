# SDKs and You

![Gif](https://media.giphy.com/media/Coyz0vr60bizm/giphy.gif)

## Talking Points

* [Should You Build an API for That?](#should-you-build-an-api-for-that)
* [Why Build SDK](#why-build-an-sdk)
* [Swagger / RAML Generated Code](#generated-code)
* [Where to start?](#where-to-start)
* [What langauges to support?](#what-langauges-should-you-support)
* [Design First](#design-first)
* [Developing SDK](#developing-the-sdk)
* [Documentation](#documentation)
* [Maintaining the SDK](#maintaining-the-sdk)
* [Community](#community)

## Should You Build an API for That?

![gif 1](https://media.giphy.com/media/Qw4X3FD2pwtfYhwf9gk/giphy.gif)

* Operating costs?
* Your resources
* Dev Time
* Competitors?
	* What can you do better than they can?
* How would _you_ use it?
	* Your friends?

## Why Build an SDK?

![gif 2](https://media.giphy.com/media/UxNTT095uL0go/giphy.gif)

* Reduce on boarding friction
* Meets general 'checklist' for devs
* You know your API better than customers
* **Your Competitors offer SDKs**
* Lovely IDE support
* You Want to

## Generated Code

![gif 3](https://media.giphy.com/media/3o6Zta541z5bneFxLy/giphy.gif)

* Great first point of entry _if you have RAML/SWAGGER ALREADY_
* You know the API better than tools do
* Open Source tools _last I looked_ don't provide intuitive interface
* Build your own generator -> **CAUTION** may spend more time developing the generator than each SDK.

### Example to send a message

```js
// Generated OK
const apiToken = 't-123';
const apiSecret = 's-123';
const apiUser = 'u-123';
const apiInstance = swagger_client.DefaultApi;

const messageData = {
  from : '+12223334444',
  to   : '+12223334445',
  text : 'Hello world'
}

const message = apiInstance.messages.post(apiUser, apiToken, apiSecret, messageData, (err, res) => {});

// SDK
var client = new Bandwidth({
    userId    : "YOUR_USER_ID",
    apiToken  : "YOUR_API_TOKEN",
    apiSecret : "YOUR_API_SECRET"
});

client.Message.send(messageData)
.then( (message) => {})
.catch( (reason) => {});
```

### Where things get hairy

```js
// update state of an object
const updatedState = {
  state: 'completed'
};
const callId = 'c-123'
const call = apiInstance.calls.post(apiUser, apiToken, apiSecret, callId, updatedState, (err, res) => {});

// vs

client.calls.hangup(callId)
.then()
.catch();
```

## Where to start

![go go go](https://media.giphy.com/media/QJvwBSGaoc4eI/giphy.gif)

* Look at the competition
  * What do they do?
  * Can you copy them?
  * Are you better than they are??
* Good resources
  * [Dropbox](https://github.com/dropbox)
  * [Twilio](https://github.com/twilio)
  * [Stripe](https://github.com/stripe)
  * [PayPal](https://github.com/paypal/)
  * [BANDWIFFFFFFF](https://github.com/bandwidth)
* Look for patterns (idiomatic)
  * Go -> use structs for payload
  * JS -> JSON
  * C# -> POCO
  * Java -> POJO
  * Python -> Named Params
  * PHP ??????
 
```csharp
var list = await Call.List(new Dictionary<string, object>{
  {"from", "+19195551212"},
  {"to", "+123"}, 
  {"text":"123"}
});
```

```
var message = await client.Message.SendAsync(new MessageData {
	From = "+12345678901", // This must be a Bandwidth number on your account
	To   = "+12345678902",
	Text = "Hello world."
});
```

## What langauges should you support

![gif support](https://media.giphy.com/media/fSMryuuE9QsBG/giphy.gif)

* Depends on your application
* [Stack overflow](https://stackoverflow.com/insights/survey/2017#most-popular-technologies)
* What do _you_ enjoy?
* Look at competition
* What is _your_ API developed in?
* **Recommendation** Have at least 2 developers confident in language

## Design First

![Design](https://media.giphy.com/media/l2YSnzwbzIEUcMoXm/giphy.gif)

* This is the hard part
* Get feedback **EARLY** and **OFTEN**
* Just define the interface
* Mock out HTTP Requests
* Behind the scenes can change w/o breaking

Difference between:

```python
## No IDE Support
message = api.message.send({
  "to"   : "+123",
  "from" : "+345",
  "text" : "hello world"
  "callback_url": "http://ap.you.com"
 });
 
 ## Snake and Camel mixed up
 print(message["messageId"])
 print(message["callbackUrl"])
 
 ## IDE Support
 message = api.message.send(
  to    = "+123",
  from_ = "+345",
  text  = "Hello world"
  callback_url = "http://ap.you.com" 
 );
 
 ## Snakes everywhere
 print(message["message_id"])
 print(message["callback_url"])
 ```
 
 ## Developing the SDK
 
 ![Developing](https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif)
 
 ### DON'T START UNTIL INTERFACE IS COMPLETE ###
 
 * You're developing software to use in _OTHER DEVELOPERS_ production environment
 * Shoot for 100% Test coverage
 * Minimize dependencies
 * Do you _really_ need all of [requests](https://www.npmjs.com/package/request)?
 * Iterate often and pre-release when capable
 * Get as much feedback as possible before version 1
 
## Documentation

![Docs](https://media.giphy.com/media/WoWm8YzFQJg5i/giphy.gif)

### THE SECOND MOST IMPORTANT THING AFTER INTERFACE ###

* JUST DO IT
* Automate _everything_
* Expect to spend _double time as developing on docs_
* Add example usage for each method
* Don't rely on IDE support
* However, document parameters like IDE's expect them *idiomatic*

#### Old
```js
/**
 * Make a phone call
 * @param client Client instance
 * @param item call"s data
 * @param callback callback function
 * @example
 * bandwidth.Call.create(client, {from: "", to: ""}, function(err, call){});
 */
Call.create = function (client, item, callback) {}
```

#### New
```js
/**
 * Create a new voice call
 * @param {Object} params Parameters for creating a new call
 * @param {String} params.from A Bandwidth phone number on your account the
 * call should come from (must be in E.164 format, like +19195551212).
 * @param {String} params.to The number to call (must be either an E.164 formated number,
 * like +19195551212, or a valid SIP URI, like sip:someone@somewhere.com).
 * @param {Number} [params.callTimeout] Determine how long should the platform wait for]
 * call answer before timing out in seconds.
 * @param {String} [params.callbackUrl] The full server URL where the call events related to the
 * Call will be sent to.
 * @param {Number} [params.callbackTimeout] Determine how long should the platform wait for
 * callbackUrl's response before timing out in milliseconds.
 * @param {String} [params.callbackHttpMethod] Determine if the callback event should be sent via HTTP GET
 * or HTTP POST. Values are "GET" or "POST" (if not set the default is POST).
 * @param {String} [params.fallbackUrl] The full server URL used to send the callback
 * event if the request to callbackUrl fails.
 * @param {String} [params.bridgeId] The id of the bridge where the call will be added.
 * @param {String} [params.conferenceId] Id of the conference where the call will be added.
 * This property is required if you want to add this call to a conference.
 * @param {String} [params.recordingEnabled] Indicates if the call should be recorded after being created.
 * Set to "true" to enable. Default is "false".
 * @param {String} [params.recordingMaxDuration] Indicates the maximum duration of call recording in seconds.
 * Default value is 1 hour.
 * @param {String} [params.transcriptionEnabled] Whether all the recordings for this call is going to be
 * automatically transcribed.
 * @param {String} [params.tag] A string that will be included in the callback events of the call.
 * @param {Object} [params.sipHeaders] Map of Sip headers prefixed by "X-". Up to 5 headers can be sent per call.
 * @param {Function} [callback] Callback with the newly created call
 * @return {CallResponse} A promise for the newly created call
 */
this.create = function (params, callback) {}
```

| Old                                                                                                  | New                                                            |
|:-----------------------------------------------------------------------------------------------------|:---------------------------------------------------------------|
| [Python](http://bandwidth-sdk.readthedocs.io/en/latest/bandwidth_sdk.html#bandwidth_sdk.models.Call) | [Python](http://dev.bandwidth.com/python-bandwidth/calls.html) |
| [Node](https://github.com/bandwidthcom/node-bandwidth/tree/v1.3.3)                                   | [Node](http://dev.bandwidth.com/node-bandwidth/)               |

## Maintaining the SDK

![maintenance](https://media.giphy.com/media/C1JxJhEGs4ks8/giphy.gif)

* Unless business needs, only support what language supports.
	* Python 2.6
	* Node 0.10
	* .Net 3.x
* Accept pull requests liberally, but must pass tests
* PR's are trying to be helpful. Don't discourage, help write tests/update documentation
	* Work off of their fork, give them credit
* Respond to issues, suggest creating a PR
* Like to keep response < 48 hrs, week minimum
* [Semantic Versioning](http://semver.org/)
	* Try to avoid `major` releases

## Community

![https://media.giphy.com/media/zPOErRpLtHWbm/giphy.gif]

* Respond early and often
* Solicit feedback
* Beta/Alpha Previews
* Docs win big
* Just chat with devs
* beer? Yes, beer