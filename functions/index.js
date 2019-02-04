'use strict';

process.env.DEBUG = 'actions-on-google:*';
const {dialogflow,Suggestions, BasicCard} = require('actions-on-google');

const functions = require('firebase-functions');
const CervejaComQue = require('./CervejaComQue');

const fs = require('fs');

var dialogs = JSON.parse(fs.readFileSync('./dialogs.json', 'utf8'));

//import action constants
const actions = require('./actions');
const contexts = require('./contexts');
const constDialogs = require('./dialogs');
const suggestChips = require('./suggestionsChips');
const configFile = require('./config');
const entities = require('./entities');
const firebase = require('firebase');

// parameters
const CERVEJA_ESTILO = 'cerveja_estilo';
const COMIDA = "comida";
const BITTERNESS = 'bitterness';
const COLOR = 'color';
const ALCOHOLIC_VOL = 'alcoholicVolume';

const ACK = dialogs[constDialogs.ACK];
//phrases end
const FIM_FRASE = dialogs[constDialogs.FIM_FRASE];

const FALLBACK = dialogs[constDialogs.FALLBACK];
const FALLBACK_FINISH = dialogs[constDialogs.FALLBACK_FINISH];
const ABOUT = dialogs[constDialogs.ABOUT];
const SUGERIR_LOJA = dialogs[constDialogs.SUGERIR_LOJA];
const SUGGESTION_ACCEPTED = dialogs[constDialogs.SUGGESTION_ACCEPTED];
const ASK_BITTER = dialogs[constDialogs.ASK_BITTER];
const ASK_ALCOHOLIC = dialogs[constDialogs.ASK_ALCOHOLIC];
const ASK_COLOR = dialogs[constDialogs.ASK_COLOR];
const HC_1st_SUGGEST = dialogs[constDialogs.HC_FIRST_STYLE_SUGGEST];
const HC_FOLLOW_SUGGEST = dialogs[constDialogs.HC_FOLLOWING_STYLE_SUGGEST];
const WELCOME = dialogs[constDialogs.WELCOME];
const WELCOME_BACK=dialogs[constDialogs.WELCOME_BACK];
const WELCOME_BACK_NOPERM=dialogs[constDialogs.WELCOME_BACK_NOPERM];
const PERMISSION = dialogs[constDialogs.PERMISSION];
const NON_PERM_ENDING = dialogs[constDialogs.NON_PERM_ENDING];
const PERM_ENDING = dialogs[constDialogs.PERM_ENDING];
const PROCUROU_MARCA = dialogs[constDialogs.PROCUROU_MARCA];

//File with data
const HARM_JSON_FILE = 'harmonizacoes.json';

//phrases to suggest
const FIRST_FOOD_SUGGESTIONS =dialogs[constDialogs.FIRST_FOOD_SUGGESTIONS];
const FIRST_STYLE_SUGGESTONS = dialogs[constDialogs.FIRST_STYLE_SUGGESTONS];

const SECOND_SUGGESTIONS = dialogs[constDialogs.SECOND_SUGGESTIONS];
const NO_SUGGESTION = dialogs[constDialogs.NO_SUGGESTIONS];

const MAX_FALLBACKS = 3;

//constants used to help the user select a beer
const IBU_INCREMENT = 15;
const TeorA_INCREMENT = 1.8;
const SRM_INCREMENT = 8;

const app = dialogflow({debug: true});

app.intent('welcome', (conv) => {

	let welcomePhrase = "";

	if(conv.user.last.seen){

		//Try to get the user name
		const userName = getStorage(conv).name;

		if (userName) {
 			welcomePhrase = buildSpeech(getRandomEntry(WELCOME_BACK).replace("$1",userName));
 		}
 		else{
 			welcomePhrase = buildSpeech(getRandomEntry(WELCOME_BACK_NOPERM));
 		}
	}
	else{
		welcomePhrase = buildSpeech(getRandomEntry(WELCOME));
	}

	conv.ask(welcomePhrase);
	conv.ask(new Suggestions([suggestChips.HARMONIZAR_CERVEJA, suggestChips.HELP_CHOOSE]));


});

app.intent('cervejacomq.procurouMarca', (conv) =>{

	conv.ask(buildSpeech(getRandomEntry(PROCUROU_MARCA)));
	conv.ask(new Suggestions(['Lager', 'Pilsen','IPA']));

});

