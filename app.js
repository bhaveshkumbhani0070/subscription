var express = require('express');
var app = express(); // create our app w/ express
var port = process.env.port || 3000; // set the port

var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var api = require(__dirname + '/api/sub');

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.use("/npm", express.static(__dirname + '/node_modules'));

// app.get('/', function(req, res) {
//     res.sendFile('index.html', { 'root': "view" });
// });

app.post('/api/subscript', api.subscript);
app.get('/api/get_sub', api.all_sub);
app.get('/api/unsubscript/:id', api.unsubscript);


// cron for send notification to staff members

app.listen(port);
console.log("App listening on port " + port);