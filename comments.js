// create web server with express

const express = require('express');
const router = express.Router();

// import comment model
const Comment = require('../models/comment');

// create a comment
router.post('/comment', (req, res) => {
    // create a comment
    Comment.create(req.body).then((comment) => {
        res.send(comment);
    });
});

// get all comments
router.get('/comments', (req, res) => {
    Comment.find({}).then((comment) => {
        res.send(comment);
    });
});

// get a specific comment
router.get('/comment/:id', (req, res) => {
    Comment.findOne({_id: req.params.id}).then((comment) => {
        res.send(comment);
    });
});

// update a comment
router.put('/comment/:id', (req, res) => {
    Comment.findOneAndUpdate({_id: req.params.id}, req.body).then(() => {
        Comment.findOne({_id: req.params.id}).then((comment) => {
            res.send(comment);
        });
    });
});

// delete a comment
router.delete('/comment/:id', (req, res) => {
    Comment.findOneAndDelete({_id: req.params.id}).then((comment) => {
        res.send(comment);
    });
});

module.exports = router;