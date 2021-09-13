const express = require('express');
const router = express.Router();
const Topic = require('../models/topic');
const User = require('../models/user');
const Posts = require('../models/posts');
const paginatedResult = require('../helpers/paginate');
const checkAuthentication = require('../helpers/checkAuthentication');

//GET all topics
router.get('/',checkAuthentication,paginatedResult(Topic), (req,res)=>{
  console.log('Inside view topic---')
  res.json(res.paginatedResult)
})


//UI to add Topics
router.get('/add',checkAuthentication,function(req,res){
  res.render('add_topic',{
    title:'Add Topic'
  });
});

//Post route to add Topics
router.post('/add',checkAuthentication,function(req,res){
  req.checkBody('title','Title is required').notEmpty();

  //Get errors
  let errors = req.validationErrors();
  console.log(req.body.title)
  console.log(req.user._id)  
  if (errors) {
    res.render('add_topic',{
      title:'Add Topic',
      errors:errors
    });
  }
  else {
    let topic = new Topic();
    topic.title = req.body.title;
    topic.author = req.user._id;
    topic.save(function(err){
      if (err) {
        console.log(err);
        return;
      }else {
        req.flash('success','Topic Added');
        res.redirect('/');
      }
    });
  }
});


//Get single Topic
router.get('/:id', function(req,res){
    Topic.findById(req.params.id,function(err, topic){
     User.findById(topic.author,function(err,user){
      Posts.find({topic: req.params.id}, function(err, posts){
        //console.log('postsss', JSON.stringify(posts))
        res.render('topic',{
          topic:topic,
          author:user.name,
          posts: posts
        });
      })
    });
  });
});

module.exports = router;
