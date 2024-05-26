const multer = require('multer');
const path = require('path');

//config for multer to upload csv 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //providing the file path
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // adding to date to keep the file name unique
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    // modifying allowed types to prevent uploading file types other than csv
    const allowedTypes = ['text/csv'];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Incorrect file type');
        error.status = 400;
        return cb(error, false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = upload;
