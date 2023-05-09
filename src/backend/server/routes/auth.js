const express = require('express');
const authRoutes = express.Router();
const userService = require('../../services/user');
const authService = require('../../services/authentication/auth');

const HTTP405_MESSAGE = { "message": "Method not found. Did you mean to use POST?" }

authRoutes.all('/login', async (req, res) => {
    let status, data;
    switch (req.method) {
        case "POST":
            [status, data] = await authService.loginUser(req);
        break;

        case "GET":
            [status, data] = authService.getLoginDetais(req);
        break;

        default:
            status = 405
            data = HTTP405_MESSAGE;
    }

    return res.status(status).send(data);
});

authRoutes.all('/logout', (req, res) => {
    switch(req.method) {
        case "POST":
            const [status, data] = authService.logoutUser(req)
            return res.status(status).json(data);
        default:
            return res.status(405).json(HTTP405_MESSAGE);
    }
})

module.exports = authRoutes;