app.intent('cervejacomq.searchHarmonization', (conv, {cerveja_estilo}) => {

		resetFallbackCount(getStorage(conv));

		let estilo = setEstilo(cerveja_estilo);

 		this.suggest(conv,actions.COMIDA_ACTION, foods,estilo);
});

app.intent('cervejacomq.changeBeerStyle',(conv, {cerveja_estilo}) =>{
	resetFallbackCount(getStorage(conv));

	let estilo = setEstilo(cerveja_estilo);

	this.suggest(conv,actions.COMIDA_ACTION, foods,estilo);

});

app.intent('cervejacomq.searchBeerStyle', (conv, {comida}) =>{

	resetFallbackCount(getStorage(conv));

	let food = comida;

	//If there is no beer stlye argument it means it is not the first suggestion, use the style saved before
	if(!food){
		food = getStorage(conv).food; 			
	}

	getStorage(conv).food = food;

	let estilos = getEstilosByFood(food);

	this.suggest(actions.CERVEJA_ACTION, estilos,food);
});

app.intent('Default Fallback Intent', (conv) =>{
	let consecutiveFallbacks;
	if(!getStorage(conv).consecutiveFallbacks){
		consecutiveFallbacks = 1;
	}
	else{
		consecutiveFallbacks = getStorage(conv).consecutiveFallbacks;
	}

		if(consecutiveFallbacks < MAX_FALLBACKS){

			getStorage(conv).consecutiveFallbacks = ++consecutiveFallbacks;
			//Fallback
			conv.ask(buildSpeech(getRandomEntry(FALLBACK)));

		}
		else{
			getStorage(conv).consecutiveFallbacks = 0;

			let finishSpeech = buildSpeech(getRandomEntry(FALLBACK_FINISH));

			closeConversationWithCard(conv);
		}
});

app.intent('cervejacomq.about',(conv)=>{
	resetFallbackCount(getStorage(conv));
 	conv.ask(buildSpeech(getRandomEntry(ABOUT)));
});

app.intent('cervejacomq.userAcceptSuggestion', (conv)=>{
	//verificar se o nome ja foi salvo
	if(!getStorage(conv).userName){
		//se nao foi, pedir permissao para salvar
		requestPermission(conv);
	}
	else{
		finishApp(conv);
	}
});

app.intent('cervejaComque.permission',(conv, {params, confirmationGranted}) => {
	const {name} = conv.user;
	if (confirmationGranted) {
		if (name) {
			saveName(conv);
			finishApp(conv);
		}
	}
	else{
		//No permission was granted, so just finish
		conv.close(buildSpeech(getRandomEntry(ACK) + getRandomEntry(NON_PERM_ENDING)));
	}
});

app.intnet('cervejacomq.helpUserChoose', (conv,{bitterness,color,alcoholicVolume}) =>{
	this.resetFallbackCount();

	//initial values for each style property
	let ibu = 50;
	let teorA = 6;
	let srm  = 10;

	//save settings for filtering later
	getStorage(conv).ibu = ibu;
	getStorage(conv).teorA  = teorA;
	getStorage(conv).srm = srm;

	if(!bitterness && !color && !alcoholicVol){

		conv.ask(buildSpeech(getRandomEntry(ACK) +  getRandomEntry(ASK_BITTER)));
		conv.ask(new Suggestions([suggestChips.MAIS,suggestChips.MENOS,suggestChips.TANTO_FAZ]));
 	}
 	else{// this is the case where the user said the whole phrase

 		//Extract the user's input settings
 		this.setIBU(conv,bitterness);
 		this.setSRM(conv,color);
 		this.setAlcVol(conv,alcoholicVol);
 		
 		this.helpChoose1stSuggestion();
 	}
})

app.intent('help_choose.step2_mais', (conv) =>{
	this.resetFallbackCount();

	let ibu = getStorage(conv).data.ibu;

	//increment IBU setting
	ibu += IBU_INCREMENT;

	//max limit for ibu
	if(ibu > 120){
		ibu = 120;
	}

	getStorage(conv).data.ibu = ibu;

	let sugChips = [suggestChips.MAIS,suggestChips.MENOS,suggestChips.TANTO_FAZ];

	this.helpChooseFinishStep(conv, contexts.CTX_BITTERNESS,undefined,ASK_ALCOHOLIC, sugChips);
});

exports.cervejaComQue = functions.https.onRequest(app);

