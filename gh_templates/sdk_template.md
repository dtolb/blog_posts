# Title uses H1

> Put Travis and other badges at the top here

[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)]() [![Codecov](https://img.shields.io/codecov/c/github/codecov/example-python.svg)]() [![Github All Releases](https://img.shields.io/github/downloads/atom/atom/total.svg)]()

Then a breif desciription of what the SDK is... Something like: Node.js client library for [Bandwidth's Voice and Messaging API](http://dev.bandwidth.com) with the **CORRECT** product name... **None of that Iris and Catapult shctuff here**.

## Table of contents

* [Installation](#installation)
* [Documentation](#documentation)
* [Supported Versions](#supported-versions)
* [Getting Started](#getting-started)
* [Examples](#examples)
* [Dev Installation](#dev-installation)
* [Contributing](#contributing)

## Installation
Put instructions on how to install and use the SDK for projects like:

`npm install node-bandwidth`

### Supported Versions
Be sure to list what versions of this SDK has been tested on. 

| Version                        | Support Level            |
|:-------------------------------|:-------------------------|
| <0.10.*                        | Unsupported              |
| 0.10.*                         | End-of-Life (2016-10-31) |
| 0.12.*                         | End-of-Life (2016-10-31) |
| >=4.0 <4.2                     | Unsupported              |
| >=4.2 <5.* (Node v4 argon LTS) | Supported                |
| 5.*                            | Unsupported              |
| _6.11.2 (Node v6 Boron LTS)_   | **Recommended**          |
| 7.*                            | Unsupported              |
| 8.*                            | Unsupported              |

## Documentation
This will differ between Bandwidth's Phone Number Dashboard (Dashboard, Iris) and Bandwidth's Voice and Messaging APIs (Catapult, application platform) but in general, each SDK should have it's own documentation like:

* [Python](http://dev.bandwidth.com/python-bandwidth)
* [Node](http://dev.bandwidth.com/node-bandwidth)

## Getting Started
Put information here about how to use the SDK once it's been successfully installed.
You should [link](http://dev.bandwidth.com/security.html) to the page where 

### Get your [API user-id, token, & secret](http://dev.bandwidth.com/security.html)

All interaction with the API is done through a `client` Object. The client constructor takes an Object containing configuration options. The following options are supported:

| Field name  | Description           | Default value                       | Required |
|:------------|:----------------------|:------------------------------------|:---------|
| `userId`    | Your user ID          | `undefined`                         | Yes      |
| `apiToken`  | Your API token        | `undefined`                         | Yes      |
| `apiSecret` | Your API secret       | `undefined`                         | Yes      |
| `baseUrl`   | The Bandwidth API URL | `https://api.catapult.inetwork.com` | No       |


```js
const Bandwidth = require("node-bandwidth");

const client = new Bandwidth({
    userId    : "YOUR_USER_ID",
    apiToken  : "YOUR_API_TOKEN",
    apiSecret : "YOUR_API_SECRET"
});
```

## Examples
### *All examples assume you have already setup your auth data!*

Again here are where the examples will differ, but for Bandwidth's Voice and Messaging APIs (Catapult, application platform):

The minimum examples _in the readme_ for Bandwidth's Voice and Messaging APIs (Catapult, application platform) should be:

* Search local numbers
* Order local number
* Send SMS
* Create Call
* BXML Example

> Other examples are contained on dev.bandwidth.com/ap-docs and the SDK's specific site

### Search available local numbers

```ruby
numbers = Bandwidth::AvailableNumber.search_local({:state =>"NC", :city => "Cary"})
#or
client = Bandwidth::Client.new(:user_id => "userId", :api_token => "token", :api_secret => "secret")
numbers = Bandwidth::AvailableNumber.search_local(client, {:state =>"NC", :city => "Cary"})
```

### Order a phone number

```ruby
number = Bandwidth::PhoneNumber.create({:number => "+19195551212"})
#or
client = Bandwidth::Client.new(:user_id => "userId", :api_token => "token", :api_secret => "secret")
number = Bandwidth::PhoneNumber.create(client, {:number => "+19195551212"})
```

### Send SMS
```ruby
message = Bandwidth::Message.create({:from => "+19195551212", :to => "+191955512142", :text => "Test"})
#or
client = Bandwidth::Client.new(:user_id => "userId", :api_token => "token", :api_secret => "secret")
message = Bandwidth::Message.create(client, {:from => "+19195551212", :to => "+191955512142", :text => "Test"})
```

### Make a call

```ruby
call = Bandwidth::Call.create({:from => "+19195551212", :to => "+191955512142"})
#or
client = Bandwidth::Client.new(:user_id => "userId", :api_token => "token", :api_secret => "secret")
call = Bandwidth::Call.create(client, {:from => "+19195551212", :to => "+191955512142"})
```


### BXML

```ruby
response = Bandwidth::Xml::Response.new()
speak_sentence = Bandwidth::Xml::Verbs::SpeakSentence.new({:sentence => "Transferring your call, please wait.", :voice => "paul", :gender => "male", :locale => "en_US"})
transfer = Bandwidth::Xml::Verbs::Transfer.new({
        :transfer_to => "+13032288849",
        :transfer_caller_id => "private",
        :speak_sentence => {
            :sentence => "Inner speak sentence.",
            :voice => "paul",
            :gender => "male",
            :locale => "en_US"
        }
    })

hangup = Bandwidth::Xml::Verbs::Hangup.new()
response << speak_sentence << transfer << hangup 

# as alternative way we can pass list of verbs to constructor of Response
# response = Bandwidth::Xml::Response.new([speak_sentence, transfer, hangup])

puts response.to_xml()
```

## Dev Installation

This is where to include information on how to build the SDK locally

## Contributing

This is where to include information on how to contribute to the SDK. Include things like

* Style
* Pull-request
* Issue opening
* Tests
* Folder Structure
* etc..