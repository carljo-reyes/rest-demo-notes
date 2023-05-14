const express = require('express');
const userRoutes = express.Router();
const authMiddleware = require('./middleware/auth');
const { loginGuard, ownerGuard } = authMiddleware;
const userService = require('../../services/userService');
const noteService = require('../../services/noteService.js');
const fallback = require('./middleware/fallback');

// POST | GET | /users 
userRoutes.all('/', async (req, res, next) => {
    try {
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
    } catch (err) {
        next(err);
    }
});

// GET | PUT | DELETE | /users/{id}
userRoutes.all('/:id', async(req, res, next) => {
    try {
        const { user: id } = req.params;
        let status, data;

        switch (req.method) {
            case "GET":
                [status, data] = await userService.getUser(id);
            break;
            
            case "PUT":
                [status, data] = await userService.upsertUser(req.body, id);
            break;

            case "DELETE":
                [status, data] = await userService.deleteUser(id);
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