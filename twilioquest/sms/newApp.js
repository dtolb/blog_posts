const express = require('express');
let app = express();
const bodyParser = require('body-parser')
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.use( bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.post('/sms', function (req, res) {
    console.log(req.body);
    const stateName = req.body.FromState;
    const stateSentence = `Hi! It looks like your phone number was born in ${stateName}`
    const twiml = new MessagingResponse();
    twiml.message(stateSentence);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

const server = app.listen(3000, function () {
    let host = server.address().address
    let port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});