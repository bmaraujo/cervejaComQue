'use strict';

process.env.DEBUG = 'actions-on-google:*';
const {DialogflowApp} = require('actions-on-google');
const functions = require('firebase-functions');
const CervejaComQue = require('./CervejaComQue');

exports.cervejaComQue = functions.https.onRequest((request, response) => {

	const app = new DialogflowApp({request, response});

	var cervejaComq = new CervejaComQue(app);

});


