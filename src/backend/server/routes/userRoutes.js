const express = require('express');
const userRoutes = express.Router();
const authMiddleware = require('./middleware/auth');
const { loginGuard, ownerGuard } = authMiddleware;
const userService = require('../../services/userService');
const noteService = require('../../services/noteService.js');
const fallback = require('./middleware/fallback');

userRoutes.all('/', async (req, res, next) => {
    try {
        let data, status;
        switch (req.method) {
            // TODO: Create Implem
            case "GET":
                return res
                    .status(200)
                    .json(await userService.getAllUsers());

            case "POST":
                [data, status] = await userService.createUser(req.body);
                return res
                    .status(status)
                    .json(data);

            // TODO: Create 405
            default:
        }
    } catch (err) {
        next(err);
    }
});

userRoutes.all('/:user', async(req, res, next) => {
    try {
        const { user: username } = req.params;
        let status, data;

        switch (req.method) {
            // TODO: Create Implem
            case "POST":
                [data, status] = await userService.createUser(req.body, username);
            break;

            case "GET":
                [status, data] = await userService.getUser(username);
            break;
            
            case "PUT":
                [status, data] = await userService.upsertUser(req.body, username);
            break;

            case "DELETE":
                [status, data] = await userService.deleteUser(username);
            break;

            // TODO: Create 405
            default:
        }

        return res.status(status).json(data);
    } catch (err) {
        next(err);
    }
});

userRoutes.use('/:user/notes', express.Router({ mergeParams: true })
    .get('/', userService.getNotes)
    .get('/sent', userService.sentNotes)
    .get('/received', userService.receivedNotes)
    .all('/', fallback[405])
    .all(/(\/sent|\/received)/, fallback[405])
)

module.exports = userRoutes;