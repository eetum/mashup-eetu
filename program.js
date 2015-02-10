});

});

//Program.js
//author: Eetu
//Jan.2015
//Based on https://github.com/timole/mashup-tile/blob/master/program.js


//Reads book data from University of Helsinki and outputs it on screen.
//and stores it on local mongoDB called booksDB.

//TODO
//server should use data from DB if available 
//AND it is valid. If not only then fetch it from original source.

var http = require('http');
var _ = require("lodash");

var port = 80;
var statusHtml = "<html><body>No data available!</body></html>";

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html', 'charset':'utf-8'});
	res.write('<!DOCTYPE "html">');
    res.write('<meta charset="utf-8">');
    res.end(statusHtml);
}).listen(port, '127.0.0.1');

console.log('Server running in port ' + port);





var url = 'http://metadata.helmet-kirjasto.fi/search/author.json?query=Campbell';

http.get(url, function(res) {

    var body = "";

    res.on("data", function(chunk) {
        body += chunk;
    });

    res.on("end", function() {
	    var books = [];

        //var authorRes = JSON.parse(body);

        //old way
        //for (var i = 0; i < authorRes.records.length; i++) {
        //	var title = authorRes.records[i].title;
        //	var year = authorRes.records[i].year;
        //	books.push({displayName: title, year: year});
		
		//new way
        var id = 0;
		var books = _.map(JSON.parse(body).records, function(d) {
			//console.log(d);
            id++;
            
            return {
				displayName: d.title,
				year: d.year,
                id: id

			};
		});
		//console.log(books);
        
        var jsonOutput = JSON.stringify(books);
        //var encoded = btoa(json);
        console.log(jsonOutput);

        
        //Connecting to MongoDB
        var MongoClient = require('mongodb').MongoClient;
        var dbcon = MongoClient.connect("mongodb://localhost:27017/data", function(err, db) {
            if(!err) {
                console.log("We are connected to DB");
                //return db;
            }

            //Creating a collection if does not exist.
              
            db.createCollection('booksDB', function(err, booksDB) {});
            //var doc1 = {'nimi': 'testinimi', 'id': '0', 'vuosi': '1900'};

            var collection = db.collection('booksDB');
                
            //Let's insert some content
            //TODO not inserting duplicates - either delete collection on data refresh or build more complex system.
            collection.insert(books, {w:1}, function(err, result) {});
        });

        
        //};
        //Let's replace error HTML with content.
        statusHtml = "<html><body><h1>Kirjaluettelo</h1>";
        _.map(books, function(n) { 
        	statusHtml += "<p>"+ n.id + " " + n.displayName + " " + n.year + "</p>"; 
        	//console.log(n.displayName, ", ", n.year);
        	
        });
        statusHtml += "</body></html>";
    	
    });





}).on("error", function(e) {
      console.log("Error: ", e);
});
