const multer = require('multer');


const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
    file.mimetype === 'application/vnd.ms-excel'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Please upload standard Excel formats (.xlsx or .xls)'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;