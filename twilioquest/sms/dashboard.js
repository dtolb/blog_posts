const express = require('express');
let app = express();
const bodyParser = require('body-parser')
const twilio = require('twilio');
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER;
const client = new twilio(accountSid, authToken);

const getBaseUrlFromReq = (req) => {
    return 'http://' + req.hostname;
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const setReminder = async (number, reminder, time) => {
    await delay(time*1000);
    const sentence = `Hey! You told me to remind you about ${reminder}`
    const messageId = await sendMessage(number, sentence);
    return;
}

const sendMessage = (number, sentence) => {
    return client.messages.create({
        statusCallback: app.smsStatusUrl,
        body: sentence,
        to: number,  // Text this number
        from:  TWILIO_NUMBER// From a valid Twilio number
    });
}

const proccessReq = (request) => {
    const time = request.split(' ')[1];
    const reminder = request.split(' ')[0];
    return {time, reminder};
}

app.use( bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.post('/sms', function (req, res) {
    if (!app.smsStatusUrl){
        app.smsStatusUrl = getBaseUrlFromReq(req)+'/status'
    }
    const twil = '<Response></Response>';
    res.send(twil);
    const request = proccessReq(req.body.Body);
    setReminder(req.body.From, request.reminder, request.time);
});

app.get('/dashboard', async (req, res) => {
    const records = await client.usage.records.list({
        category: 'sms',
        pageSize: 1000
    });
    let price;
    let total;
    for (let record of records) {
        price = record.price;
        total = record.count;
    }
    res.send(`You have sent ${total} text messages at a cost of \$${price}`);
});

app.post('/status', (req, res) => {
    const twil = '<Response></Response>';
    res.send(twil);
    console.log('----------<Status Update!>-----------')
    console.log(req.body)
    console.log('----------</Status Update!>----------')
})

const server = app.listen(3000, function () {
    let host = server.address().address
    let port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});