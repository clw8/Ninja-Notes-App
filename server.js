var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var jsonfilepath = path.join(__dirname, 'public', 'data.json');
var bodyParser = require('body-parser');
var EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

app.use(express.static("./public"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next){
	console.log(`${req.method} for ${req.url}`);
	next();
})

app.get('/help', function(req, res){
	fs.readFile("./public/help.html", "UTF-8", function(err, html){
					res.writeHead(200, {"ContentType": "text/html"});
					res.end(html)
				})
})

app.get('/api', function(req, res){
	// ONE WAY TO DO IT.....sends JSON string
	fs.readFile("./public/data.json", function(err, data){
		var parseddata = JSON.parse(data);
		res.send(parseddata);
	});
	
	//SECOND WAY TO DO IT....sends JSON file
	// var readable = fs.createReadStream(jsonfilepath);
	// res.writeHead(200, {"ContentType": "application/json"});
	// readable.pipe(res);

	myEmitter.emit('connect');

})

app.post('/api', updateMissions)

function updateMissions(req, res){
	console.log(typeof req.body);

	fs.readFile("./public/data.json", function(err, data){
		var currentData = JSON.parse(data);
		var newData = currentData;
		newData.missions.push(req.body);
		fs.writeFile("./public/data.json", JSON.stringify(newData, null, 2), 'utf8', function (err) {
    	if (err) {
        	return console.log(err);
    	}

   		 console.log("The file was saved!");
		}); 


	});

};

myEmitter.on('connect', function(){console.log('API call made')});

app.listen(3000);

