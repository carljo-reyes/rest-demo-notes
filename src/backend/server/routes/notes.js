const noteRoutes = require('express').Router();
const authMiddleware = require('./middleware/auth');
const loginGuard = authMiddleware.loginGuard;
const authorizeGuard = [ loginGuard, authMiddleware.authorizeGuard ];

// available to public
noteRoutes.get('/')       // return all notes
noteRoutes.get('/:id')    // get a note

// logged-in users only
noteRoutes.post('/', loginGuard)      // post a note
noteRoutes.post('/:id', loginGuard)   // create a note
noteRoutes.put('/:id', authorizeGuard)    // overwrite a note
noteRoutes.delete('/:id', authorizeGuard) // delete a note

module.exports = noteRoutes;