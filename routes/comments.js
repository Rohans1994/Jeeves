const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Topic = require('../models/topic');
const Posts = require('../models/posts');
const Comment = require('../models/comments');
const paginatedResult = require('../helpers/paginate');
const checkAuthentication = require('../helpers/checkAuthentication');


//GET all posts with comments
router.get('/', checkAuthentication, paginatedResult(Posts), async function (req, res) {
  res.json(res.paginatedResult)
});

//UI to add comments route
router.get('/add/:userId/:postId', checkAuthentication, function (req, res) {
  console.log('userId', req.params.userId);
  console.log('postId', req.params.postId)
  res.render('add_comment', {
    title: 'Add Comment',
    userId: req.params.userId,
    postId: req.params.postId
  });
});

//POST Comments route
router.post('/add/:userid/:postid',checkAuthentication, function (req, res) {
  req.checkBody('comment', 'Comment is required').notEmpty();

  //Get errors
  let errors = req.validationErrors();
  console.log(req.body.comment);
  console.log('userid', req.params.userid);
  console.log('postId', req.params.postid)
  if (errors) {
    res.render('add_comment', {
      title: 'Add Comment',
      errors: errors
    });
  }
  else {
    let comment = new Comment();
    comment.body = req.body.comment;
    comment.user = req.params.userid;
    comment.post = req.params.postid;
    comment.save(function (err) {
      if (err) {
        console.log(err);
        return;
      } else {
        Posts.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.postid) },
          { $addToSet: { comments: comment.body } },
          { new: true }).then(data => {
            req.flash('success', 'comment Added');
            res.redirect('/');
          })
      }
    });
  }
});


module.exports = router;
