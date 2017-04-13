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

```csharp
var message = await client.Message.SendAsync(new MessageData {
	From = "+12345678901",
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
* Deploy via common channels
  * NPM
  * nuGet
  * pypi
  * composer
  * maven
  * etc...
* Use some sort of CI
  * Jenkins
  * Travis
  * CircleCI
* Make it easy and clear what requirements are
  * PEP8
  * Airbnb eslint
  * etc..

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
 * Send text messages
 * @param client Client instance
 * @param item message (or list of messages) to send
 * @param callback callback function
 * @example
 * bandwidth.Message.create(client, {from: "", to: "", text: ""}, function(err, message){});
 * bandwidth.Message.create(client, [{from: "", to: "", text: ""}], function(err, statuses){});
 */
Message.create = function (client, item, callback) {}
```

#### New
```js
/**
 * Send a new SMS or MMS message
 * @param  {Object} params Parameters for sending a new message.
 * @param  {String} params.text The message text to send
 * @param  {String} params.from The message sender"s telephone number (or short code)
 * This must be a Catapult number that you own
 * @param  {String} [params.to] Message recipient telephone number (or short code)
 * @param  {Array} [params.media] Json array containing list of media urls to be sent as content for an mms.
 * Valid URLs are: https://api.catapult.inetwork.com/v1/users/<user-id>/media/
 * We also support media URLs that are external to Bandwidth API, http:// or https:// format:
 * Example: http://customer-web-site.com/file.jpg
 * @param  {String} [params.callbackUrl] The complete URL where the events related to the
 * outgoing message will be sent
 * @param  {Number} [params.callbackTimeout] Determine how long should the platform wait for
 * callbackUrl"s response before timing out (milliseconds)
 * @param  {String} [params.fallbackUrl] The server URL used to send message events
 * if the request to callbackUrl fails
 * @param  {String} [params.tag] A string that will be included in the callback events of the message
 * @param  {String} [params.receiptRequested=none] Requested receipt option for outbound messages:
 * `none` `all` `error`
 * @param  {Function} [callback] A callback for the new message object
 * @returns {MessageResponse} A promise for the new message object
 * @example
 * client.Message.send({
 *   from : "+19195551212",
 *   to   : "+19195551213",
 *   text : "Thank you for susbcribing to Unicorn Enterprises!"
 * })
 * .then(function(message){
 *   console.log(message);
 * });
 * //{
 * //  from : "+19195551212",
 * //  to   : "+19195551213",
 * //  text : "Thank you for susbcribing to Unicorn Enterprises!",
 * //  id   : "..."
 * //}
 */
this.send = function (params, callback) {}
```

| Old                                                                                                  | New                                                            |
|:-----------------------------------------------------------------------------------------------------|:---------------------------------------------------------------|
| [Python](http://bandwidth-sdk.readthedocs.io/en/latest/bandwidth_sdk.html#bandwidth_sdk.models.Call) | [Python](http://dev.bandwidth.com/python-bandwidth/calls.html) |
| [Node](https://github.com/bandwidthcom/node-bandwidth/tree/v1.3.3)                                   | [Node](http://dev.bandwidth.com/node-bandwidth/)               |

## Maintaining the SDK

![maintenance](https://media.giphy.com/media/1oUXLPtBZMuS4/giphy.gif)

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

![community](https://media.giphy.com/media/zPOErRpLtHWbm/giphy.gif)

* Respond early and often
* Solicit feedback
* Beta/Alpha Previews
* Docs win big
* Just chat with devs
* beer? Yes, beer