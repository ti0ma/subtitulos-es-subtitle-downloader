var express = require('express'),
	http = require('http'),
	path = require('path'),
	favicon = require('static-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	routes = require('./routes'),
	show = require('./routes/show'),
	fs = require ('fs'),
	app = express(), tmpFolder;

// setting tmp dir
tmpFolder =  path.join(__dirname, 'tmp');
// creating tmp folder if not exists
if (!fs.existsSync(tmpFolder)) {
	fs.mkdir(tmpFolder);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Injection of global variables
app.use(function (req, res, next) {
	res.locals({
		tmpFolder: tmpFolder
	});
	next();
});
app.use(app.router);


app.get('/', routes.index);
app.get('/show/:id/:lang', show.show);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
