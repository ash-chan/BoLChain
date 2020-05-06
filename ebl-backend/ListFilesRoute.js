var express = require('express')
var router = express.Router()
const fs = require('fs');

const uploadsFolder = './uploads'

router.get('/', function(req, res) {
    fs.readdir(uploadsFolder, (err, files) => {
        files.forEach(file => {
            console.log(file);
        });
        // Filter out hidden file DS_Store
        files = files.filter(str => !str.startsWith('.'));
        files = files.map((str, index) => ({id: index + 1, fileName: str }));
        res.send(files);
        // Returns array of files e.g. [file1, file2, file3]
    });
});

// router.get('/hello-world', function(req, res) {
//     res.json('hello world');
//     });
module.exports = router;
