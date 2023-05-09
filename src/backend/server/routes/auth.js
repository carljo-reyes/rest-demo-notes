const express = require('express');
const authRoutes = express.Router();

authRoutes.all('/login', (req, res) => {
    let status, message;
    switch (req.method) {
        case "POST":
            const { username } = req.body;
            req.session.username = username;
        break;

        default:
            stautus = 405

    }

    return res.status(201).send();
});

authRoutes.all('/logout', (req, res) => {
    req.session = null;
    return res.status(201).send();
})

module.exports = authRoutes;