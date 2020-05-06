//import apiLinks from '../vue-app/src/constants/apiLinks' ;
const axios = require('axios');
var express = require('express')
var router = express.Router()

const FormData = require('form-data');
const docparser = require('docparser-node');

const secretAPIKey = 'c0199ff0cdc9a0e3a722976cea5b64847558f361';
const client = new docparser.Client("419b9e2e239f4fc7c538f89afd994d57eb87dce7");

// Test function to check if docparser client is responding


// Not sure why the HTTP version does not work but client does?
// router.get('/ping', function(req, res) {
//     try {
//         let fileResponse = axios.get('https://api.docparser.com/v1/ping',{
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             },
//             auth: {
//                 username: 'f7dd67b70f9b8abc7be1fa87c326aea060ab6008',
//                 password: ''
//             },
//         }).then(function() {
//             console.log(fileResponse);
//         })
//
//     }
//     catch(err){
//         console.log(err);
//         this.message = err.response.data.error
//
//     }
// });
router.get('/ping', function(req, res) {
     client.ping()
         .then(function() {
              console.log('authentication succeeded!')
              res.json("Pong")
         })
         .catch(function(err) {
              console.log('authentication failed!')
              res.json("Failed")
         })
});
router.get('/list-parsers', function(req, res) {
     client.getParsers()
         .then(function (parsers) {
              console.log("list of parsers retrieved")
              res.json(parsers)

         })
         .catch(function (err) {
              console.log(err)
         })
});
// './uploads/filename'
// /:parserId/:filePath
router.get('/upload-and-parse/:parserId/:filePath', function(req, res) {
    let parserId = req.params.parserId;
    let filePath = decodeURIComponent(req.params.filePath);
    console.log(parserId, filePath)
    client.uploadFileByStream(parserId, require('fs').createReadStream(filePath))
        .then(function (result) {
            console.log("Parsed!");
            res.json(result);
            // => {"id":"document_id","file_size":198989,"quota_used":16,"quota_left":34,"quota_refill":"1970-01-01T00:00:00+00:00"}
        })
        .catch(function (err) {
            console.log(err)
        })
});

// router.post('/upload-and-parse/', function(req, res) {
//     newFile.on('end', function() {
//         const form_data = new FormData();
//         form_data.append("file", newFile);
//         const request_config = {
//             method: "post",
//             url: 'https://api.docparser.com/v1/document/upload/pyrhiwzgakvl',
//             auth: {
//                 username: '6cc4179b834a15bcf73e02df9373c8480fbd9021',
//                 password: ''
//             },
//             headers: {
//                 "Content-Type": "multipart/form-data"
//             },
//             data: form_data
//         };
//         console.log(form_data);
//         axios.post('https://api.docparser.com/v1/document/upload/pyrhiwzgakvl', form_data, {
//             withCredentials: true,
//             headers: form_data.getHeaders(),
//             auth: {
//                 username: '6cc4179b834a15bcf73e02df9373c8480fbd9021'
//             },
//         });
//     });
// });
// router.get('/json-info/:parserId/:documentId', function(req, res) {
//     let parserId = req.params.parserId;
//     let documentId = req.params.documentId;
//     console.log(parserId, documentId);
//     try {
//         let fileResponse = axios.post('https://api.docparser.com/v1/results/'+parserId+'/'+documentId,{
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             },
//             auth: {
//                 username: '6cc4179b834a15bcf73e02df9373c8480fbd9021',
//                 password: ''
//             },
//         })
//
//     }
//     catch(err){
//         console.log(err);
//         this.message = err.response.data.error
//
//     }
// });

router.get('/get-parsed-json/:parserId/:documentId', function(req, res) {
    let parserId = req.params.parserId;
    let documentId = req.params.documentId;
    // console.log(parserId, documentId);
    client.getResultsByDocument(parserId, documentId, {format: 'object'})
        .then(function (result) {
            // console.log(result)
            res.json(result)
            return result
        })
        .catch(function (err) {
            console.log(err)
        })
});


module.exports = router;

