//import apiLinks from '../vue-app/src/constants/apiLinks' ;
const axios = require('axios');

var express = require('express')
var router = express.Router()

// Using public swarm server
// https://swarm-gateways.net/bzz:/
// Not very reliable so can use own swarm server for better reliability

// Test function to check
router.get('/store-in-swarm/:parserId/:documentId', async function(req, res) {
    let jsonResp = await axios.get(
        'http://localhost:4000/docparser/get-parsed-json/' + req.params.parserId + '/' + req.params.documentId)
        .then(async function(response) {
                console.log(response.data);
                let doc = await JSON.stringify(response.data);
                console.log(doc);
            let storeResponse = await axios.post('https://swarm-gateways.net/bzz:/', doc
            ).then(function (response) {
                console.log(response);
            })
                .catch(function (error) {
                    console.log(error);
                });
            res.send(storeResponse);
            }
        ).catch(function (error) {
            console.log(error);
        });


});

// Hashing function as swarm alternative

router.get('/hash-json/:parserId/:documentId', async function(req, res) {
    String.prototype.hashCode = function() {
        var hash = 0;
        if (this.length == 0) {
            return hash;
        }
        for (var i = 0; i < this.length; i++) {
            var char = this.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
    let stringToHash = req.params.parserId + req.params.documentId
    let hashedString = require('crypto').createHash('md5').update(stringToHash).digest("hex")
    res.json(hashedString);
});
    // try{
    //     let docJson = axios.post('http://localhost:8500/bzz:/'+parserId+'/'+documentId, formData,
    //         {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //             auth: {
    //                 username: '6cc4179b834a15bcf73e02df9373c8480fbd9021',
    //                 password: ''
    //             }
    //         }
    //     )
    //     console.log(docJson);
    //     this.docToJsonMap.set(documentId, docJson)
    //     let current = {title: documentId, text: docJson}
    //     this.collapses.push(current)
    //     }
    // catch(err) {
    //     console.log(err);
    //     this.message = err.response.data.error
    // }


module.exports = router;

