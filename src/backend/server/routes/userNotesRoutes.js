const express = require('express');
const fallback = require('./middleware/fallback');
const noteService = require('../../services/noteService');
const userNotesService = require('../../services/userNotesService');
const { loginGuard } = require('./middleware/auth');

const userNotesRoutes = express.Router();

userNotesRoutes.route('/users/:id/notes')
    .get(async (req, res) => {
        const { id: targetUsername } = req.params;
        const authUserId = req?.session?.authDetails?.userId ?? null;
        const [status, data] = await userNotesService.getUserNotes(targetUsername, authUserId, req.query);
        return res.status(status).json(data);
    })

    .post(loginGuard, async (req, res) => {
        const to = req.params.id;
        const { hideName = false } = req.query;
        const { 
            userId: fromId,
            username: fromName
        } = req.session.authDetails;

        const senderDetails = {
            id: fromId,
            name: hideName ? "" : fromName
        }
        const [status, data] = await userNotesService.postNote(req.body, to, senderDetails);
        return res.status(status).json(data);

    })
    
    .all(fallback[405])

module.exports = userNotesRoutes;