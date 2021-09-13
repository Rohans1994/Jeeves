const multer = require("multer"),
fs = require("fs"),
path = require('path');

const svgpngjpgFilter = (req, file, cb) => {
    console.log('file-----', file)
    if (file.mimetype !== "image/svg+xml" && file.mimetype !== "image/png" && file.mimetype !== "image/jpg" && file.mimetype !== "image/jpeg") {
      return cb('An error has occured', false);
    } else {
      cb(null, true);
    }
  };

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
});

exports.multiUpload = multer({
    storage: storage,
    fileFilter: svgpngjpgFilter,
    limits: { fileSize: 1 * 1024 * 1024 }
}).array('file');

exports.singleUpload = multer({
    storage: storage,
    fileFilter: svgpngjpgFilter,
    limits: { fileSize: 1 * 1024 * 1024 }
}).single('file');