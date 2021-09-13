let mongoose = require('mongoose');

//Article schema
let commentsSchema = mongoose.Schema({
  user:{
    type:String,
    required:true
  },
  post:{
    type:String,
    required:true
  },
  body:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model('Comments',commentsSchema);
