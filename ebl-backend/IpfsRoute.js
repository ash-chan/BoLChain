const axios = require('axios');
var express = require('express');
var router = express.Router();

const ipfsClient = require('ipfs-http-client');
const { urlSource} = ipfsClient;
const ipfs = ipfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0/'
})
const mfs = require('ipfs-mfs')


const sha256 = require('js-sha256').sha256;

// Adds the json retrieved from docparser URL into IPFS
router.get('/add-json/:parserId/:documentId', async function(req, res) {
    let parserId = req.params.parserId;
    let documentId = req.params.documentId;
    let jsonResp = await axios.get(
        'http://localhost:4000/docparser/get-parsed-json/' + parserId + '/' + documentId)
        .then(async function(response) {
            console.log(response.data);
            let doc = await JSON.stringify(response.data);
            console.log(doc);
            for await (const file of ipfs.add(doc)) {
                console.log(file)
                // console.log(file.cid.multihash.toString('hex'));
                res.json(file)
            }
            }
        ).catch(function (error) {
            console.log(error);
        });
    // console.log(doc);
    // for await (const file of ipfs.add(doc)) {
    //     console.log(file)
    //     console.log(file.cid.multihash.toString('hex'));
    //     res.json(file)
    // }
    // for await (const file of ipfs.add('test')) {
    //     console.log(file)
    //     console.log(file.cid.multihash.toString('hex'));
    //     res.json(file)
    // }
});

router.get('/show-json/:cid', async function(req, res) {
    let cid = req.params.cid;
    for await (const file of ipfs.cat(cid)) {
        json_str = JSON.parse(file.toString());
        console.log(JSON.parse(file.toString()));
        res.json(json_str);
    }

});

router.get('/sha256/:cid', async function(req, res) {
    let fileJson = await ipfs.cat(req.params.cid)
    let json_str = JSON.stringify(fileJson.toString())
    console.log(fileJson);
    let tmp = sha256(json_str);
    res.json(tmp);
});

router.get('/mfs/add-json/:parserId/:documentId', async function(req, res) {
    let parserId = req.params.parserId;
    let documentId = req.params.documentId;
    let jsonResp = await axios.get(
        'http://localhost:4000/docparser/get-parsed-json/' + parserId + '/' + documentId)
        .then(async function(response) {
                console.log(response.data);
                let doc = await JSON.stringify(response.data);
                console.log(doc);
                for await (const file of mfs.add(doc)) {
                    console.log(file)
                    // console.log(file.cid.multihash.toString('hex'));
                    res.json(file)
                }
            }
        ).catch(function (error) {
            console.log(error);
        });
});

module.exports = router;
