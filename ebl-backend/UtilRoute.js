var express = require('express')
var router = express.Router()
const sha256 = require('js-sha256').sha256;

const ipfsClient = require('ipfs-http-client');
const { urlSource} = ipfsClient;
const ipfs = ipfsClient('http://localhost:5001');

router.post('/hash/sha256', async function(req, res) {

})

module.exports = router
