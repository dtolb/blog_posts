const twilio = require('twilio');
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER;
const client = new twilio(accountSid, authToken);

const findMessage = async () => {

    let a = true;
    let messageToDelete;
    client.messages.list((message) => {
        if(message.direction === 'outbound-api') {
            messageToDelete = message;
            a = false;
        }
    });
    return messageToDelete;
}



const main = async () => {
    const messages = await client.messages.list({from: TWILIO_NUMBER});
    console.log(messages[0].sid);
    const res = await client.messages(messages[0].sid).remove();
    console.log(res);
};

main();
