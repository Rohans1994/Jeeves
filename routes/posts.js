"use strict";
const express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
    Posts = require('../models/posts'),
    multiUpload = require('../helpers/fileUploads').multiUpload,
    singleUpload = require('../helpers/fileUploads').singleUpload;
const Topic = require('../models/topic');
const paginatedResult = require('../helpers/paginate');
const checkAuthentication = require('../helpers/checkAuthentication');

//GET all posts
router.get('/', checkAuthentication, paginatedResult(Posts), function (req, res) {
    res.json(res.paginatedResult);

});


/* const storage = multer.diskStorage({
    destination: '../server',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
}).array('file'); */

//Upload multiple file at the same time using multer
router.post('/upload/:id',checkAuthentication, (req, res) => {
    singleUpload(req, res, (err) => {
        if (err) {
            res.json('Error Occured');
        }
        else {
            var fileData = req.file;
            //console.log(fileData);
            let newPost = {};
            newPost['name'] = fileData.originalname,
            newPost['fileType'] = fileData.mimetype;
            newPost['topic'] = req.params.id
            Posts.insertMany(newPost);
            req.flash('success', 'Post Added Successfully');
            res.redirect('/')
            //res.json('File uploaded successfully');
        }
    })
});

//get details of files uploaded
/* router.get('/', async (req, res) => {
    var data = await file.find({});
    if(data){
        res.json(data);
    }else{
        res.json('No data found');
    }
}) */

// UI to upload POSTS
router.get('/add/:id', checkAuthentication, function (req, res) {
    Topic.findById(req.params.id, function (err, topic) {
        res.render('add_post', {
            title: 'Upload Posts for below topic',
            topic: topic
        });
    });

});


module.exports = router