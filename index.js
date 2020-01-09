var https = require('https');

// Parameters of the lambda function explained here
// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
exports.handler = (event, context, callback) => {

	try {
		if (event.session.new) {
			console.log("NEW SESSION");
		}

		switch (event.request.type) {
			case "LaunchRequest":
				console.log("LAUNCH REQUEST");
	                       onLaunchRequest(event, context)
				break;
			case "IntentRequest":
				console.log("INTENT REQUEST");
	                       onIntentRequest(event, context)
				break;
			case "SessionEndedRequest":
				onSessionEnded(context)
				console.log("SESSION END REQUEST");
				break;
			default:
				context.fail("INVALID REQUEST TYPE:" + event.request.type);
		}
	} catch (error) {
		context.fail("Exception: " + error)
	}
}



function buildSpeechletResponse (outputText, shouldEndSession) {
	return {
		outputSpeech: {
			type: "PlainText",
			text: outputText
		},
		card: {
			type: "Simple",
			title: "Prayer Calls",
			content: outputText
		},
		shouldEndSession: shouldEndSession
	}
}


function onLaunchRequest(event, context) {
	console.log("In function onLaunchRequest");
	context.succeed(
		generateResponse(buildSpeechletResponse(
			"Welcome to Prayer times tracker. Ask me what prayer time we are at now or how long to the next prayer time.", false))
	);
}

function onIntentRequest(event, context,callback) {
	console.log("In function onIntentRequest")
	
	const intent = event.request.intent;

	if (intent.name === 'getPrayer') {
		console.log("Calling the Get Prayer intent");
		getPrayer(intent, context,callback);
	} else if (intent.name === 'getPrayers') {
		console.log("Calling the Get Prayers intent");
		getPrayers(intent, context);
	} else if (intent.name === 'setPrayerTimesasAlarm') {
		console.log("Calling the Get Prayers intent");
		setPrayerTimesasAlarm(intent,context);
	} else if (intent.name === 'exitSetmyPrayerTimes') {
		console.log("Calling the Get Prayers intent");
		exitSetmyPrayerTimes(intent,context);
	} else if (intent.name === 'AMAZON.NavigateHomeIntent' || intent.name === 'AMAZON.StopIntent' || intent.name === 'AMAZON.CancelIntent' || intent.name === 'AMAZON.ExitIntent'){             
		exitPrayer(intent, context, callback);
	} else if (intent.name === 'AMAZON.HelpIntent') {
		helpPrayer(intent, context);
	}
	else {
		context.fail("Could not indentify indent: " + intent.name);
	}

}

function helpPrayer(intent,context){
	console.log("help intent");

	var speechOutput = "Please use either Set prayer times as alarm or What are the prayer times today commands";
	context.succeed(generateResponse(buildSpeechletResponse(speechOutput, false), {}));
}

function exitSetmyPrayerTimes(intent,context,callback) {
	onSessionEndRequest(intent,context); 
}

function exitPrayer(intent,context,callback) {
	onSessionEndRequest(intent,context); 
}

function getPrayer(intent, context,callback) {
 	var endpoint = "https://api.aladhan.com/v1/timingsByAddress?address=sherborn ma,usa&method=2";
	
 	var time = intent.slots.value;
	var hour = time.substring(0,time.indexOf(":"));
 	var minute = time.substring(time.indexOf(":")+1,time.length);

 	var body = "";
 	https.get(endpoint, (response) => {
 		response.on('data', (chunk) => { 
 			console.log("Received data response");
 			body += chunk;
 		});

 		response.on('end', () => {
 			var jsonData = JSON.parse(body);
 			var prayerData = jsonData["data"];
 			var today = new Date();
 		
 			var currentPrayerTime = "";
 			var timings = "";
 			var fajr = "";
 			var fajrH = "";
 			var fajrM = "";
        	var dhuhr = "";
        	var dhuhrH = "";
        	var dhuhrM = "";
        	var asr = "";
        	var asrH = "";
        	var asrM = "";
        	var maghrib = "";
        	var maghribH = "";
        	var maghribM = "";
        	var isha = "";
        	var ishaH = "";
        	var ishaM = "";
			for (var key in prayerData) {
					timings = prayerData["timings"];
					fajr = timings['Fajr'];
					fajrH = fajr.substring(0,fajr.indexOf(":"));
					fajrM = fajr.substring(fajr.indexOf(":")+1,fajr.length);
					dhuhr = timings['Dhuhr'];
					dhuhrH = dhuhr.substring(0,dhuhr.indexOf(":"));
					dhuhrM = dhuhr.substring(dhuhr.indexOf(":")+1,dhuhr.length);
					asr = timings['Asr'];
					asrH = asr.substring(0,asr.indexOf(":"));
					asrM = asr.substring(asr.indexOf(":")+1,asr.length);
					maghrib = timings['Maghrib'];
					maghribH = maghrib.substring(0,maghrib.indexOf(":"));
					maghribM = maghrib.substring(maghrib.indexOf(":")+1,maghrib.length);
					isha = timings['Isha']
					ishaH = isha.substring(0,isha.indexOf(":"));
					ishaM = isha.substring(isha.indexOf(":")+1,isha.length);
					
			}
			if(hour<=ishaH && minute<=ishaM)
				currentPrayerTime = 'Maghrib'
			if(hour<=maghribH && minute<=maghribM)
				currentPrayerTime = 'Asr'
			if(hour<=asrH && minute<=asrM)
				currentPrayerTime = 'Dhuhr'
			if(hour<=dhuhrH && minute<=dhuhrM)
				currentPrayerTime = 'Fajr'
			else //(hour<=fajrH && minute<=fajrM)
				currentPrayerTime = 'Isha'
			
		
				
 			console.log("hour:" +hour + "minute:" +minute+"fajrH:" +fajrH+"fajrm:" +fajrM +"dhuhrH:" +dhuhrH+"dhuhrM:" +dhuhrM +"asr:" +asrH+"asr:" +asrM +".Prayer time is  " + currentPrayerTime + ". Thank you for using the set my prayer times. Good bye.");

 			var speechOutput = "hour:" +hour + "minute:" +minute+"fajrH:" +fajrH+"fajrm:" +fajrM +"dhuhrH:" +dhuhrH+"dhuhrM:" +dhuhrM +"asr:" +asrH+"asr:" +asrM +".Prayer time is  " + currentPrayerTime + ". Thank you for using the set my prayer times. Good bye.";
 			context.succeed(generateResponse(buildSpeechletResponse(speechOutput, false), {}));
 		});

 	});
}