function getStorage(conv){
	return getStorage(conv);
}

function addContext(conv, context, lifeTime){
	conv.contexts.set(context, lifeTime);
}

function delContext(conv,context){
	conv.contexts.set(context, 0);
}

function helpChooseFinishStep(conv, newContext,removeContext,nextQuestionArr, sugChips){

		//set the new context
		addContext(conv,newContext,2);

		//if there is a removeContext, remove it
		if(removeContext){
			delContext(conv,removeContext);
		}
		if(nextQuestionArr){
			//ask next question
	 		conv.ask(buildSpeech(getRandomEntry(ACK) +  getRandomEntry(nextQuestionArr)));
	 		conv.ask(new Suggestions(sugChips));
		}
	}

function setEstilo(cerveja_estilo){
	let estilo = cerveja_estilo;

	//If there is no beer stlye argument it means it is not the first suggestion, use the style saved before
	if(!estilo){
		estilo = getStorage(conv).estilo; 			
	}

	//get all foods of desired style
	const estiloComida = getEstilo(estilo); 
	let foods;
	if(estiloComida){
		foods = getEstilo(estilo).comidas;
	}

	getStorage(conv).estilo = estilo;

	return estilo;
}

function getRandomEntry(arr){
		return arr[Math.floor(Math.random() * arr.length)];
	}

//This is only for common settings to the whole response, like prosody, you still need to add breaks, sentences, etc before calling this method
function buildSpeech(message){
	let speech = '<speak>';
	speech += '<prosody rate="medium" pitch="+1st" volume="medium">';
	speech += message;
	speech += '</prosody>';
	speech += '</speak>';
	return speech
}

function resetFallbackCount(userStorage){
	if(userStorage && userStorage.consecutiveFallbacks){
		userStorage.consecutiveFallbacks = 0;
	}	
}

function getEstilo(estilo){
		var harmoniza = readJsonFile(HARM_JSON_FILE);
		for(var i=0, maxEstilos = harmoniza.estilos.length; i< maxEstilos; i++){
			if (harmoniza.estilos[i].nome === estilo) {
				return harmoniza.estilos[i];
			}
		}
		return undefined;
	}

function suggest(conv, what, arrSuggest, userInput){

		let resposta = buildSpeech(getRandomEntry(NO_SUGGESTION));

		let refused;
		let refusedAny = false;

		let FIRST_SUGGESTIONS;

		//what the user wants
		if(what === actions.CERVEJA_ACTION){
			if(getStorage(conv).estilos_sugeridos){
				refused = getStorage(conv).estilos_sugeridos;
			}
			FIRST_SUGGESTIONS = FIRST_STYLE_SUGGESTONS;
		}
		else
		{
			if(getStorage(conv).comidas_sugeridas){
				refused = getStorage(conv).comidas_sugeridas;	
			}
			FIRST_SUGGESTIONS = FIRST_FOOD_SUGGESTIONS;
		}

		let suggestions = [];
		
		//if there is any food that was already suggest it means the user refused the first suggestion
		if(refused){

			refusedAny = true;

			//remove from the list those already refused foods
			for(var i =0; i < arrSuggest.length;i++){
				if(refused.indexOf(arrSuggest[i]) == -1){
					suggestions.push(arrSuggest[i]);
				}
			}
		}
		else{
			suggestions = arrSuggest;
		}

		if(suggestions.length > 0){
			let suggestion = getRandomEntry(suggestions);
			if(!refusedAny){//this is the first suggestion
				resposta =  buildSpeech(getRandomEntry(ACK) + getRandomEntry(FIRST_SUGGESTIONS).replace('$1',userInput).replace('$2',suggestion) + getRandomEntry(FIM_FRASE));	
			}
			else{//this is the following suggestions
				resposta =  buildSpeech(getRandomEntry(ACK) + getRandomEntry(SECOND_SUGGESTIONS).replace('$2',suggestion) + getRandomEntry(FIM_FRASE));
			}
			
			//keeps track of what food was already suggested
			if(what === actions.CERVEJA_ACTION){
				if(!getStorage(conv).estilos_sugeridos){
					getStorage(conv).estilos_sugeridos = suggestion;
				}
				else{
					getStorage(conv).estilos_sugeridos += ',' + suggestion;
				}
			}
			else{
				if(!getStorage(conv).comidas_sugeridas){
					getStorage(conv).comidas_sugeridas = suggestion;
				}
				else{
					getStorage(conv).comidas_sugeridas += ',' + suggestion;
				}
			}

			conv.contexts.set(contexts.CTX_SUGGESTED,5);

			conv.ask(buildSpeech(resposta));
			conv.ask(new Suggestions([suggestChips.DELICIA,suggestChips.OUTRA_COISA])); // this is called when suggesting food, we wait for the user reply (yes or no)
		}

		closeConversationWithCard(conv);// this is called when finishing talking to the user
	}

