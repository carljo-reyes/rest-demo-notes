const express = require('express');
const router = express.Router({mergeParams: true});
const fallback = require('./middleware/fallback');

router
    .get((req, res) => {

    })

    .post((req, res) => {

    })
    
    .all(fallback[405])

// userRoutes.use('/:user/notes', express.Router({ mergeParams: true })
//     .get('/', userService.getNotes)
//     .get('/sent', userService.sentNotes)
//     .get('/received', userService.receivedNotes)
//     .all('/', fallback[405])
//     .all(/(\/sent|\/received)/, fallback[405])
// )