const express = require('express');
const noteRoutes = express.Router();
const authMiddleware = require('./middleware/auth');
const loginGuard = authMiddleware.loginGuard;
const ownerGuard = authMiddleware.ownerGuard;
const hasAccessGuard = authMiddleware.hasAccessGuard;
const noteService = require('../../services/noteService');
const fallback = require('./middleware/fallback');

// GET | /notes
noteRoutes.all('/', async (req, res, next) => { 
    try {
        let status, data;
        switch (req.method) {

            case "GET":
                const optionalUserId = req?.session?.authDetails?.userId ?? null;
                [status, data] = await noteService.getAll(optionalUserId);
                break;

            // TODO: Create 405
            default:
                return fallback[405](req, res);
                
        }

        return res.status(status).json(data);
    } catch (err) {
        next(err);
    }
});

// GET | PUT | DELETE | HEAD | /notes/{id}
noteRoutes.route('/:slug')
    .get(async (req, res, next) => {
        const { slug } = req.params;
        const [status, data] = await noteService.getNote(slug);
        return res.status(status).json(data);
    })
    .put(async (req, res) => {
        const { slug } = req.params;
        const [status, data] = await noteService.overwriteNote(slug, req.body);
        return res.status(status).send(data);
    })
    .delete(loginGuard, async (req, res) => {
        const { slug } = req.params;
        const [status, data] = await noteService.deleteNote(slug, req.session.authDetails.userId)
        return res.status(status).send(data);
    })
    .head()
    .all()

noteRoutes.route('/:slug/makePublic')
    .put(async (req, res) => {
        const { slug } = req.params;
        const [status, data] = await noteService.makePublic(slug);
        return res.status(status).send(data);
    })
    .all()

module.exports = noteRoutes;