function getEstilosByFood(food){
	let estilos = [];
	var harmoniza = readJsonFile(HARM_JSON_FILE);
	for(var i=0, maxEstilos = harmoniza.estilos.length; i< maxEstilos; i++){
		for(var j=0, maxComidas = harmoniza.estilos[i].comidas.length;  j<maxComidas; j++){
			let comida = harmoniza.estilos[i].comidas[j];
			if (comida.toLowerCase() === food.toLowerCase()) {
				estilos.push(harmoniza.estilos[i].nome);
			}
		}
		
	}
	return estilos;
}

function closeConversationWithCard(conv){
	conv.close(new BasicCard({
		text:resposta,
		subtitle: 'Sites com harmonização de cervejas',
		title: 'Harmonização de Cervejas',
		image: new Image({
		    url: 'https://www.revide.com.br/media/cache/aa/68/aa687d9843b4339605d1a372d2c86b4d.jpg',
		    alt: 'imagem de 4 pequenos copos de cerveja de estilos diferentes, com um mini prato com diferentes comidas em frente a cada um, em cima de uma tábua de madeira.',
		  }),
		buttons: new Button({
		    title: 'Brejas',
		    url: 'http://www.brejas.com.br/harmonizacao-cerveja.shtml',
		  }),
	}));
}

function requestPermission (conv) {
	const options = {
	    context: getRandomEntry(PERMISSION),
	    permissions: ['NAME'],
	  };
	conv.ask(new Permission(options));
}

function finishApp(conv){
	let resposta = buildSpeech(getRandomEntry(ACK) +  getRandomEntry(NON_PERM_ENDING));
	//check if the user has already granted permission to save his info
	if(getStorage(conv).userName){
		resposta = buildSpeech(getRandomEntry(ACK) +  getRandomEntry(PERM_ENDING).replace('$1',getStorage(conv).userName));
	}
	conv.close(resposta);
}

function saveName(conv){

	getStorage(conv).name = conv.user.name.given;
}


function setIBU(conv,bitterness){

	let ibu = getStorage(conv).ibu;

	if(bitterness === entities.BITT_MAIS){
		ibu += IBU_INCREMENT;
	}
	else if(bitterness === entities.BITT_MUITO_MAIS){
		ibu += (IBU_INCREMENT * 2);
	}
	else if(bitterness === entities.BITT_MENOS){
		ibu -= IBU_INCREMENT;
	}
	else if(bitterness === entities.BITT_MUITO_MENOS){
		ibu -= (IBU_INCREMENT * 2);
	}

	getStorage(conv).ibu = ibu;
}

function setSRM(conv, color){

	let srm = getStorage(conv).srm;

	if(color === entities.COLOR_ESCURA){
		srm += SRM_INCREMENT;
	}
	else if(color === entities.COLOR_MUITO_ESCURA){
		srm += (SRM_INCREMENT * 2);
	}
	else if(color === entities.COLOR_CLARA){
		srm -= SRM_INCREMENT;
	}
	else if(color === entities.COLOR_MUITO_CLARA){
		srm -= (SRM_INCREMENT * 2);
	}

	getStorage(conv).srm = srm;
}

function setAlcVol(conv, alcoholicVol){
		
	let teorA = getStorage(conv).teorA;

	if(alcoholicVol === entities.ALC_VOL_ALTO){
		teorA += TeorA_INCREMENT;
	}
	else if(alcoholicVol === entities.ALC_VOL_MUITO_ALTO){
		teorA += (TeorA_INCREMENT * 2);
	}
	else if(alcoholicVol === entities.ALC_VOL_BAIXO){
		teorA -= TeorA_INCREMENT;
	}
	else if(alcoholicVol === entities.ALC_VOL_MUITO_BAIXO){
		teorA -= (TeorA_INCREMENT * 2);
	}

	getStorage(conv).teorA  = teorA;
}