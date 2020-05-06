const express = require('express');
const app = express();
const cors = require("cors");



app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

const ListFilesRoute = require('./ListFilesRoute');
app.use('/list-files', ListFilesRoute);

const ParserRoute = require('./ParserRoute');
app.use('/docparser', ParserRoute);

const UploadRoute = require('./UploadRoute');
app.use('/upload', UploadRoute);

const SwarmRoute = require('./SwarmRoute');
app.use('/swarm', SwarmRoute);

const StorageRoute = require('./StorageRoute');
app.use('/storage', StorageRoute);

const IpfsRoute = require('./IpfsRoute');
app.use('/ipfs', IpfsRoute);

const UtilRoute = require('./UtilRoute');
app.use('/util', UtilRoute);

const PORT = '4000' || process.env.PORT;


//app.use('/uploads', express.static(require('path').join(__dirname + '/uploads')))

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
