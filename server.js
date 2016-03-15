var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var credentials = require('./credentials.js');
var session = require("express-session");
app.use(session({
	resave : false,
	saveUninitialized : false,
	secret : credentials.cookieSecret
}));
app.use(cookieParser(credentials.cookieSecret));

var mysql = require('mysql');
var conn = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'root',
	database : 'todo_rest'
});

app.use(bodyParser.json());

// app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(__dirname + '/public'));
app.set("views", __dirname + "/public/");
app.engine("html", require ("ejs").renderFile);
app.set("view engine", "html");

app.get('/', function(req,res) {
	res.render('index.html');
});

app.put("/login", function(req,res)
{
	console.log("logging in");
	console.log(req.body.username);
	console.log(req.body.password);
	conn.query("SELECT id FROM user WHERE username like '"+req.body.username+"' and password like '"+req.body.password+"'", function(err,rows,fields)
	 {
			if (err)
			{
					console.log("no user found");
					console.log(err);
			}
			else
			{
				console.log("logged in successfully");
				console.log(rows[0].id);
				req.session.user = rows[0].id;
				res.send({id:rows[0].id});
				// res.send({test:"test"});
				// res.render("index.html");
				// res.send({data : rows});
				// console.log({data : rows});
				// res.send(rows);
				// console.log(rows);
			}
	});
});

app.get("/logout", function(req,res)
{
	console.log("logged out");
	req.session.user = null;
	res.render("index.html");
});

app.use(session({
	resave : false,
	saveUninitialized : false,
	secret : credentials.cookieSecret,
	key : "user"
}));

app.get("/removeSession", function(req,res)
{
	console.log("removing session");
	delete req.session.user;
	res.render("index.html");
});

app.get("/newError", function(req,res)
{
	req.session.flash = "Some error!";
	res.render("index.html");
});

app.get("/error", function(req,res)
{
	res.locals.flash = req.session.flash;
	delete req.session.flash;
	res.render("index.html");
});

app.get("/signed", function(req,res)
{
	res.cookie("testCookie", {test : "test"}, {signed : true});
	res.render("index.html");
});

app.get("/unsigned", function(req,res)
{
	res.cookie("unsignedCookie", {test : "test"});
	res.render("index.html");
});

app.get("/allCookies", function(req,res)
{
	console.log("Cookies: ", req.cookies);
	Cookies: {unsignedCookie: {test: "test"}}
});

app.get("/allSignedCookies", function(req,res)
{
	console.log("Cookies: ", req.signedCookies);
	Cookies: {testCookie: {test: "test"}}
});

app.get("/specificCookie", function(req,res)
{
	console.log(req.signedCookies.testCookie);
	{test: "test"}
});

app.get("/clearCookie", function(req,res)
{
	console.log("Removing cookie: "+req.signedCookies.testCookie);
	res.clearCookie("testCookie");
	res.render("index.html");
});

app.get('/data', function(req,res) {
	console.log(req.xhr);
	res.send({data : "Response from the server"});
});

conn.connect();

app.get('/getAll', function(req,res)
{

	console.log(req.session.user);
	console.log(req.session.user.id);
	if (req.session.user)
	{
		conn.query("SELECT * FROM to_do WHERE user_id ='"+req.session.user+"'", function(err,rows,fields)
		{
			if (err)
			{
				console.log("Something is amiss...");
				console.log(err);
			}
			else
			{
				// res.send({data : rows});
				// console.log({data : rows});
				// if (req.session.user)
				// {
				// 	req.session.user.id;
				// }
				res.send(rows);
				console.log(rows);
			}
		});
	}
});

app.post('/send', function(req,res) {
	res.send({data : req.body.data + " RESPONSE FROM POST"});
});

// UPDATE jobs SET minimum_salary = 42000, maximum_salary = 65000 WHERE id = 19;
// var item = document.updateForm.updateItem.value;

app.put('/send/:id', function(req, res)
{
  console.log("in app.put/send");
  conn.query("UPDATE to_do SET item = '"+req.body.item+"' WHERE id = "+req.params.id);
});

// DELETE FROM projects WHERE id = 14;

app.delete('/del/:id', function(req, res)
{
  console.log("in app.delete/del");
  conn.query("DELETE FROM to_do WHERE id = "+req.params.id);
});

// INSERT INTO projects (id, name, start_date) VALUES (14, 'Project X', CURDATE());

app.post('/add', function(req, res)
{
  console.log("in app.post/add");
  conn.query("INSERT INTO to_do (item, user_id) VALUES ('"+req.body.item+"',"+req.session.user+")");
});

app.post('/signup', function(req, res)
{
  console.log("in app.post/signup");
  conn.query("INSERT INTO user (username, password) VALUES ('"+req.body.username+"','"+req.body.password+"')");
});

app.get('/hello', function(req,res) {
	res.send('Hello world');
});

app.listen(3000, function() {
	console.log("listening on 3000");
});
