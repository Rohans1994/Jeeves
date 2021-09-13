let mongoose = require('mongoose');

// File Schema
let postsSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  fileType:{
    type: String,
    required: true
  },
  topic:{
    type: String,
    required: true
  },
  comments:{
    type: Array,
    required: false
  }
});

module.exports = mongoose.model('Posts', postsSchema);