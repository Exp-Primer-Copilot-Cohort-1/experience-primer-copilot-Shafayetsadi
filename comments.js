// create web server
var express = require('express');
var app = express();
// create database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('comment.db');
// create table
db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, comment TEXT)");
});
// set view engine
app.set('view engine', 'ejs');
// set static file
app.use(express.static('public'));
// set body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
// set method override
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
// set routes
// index
app.get('/', (req, res) => {
    db.all("SELECT * FROM comments", function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', { comments: rows });
        }
    });
});
// new
app.get('/new', (req, res) => {
    res.render('new');
});
// create
app.post('/', (req, res) => {
    var name = req.body.name;
    var comment = req.body.comment;
    db.serialize(function() {
        db.run("INSERT INTO comments (name, comment) VALUES (?, ?)", name, comment);
    });
    res.redirect('/');
});
// edit
app.get('/:id/edit', (req, res) => {
    var id = req.params.id;
    db.serialize(function() {
        db.get("SELECT * FROM comments WHERE id = ?", id, function(err, row) {
            if (err) {
                console.log(err);
            } else {
                res.render('edit', { comment: row });
            }
        });
    });
});
// update
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var name = req.body.name;
    var comment = req.body.comment;
    db.serialize(function() {
        db.run("UPDATE comments SET name = ?, comment = ? WHERE id = ?", name, comment, id);
    });
    res.redirect('/');
});
// delete
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    db.serialize(function() {
        db.run("DELETE FROM comments WHERE id = ?", id);
    });
    res.redirect('/');
});
// set server