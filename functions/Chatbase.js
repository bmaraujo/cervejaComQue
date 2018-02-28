'use strict'

var https = require('https');
const configFile = require('./config');
const _chatbase = require('@google/chatbase');

const Chatbase = {
	sendUserMessage,
	sendBotReply,
	sendNotHandledUserMsg
};

function createNewMessage(_message,_userId){

	let msg = {
		api_key : configFile.CHATBASE_API_KEY,
		type : '',
		platform : configFile.CHATBASE_PLATAFORM,
		message : _message,
		intent : '',
		user_id: _userId,
		time_stamp: Date.now().toString(),
		not_handled : false,
		version : configFile.CHATBASE_VERSION
	};

	return msg;
}

function createOptions(){
	let options = {
		host: 'chatbase-area120.appspot.com',
		path: '/api/message',
		method: 'POST',
		headers: {
			'cache-control': 'no-cache',
			'Content-Type': 'application/json'
		}
	}
	return options;
}

function send(msg){
	let options = createOptions();

	console.log('data: ' + JSON.stringify(msg) + ', options:' + JSON.stringify(options));

	//send
	const req = https.request(options, (res) =>{
		console.log(`STATUS: ${res.statusCode}`);
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`);
		});
		res.on('end', () => {
			console.log('No more data in response.');
		});
	});
	req.on('error', (e) =>{
		console.error(e);
	});
	req.write(JSON.stringify(msg));
	req.end();
}

function sendUserMessage(_message,_intent,_userId){

	console.log('sendUserMessage');

	let msg = createNewMessage(_message,_userId);

	msg.intent = _intent;
	msg.type = 'user';

	send(msg);

}

function sendBotReply(_message,_userId){

	console.log('sendBotReply');

	let msg = createNewMessage(_message,_userId);

	msg.type = 'agent';

	send(msg);
	
}

function sendNotHandledUserMsg(_message,_userId){

	console.log('sendNotHandledUserMsg');

	let msg = createNewMessage(_message,_userId);

	msg.type = 'user';
	msg.not_handled = true;

	send(msg);
}

module.exports = function(){
	return Chatbase;
};
