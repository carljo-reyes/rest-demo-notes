const express = require('express');
const noteRoutes = express.Router();
const authMiddleware = require('./middleware/auth');
const loginGuard = authMiddleware.loginGuard;
const ownerGuard = authMiddleware.ownerGuard;
const hasAccessGuard = authMiddleware.hasAccessGuard;
const noteService = require('../../services/noteService');

noteRoutes.all('/', async (req, res, next) => { 
    try {
        let status, data;
        switch (req.method) {
            // TODO: Finish implem
            case "POST":
                [status, data] = await noteService.createNote(req)
            break;


            case "GET":
                const optionalUserId = req?.session?.authDetails?.userId ?? null;
                [status, data] = await noteService.getAll(optionalUserId);
                break;

            // TODO: Create 405
            default:
        }

        return res.status(status).json(data);
    } catch (err) {
        next(err);
    }
});

noteRoutes.all('/from/:from/to/:to', (req, res, next) => {
    try {
        switch (req.method) {
            // TODO: Create Implem
            case "GET":

            // TODO: Create 405
            default:
        }
    } catch (err) {
        next(err);
    }
})

noteRoutes.all('/:direction/:user', (req, res, next) => {
    const { direction, user } = req.params;
    try {
        switch (req.method) {
            // TODO: Create Implem
            case "GET":

            // TODO: Create 405
            default:
        }
    } catch (err) {
        next(err);
    }
});

noteRoutes.route('/:slug')
    .post((req, res) => {
        const [status, data] = noteService.createNote(req);
    })
    .get()
    .put()
    .head()
    .delete()


foo = (req, res, next) => {
    const slug = req.params.slug;
    const reqBody = req.body;

    try {
        switch (req.method) {
            // TODO: Create Implem
            case "POST":
            // TODO: Add 301 case
            case "GET":
            case "PUT":
            case "DELETE":
            case "HEAD":

            // TODO: Create 405
            default:
        }
    } catch (err) {
        next(err);
    }
}

module.exports = noteRoutes;