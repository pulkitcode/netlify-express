
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ "HWLLO": "dsasd", "HWLLO": "dsasd", "HWLLO": "dsasd" })
})

router.get('/two', (req, res) => {
    res.json({
        "two": "2"
    })
})

router.get('/ejs', (req, res) => {
    res.render('index.ejs', { data: "hello world" })
})

module.exports = router