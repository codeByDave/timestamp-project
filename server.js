// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var moment = require("moment");

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/*', function (req, res) {
	
	//Extract parameters from URL
	var date = req.params[0];
	var month = date.split(' ')[0];
	
	//If the query is not empty 
	if (date.length) {
		
		res.writeHead(200, {'content-type':'application/JSON'});
		
		//Check if the date format is valid in strict mode to match either one of the 
		// specified formats
		var isValid = moment(date, ['YYYY-MM-DD'], true).isValid(); 

		// If the format is valid and the month is a valid string or a number, in which case is unix format
		if (isValid == true || !isNaN(month)){
			
			// If the date is a string, split by the space character
			// and join them with a space, then calculate the date in UNIX
			if (isNaN(date.split(' ')[0]) == true) {
				
				var naturalTime = date;
				
				//Get the unix time and convert it to seconds
				var unixTime = (new Date(naturalTime).getTime())/1000;
				
			// Else, if its a number, a unix format,
			// convert the unix time to the right format
			} else {
				
				var unixTime = date;
				var naturalTime = moment.unix(unixTime).format("YYYY-MM-DD");
			}
		  
		//Else, if the format is not valid 
		} else {
			
			var naturalTime = null;
			var unixTime = null;
			
		}
		
		//Create the JSON object, and then send it back to the client
		var JSONres = {
			"unix" : unixTime,
			"natural" : naturalTime
		}
		
		res.end(JSON.stringify(JSONres));
		
	//Else, if the input is empty (there is no query)
	} else {
		res.sendFile(__dirname + '/index.html');
	}
   
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
