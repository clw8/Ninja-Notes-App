var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var jsonfilepath = path.join(__dirname, 'public', 'data.json');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

var EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

app.use(express.static("./public"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next){
	console.log(`${req.method} for ${req.url}`);
	next();
});


app.get('/api', function(req, res){
	
	fs.readFile("./public/data.json", function(err, data){
			var parseddata = JSON.parse(data);
			var queryString = req.query.scroll;
			var data= filter_json(parseddata, queryString);
			if(data){
				res.send(data)}
			else{
				res.status(500).send('No such scroll exists!');
			};
		});

		myEmitter.emit('connect');

});

app.post('/api', updateMissions);

function updateMissions(req, res){
	console.log(req.body);

	fs.readFile("./public/data.json", function(err, data){
		var currentData = JSON.parse(data);
		
		var DupData = filter_json(currentData, req.body.scroll);
		if(DupData.length>0 && req.body.overwrite===false){
			res.status(500).send('There is already a scroll by that name! Overwrite?');
			res.end();
		}
		else{
			if(req.body.overwrite===false){
				console.log("newitem");
				delete req.body.overwrite;
				console.log(req.body);
				currentData.push(req.body);
				console.log("newData" + currentData);}
			else if(req.body.overwrite===true){
				currentData= neg_filter_json(currentData, req.body.scroll);
				delete req.body.overwrite;
				currentData.push(req.body);
			}
			fs.writeFile("./public/data.json", JSON.stringify(currentData, null, 2), 'utf8', function (err) {
		    	if (err) {
		        	return console.log(err);
		    	}
	   		 console.log("The file was saved!");
	   		 res.json("success");
			}); 
		}

	});
	

};

myEmitter.on('connect', function(){console.log('API call made')});

app.listen(port);

function filter_json(jsonObj, scrollName){
	return jsonObj.filter(function(obj){
			return obj.scroll===scrollName;
	})

}

function neg_filter_json(jsonObj, scrollName){
	return jsonObj.filter(function(obj){
			return obj.scroll!==scrollName;
	})

}