const express = require('express');
const authRoutes = express.Router();

authRoutes.post('/login', (req, res) => {
    const { username } = req.body;
    req.session.username = username;
    return res.status(201).send();
});

authRoutes.post('/logout', (req, res) => {
    req.session = null;
    return res.status(201).send();
})

module.exports = authRoutes;