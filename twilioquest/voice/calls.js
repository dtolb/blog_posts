const twilio = require('twilio');
const commandLineArgs = require('command-line-args');
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER;
const TWIML = 'https://handler.twilio.com/twiml/EH582ef8447e4ec1de5ea235fdbb5dde57'
const client = new twilio(accountSid, authToken);

const getNumbers = () => {
    const optionDefinitions = [
        { name: 'number', type: String, multiple: true, defaultOption: true }
    ];
    return commandLineArgs(optionDefinitions).number;
};

const main = async () => {
    let calls = [];
    const numbers = getNumbers();
    for (let number of numbers) {
        const call = client.calls.create({
          url: TWIML,
          to: number,
          from: TWILIO_NUMBER,
        })
        calls.push(call);
    };
    const callIds = await Promise.all(calls);
    for(let call of callIds) {
        console.log(call.sid);
    }
};

main();