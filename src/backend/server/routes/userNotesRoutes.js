const express = require('express');
const router = express.Router();
const fallback = require('./middleware/fallback');

router
    .get((req, res) => {

    })

    .post((req, res) => {

    })
    
    .all(fallback[405])