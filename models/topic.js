let mongoose = require('mongoose');

//Article schema
let topicSchema = mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  author:{
    type:String,
    required:true
  },
  /* body:{
    type:String,
    required:true
  } */
});

module.exports = mongoose.model('Topic',topicSchema);
