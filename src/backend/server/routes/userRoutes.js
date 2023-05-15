const express = require('express');
const userRoutes = express.Router();
const authMiddleware = require('./middleware/auth');
const { loginGuard, ownerGuard } = authMiddleware;
const userService = require('../../services/userService');
const noteService = require('../../services/noteService.js');
const fallback = require('./middleware/fallback');
const { withCatch } = require('./middleware/catchWrapper');

// POST | GET | /users 
userRoutes.all('/', withCatch(async (req, res, next) => {
    let data, status;
    switch (req.method) {
        case "GET":
            return res
                .status(200)
                .json(await userService.getAllUsers());

        case "POST":
            [data, status] = await userService.createUser(req.body);
            return res
                .status(status)
                .json(data);

        default:
            return fallback[405](req, res);
    }
}));

// GET | PUT | DELETE | /users/{id}
userRoutes.all('/:id', async(req, res, next) => {
    try {
        const { id: username } = req.params;
        let status, data;

        switch (req.method) {
            case "GET":
                [status, data] = await userService.getUser(username);
            break;
            
            case "PUT":
                [status, data] = await userService.upsertUser(req.body, username);
            break;

            case "DELETE":
                [status, data] = await userService.deleteUser(username);
            break;

            default:
                return fallback[405](req, res);
        }

        return res.status(status).json(data);
    } catch (err) {
        next(err);
    }
});

module.exports = userRoutes;