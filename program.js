//Program.js
//author: Eetu
//Jan.2015
//Based on https://github.com/timole/mashup-tile/blob/master/program.js


//Reads book data from University of Helsinki and outputs it on screen.

var http = require('http');
var _ = require("lodash");

var port = 80;
var statusHtml = "<html><body>No data available!</body></html>";

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html', 'charset':'utf-8'});
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
		var books = _.map(JSON.parse(body).records, function(d) {
			return {
				displayName: d.title,
				year: d.year
			};
		});
		console.log(books);
        	
        //};
        //Let's replace error HTML with content.
        statusHtml = "<html><body><h1>Kirjaluettelo</h1>";
        _.map(books, function(n) { 
        	statusHtml += "<p>" + n.displayName + " " + n.year + "</p>"; 
        	//console.log(n.displayName, ", ", n.year);
        	
        });
        statusHtml += "</body></html>";
    	
    });



}).on("error", function(e) {
      console.log("Error: ", e);
});
