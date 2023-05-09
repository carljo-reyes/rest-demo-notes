const noteRoutes = require('express').Router();
const authMiddleware = require('./middleware/auth');
const loginGuard = authMiddleware.loginGuard;
const ownerGuard = authMiddleware.ownerGuard;
const hasAccessGuard = authMiddleware.hasAccessGuard;
const noteService = require('../../services/note');

// available to public
noteRoutes.get('/', async (req, res, next) => { // return all accessible notes
    try {
        const optionalUserId = req?.session?.authDetails?.userId ?? null;
        const foundNotes = await noteService.getAll(optionalUserId);
        return res
            .status(200)
            .json(foundNotes);
    } catch (err) {
        next(err)
    }
});

noteRoutes.get('/public', async (req, res, next) => { // return all public notes
    const publicNotes = noteService.getPublic();
    return res
        .status(200)
        .json(publicNotes);
})     

noteRoutes.get('/private', loginGuard, async (req, res) => {
    const data = await userService.getAllNotes(req.params.user);
    return res
        .status(200)
        .json(data);
}) 

noteRoutes.get('/:slugOrId', hasAccessGuard, async (req, res) => {
    return res
        .status(200)
        .send(res.locals.note)
}) // viewing a note

noteRoutes.post('/:slug', loginGuard)        // create a note with a slug
noteRoutes.post('/', loginGuard, async (req, res, next) => {
    try {
        const [status, data] = await noteService.createNote(req);
        res.status(status).json(data);
    } catch(err) {
        next(err);
    }

}) // create a note

noteRoutes.put('/:slugOrId', ownerGuard)  // overwrite a note
noteRoutes.delete('/:id', ownerGuard)     // delete a note

module.exports = noteRoutes;