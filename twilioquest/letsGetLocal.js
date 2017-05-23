const twilio = require('twilio');
const commandLineArgs = require('command-line-args');
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER;
const client = new twilio(accountSid, authToken);
const history = 'Did you know my favorite historical figure, Obi Wan Kenobi, died 40 years ago?';
const historyPic = 'https://vignette4.wikia.nocookie.net/starwars/images/4/4e/ObiWanHS-SWE.jpg';

const print = (a) => {
	console.log(a);
};

const getNumbers = () => {
	const optionDefinitions = [
		{ name: 'number', type: String, multiple: true, defaultOption: true }
	];
	return commandLineArgs(optionDefinitions).number;
};

const getTime = () => {
	const dateTime = require('node-datetime');
	let dt = dateTime.create().format('Y-m-d H:M:S');
	return `Greetings! The current time is: ${dt}`
};

const sendTime = (number) => {
	return client.messages.create({
		body: getTime(),
		to: number,  // Text this number
		from:  TWILIO_NUMBER// From a valid Twilio number
	})
};

const sendHistory = (number) => {
	return client.messages.create({
		body: history,
		to: number,  // Text this number
		mediaUrl: historyPic,
		from:  TWILIO_NUMBER// From a valid Twilio number
	})
};

const main = async () => {
	const numbers = getNumbers();
	for (let number of numbers) {
		await sendTime(number);
		await sendHistory(number);
	};
};

main();