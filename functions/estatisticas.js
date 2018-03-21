'use strict';

const functions = require('firebase-functions');
const configFile = require('./config');

// Set the configuration for the database
const config = {
	apiKey: configFile.API_KEY,
	authDomain: configFile.AUTH_DOMAIN,
	databaseURL: configFile.DATABASE_URL,
	storageBucket: configFile.STORAGE_BUCKET
};

var _firebaseApp;

function salvar(_collection,_propriedade,_valor){

	if(!_firebaseApp){

			_firebaseApp = firebase.initializeApp(config);
		}

	firebase.auth().signInWithEmailAndPassword(configFile.FIREBASE_DB_USER,configFile.FIREBASE_DB_PASS).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;

		console.log('##### Error authenticating:' + errorCode + ' - ' + errorMessage);
	});

	_firebaseApp.database().ref(_collection).set({
		_propriedade: _valor
		});

}

function carregar(_collection, _propriedade){

	let qtd_procurada = 0;

	if(!_firebaseApp){

		_firebaseApp = firebase.initializeApp(config);
	}

	firebase.auth().signInWithEmailAndPassword(configFile.FIREBASE_DB_USER,configFile.FIREBASE_DB_PASS).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;

		console.log('##### Error authenticating:' + errorCode + ' - ' + errorMessage);
	});

	// Get a reference to the database service
	let database = _firebaseApp.database();

	database.ref(_collection).once('value').then(function(snapshot){
		let estilo = (snapshot.val() && snapshot.val().qtd_procurada);
		if (estilo) {
			qtd_procurada = estilo;
 		}

 	return qtd_procurada; 

	}); 
}

const statsDB = {
	PATH_ESTILOS : 'estatisticas/estilos',
	PROP_QTD_PROCURADA : 'qtd_procurada'
};

exports.estatisticas = functions.https.onRequest((request, response) => {

	function incrementarEstilo(_estilo){

		try{					
			let qtd = await carregar(statsDB.PATH_ESTILOS + '/' + _estilo, statsDB.PROP_QTD_PROCURADA);

			qtd++;

			salvar(statsDB.PATH_ESTILOS + '/' + _estilo, statsDB.PROP_QTD_PROCURADA, qtd);
		}
		catch (err){
			console.log('### Erro ao incrementarEstilo | ' + error.code + ' - ' + error.message);
		}
	}

});