function getPrayers(intent, context) {
 	var endpoint = "https://api.aladhan.com/v1/timingsByAddress?address=sherborn ma,usa&method=2";

 	var body = "";
 	https.get(endpoint, (response) => {
 		response.on('data', (chunk) => { 
 			console.log("Received data response");
 			body += chunk
 		});

 		response.on('end', () => {
 			var jsonData = JSON.parse(body);
 			var prayerData = jsonData["data"];
 			var timings = "";
 			var fajr = "";
        	var dhuhr = "";
        	var asr = "";
        	var maghrib = "";
        	var isha = "";
			for (var key in prayerData) {
					timings = prayerData["timings"];
					fajr = timings['Fajr'];
					dhuhr = timings['Dhuhr'];
					asr = timings['Asr'];
					maghrib = timings['Maghrib'];
					isha = timings['Isha'];
			}
			
 			console.log("Prayer times are fajr " + fajr + ", dhuhr " + dhuhr +  ", asr " + asr + ", maghrib" + maghrib + "isha " + isha);

 			var speechOutput = "Prayer times are fajr:" + fajr + ",dhuhr:" + dhuhr +  ",asr:" + asr + ",maghrib:" + maghrib + ",isha:" + isha +". Thank you for using the set my prayer times. Good bye.";
 			context.succeed(generateResponse(buildSpeechletResponse(speechOutput, false), {}));
 		});

 	});
}


function setPrayerTimesasAlarm(intent, context) {
 	var endpoint = "https://api.aladhan.com/v1/timingsByAddress?address=sherborn ma,usa&method=2";

 	var body = "";
 	https.get(endpoint, (response) => {
 		response.on('data', (chunk) => { 
 			console.log("Received data response");
 			body += chunk;
 		});

 		response.on('end', () => {
 			var jsonData = JSON.parse(body);
 			var prayerData = jsonData["data"];
 			var timings = "";
 			var fajr = "";
        	var dhuhr = "";
        	var asr = "";
        	var maghrib = "";
        	var isha = "";
			for (var key in prayerData) {
					timings = prayerData["timings"];
					fajr = timings['Fajr'];
					dhuhr = timings['Dhuhr'];
					asr = timings['Asr'];
					maghrib = timings['Maghrib'];
					isha = timings['Isha'];
			}
			
 			console.log("Prayer times are fajr " + fajr + ", dhuhr " + dhuhr +  ", asr " + asr + ", maghrib" + maghrib + "isha " + isha);

 			var speechOutput = "Alexa, Set alarm at " + fajr + " and " + dhuhr +  " and  " + asr + " and " + maghrib + " and " + isha +".";
 			context.succeed(generateResponse(buildSpeechletResponse(speechOutput, false), {}));
 		});

 	});
}
// Note the error here: event and context has to be passed in
function onSessionEndRequest(intent,context) {
	console.log("In function onSessionEndRequest");

    var speechOutput = "Thank you for trying the Set my Prayer Times. Have a nice day!";

	context.succeed(generateResponse(buildSpeechletResponse(speechOutput, true), {}))
}

function onSessionEnded(context) {
	console.log("In function onSessionEndRequest");

    var speechOutput = "Thank you for trying the Set my Prayer Times. Have a nice day!";

	context.succeed(generateResponse(buildSpeechletResponse(speechOutput, true), {}))
}

function buildSpeechletResponse(outputText, shouldEndSession) {
	return {
		outputSpeech: {
			type: "PlainText",
			text: outputText
		},
		card: {
			type: "Simple",
			title: "Stock Tracker",
			content: outputText
		},
		shouldEndSession: shouldEndSession
	}
}


function generateResponse(speechletResponse, sessionAttributes) {

	return {
		version: "1.0",
		sessionAttributes: sessionAttributes,
		response: speechletResponse
	}
}
