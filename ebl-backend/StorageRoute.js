//import apiLinks from '../vue-app/src/constants/apiLinks' ;
const axios = require('axios');
var express = require('express');
var router = express.Router();
const LocalStorage = require('node-localstorage').LocalStorage;

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

let localStorage;
if (typeof localStorage === "undefined" || localStorage === null) {
    localStorage = new LocalStorage('./scratch');
}

// Init database table for this user
router.get('/create-table', async function(req, res) {
    db.run(`CREATE TABLE IF NOT EXISTS DOCS(user, docName, docID, parserLabel, parserID, storageMethod, hash)`);
    res.json('table created')
    console.log('table created')
    // db.close();
    return;
});

// Check whole database
router.get('/show-database', function(req, res) {
    let sql = `SELECT * FROM DOCS`;
    db.all(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row);

        });
    });
    return
});

// Get docs parsed for a particular user
router.get('/show-docs/:user', async function(req, res) {
    //let docs = [];
    let curUser = req.params.user;
    let sql = `SELECT * FROM DOCS WHERE user = ?`;
    db.all(sql, [curUser], (err, rows) => {
        if (err) {
            console.log(err);
        }

        //console.log(`${row.docName} - ${row.parserLabel}`);
        console.log(rows);
        res.json({data: rows});
    });

});

router.get('/update-with-hash/:parserId/:documentId/:storageMethod/:cidString', function(req, res) {
    let data = [req.params.storageMethod, req.params.cidString, req.params.documentId];
    let sql = `UPDATE DOCS
            SET storageMethod = ?, hash = ?
            WHERE docId = ?`;

    db.run(sql, data, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);
        res.json('updated');
    });
});

// Update documents stored for a particular user
router.get('/add-entry/:user/:docName/:docID/:parserLabel/:parserID/:docJSON', async function(req, res) {
    let curUser = req.params.user;
    let parserLabel = decodeURIComponent(req.params.parserLabel);
    let parserID = req.params.parserID;
    let docName = decodeURIComponent(req.params.docName);
    let docID = req.params.docID;
    console.log("trying to add to database");
    console.log(curUser, parserLabel, parserID, docName, docID);

    // // first get user : userDocList
    // let userDocList = localStorage.getItem(curUser);
    // let newDocNum = userDocList.length + 1
    // // determine new doc id (username + doc num)
    // let newDocId = curUser + newDocNum.toString()
    // // store into localstorage with key = newDocId

    // insert one row into the docs table
    db.run(`INSERT INTO DOCS(user, docName, docID, parserLabel, parserID, storageMethod, hash) 
    VALUES(?, ?, ?, ?, ?, ?, ?)`, [curUser, docName, docID, parserLabel, parserID, '-', '-'], function(err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.json('uploaded');
    });

    // close the database connection
    //db.close();

});



module.exports = router;
