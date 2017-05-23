const twilio = require('twilio');
const commandLineArgs = require('command-line-args');
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER;
const TWILIO_CO = process.env.TWILIO_CO;
const client = new twilio(accountSid, authToken);

const print = (a) => {
    console.log(a);
};

const getNumbers = () => {
    const optionDefinitions = [
        { name: 'number', type: String, multiple: true, defaultOption: true }
    ];
    return commandLineArgs(optionDefinitions).number;
};

const sendMessages = (number) => {
    let messages = [];
    for (let i = 0; i < 2; i++) {
        const message = client.messages.create({
            body: getTime(),
            to: number,  // Text this number
            from:  TWILIO_CO// From a valid Twilio number
        });
        messages.push(message);
    }
    return messages;
}

const getTime = () => {
    const dateTime = require('node-datetime');
    let dt = dateTime.create().format('Y-m-d H:M:S');
    return `Greetings! The current time is: ${dt}`
};

const main = async () => {
    const messages = [];
    const numbers = getNumbers();
    for (let number of numbers) {
        const outMessages = sendMessages(number);
        messages.push.apply(messages, outMessages);
        //await sendHistory(number);
    };
    myMessages = await Promise.all(messages);
    for(let myMessage of myMessages) {
        print(myMessage.sid)
    }
};

main();