
var express = require('express')
var router = express.Router()
const multer = require("multer");

const uploadsFolder = './uploads'

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Incorrect file");
        error.code = "INCORRECT_FILE_TYPE";
        return cb(error, false)
    }
    cb(null, true);
}
// Where the files are pushed to locally on disk ./uploads
const _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsFolder)
    },
    filename: function (req, file, cb) {
        // cb(null, file.originalname + '-' + Date.now())
        cb(null, file.originalname)
    }
})
const multerUpload = multer({
    storage: _storage,
    fileFilter,
    preservePath: true,
    limits: {
        fileSize: 2000000           // 2MB max filesize
    }
});


//Middleware for detecting wrong file type or too large file size
router.use((err, req, res, next) => {
    if (err.code === "INCORRECT_FILE_TYPE") {
        res.status(400).json({error: 'Only jpg/jpeg/png/pdf file formats are allowed.'});
        return;
    }
    if (err.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({error: 'Maximum allowed file size is 2Mb!!!!!.'});
        return;
    }
});
// API path linked is localhost/upload
router.post('/', multerUpload.array('doc', 10), (req, res) => {
    res.json({ files: req.file });
    console.log("req here")
    console.log(req.file.path)
    // let host =req.host;
    // const filePath = req.protocol + "://" + host + '/' + req.file.path;
});
// router.post('/', multerUpload.single('doc'), (req, res) => {
//     res.json({ file: req.file });
//     console.log("req here")
//     console.log(req.file.path)
//     // let host =req.host;
//     // const filePath = req.protocol + "://" + host + '/' + req.file.path;
// });




module.exports = router;

