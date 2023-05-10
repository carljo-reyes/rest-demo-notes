const express = require('express');
const userRoutes = express.Router();
const authMiddleware = require('./middleware/auth');
const { loginGuard, ownerGuard } = authMiddleware;
const userService = require('../../services/user');
const noteService = require('../../services/note.js');
const fallback = require('./middleware/fallback');

userRoutes.all('/', (req, res) => {
    try {
        switch (req.method) {
            // TODO: Create Implem
            case "GET":
            case "POST":

            // TODO: Create 405
            default:
        }
    } catch (err) {
        next(err);
    }
});

userRoutes.all('/:id', (req, res) => {
    try {
        switch (req.method) {
            // TODO: Create Implem
            case "POST":
            case "GET":
            case "PUT":
            case "DELETE":

            // TODO: Create 405
            default:
        }
    } catch (err) {
        next(err);
    }
});

userRoutes.route('/:id/notes')
    .get('/')
    .get('/sent')
    .get('/received')
    .all('/', fallback[405])
    .all(/(\/sent|\/received)/, fallback[405]);


// user
userRoutes.get('/', async (_, res) => { // get all users
    return res
        .status(200)
        .json(await userService.getAllUsers());
}); 

userRoutes.post('/',  async (req, res) => { // create a user
    const [status, data] = await userService.createUser(req.body)
    return res
        .status(status)
        .json(data)
});

userRoutes.get('/:id', async(req, res) => { // get a user
    const [status, data] = await userService.findUser(req.body)
    return res
        .status(status)
        .json(data)
}); 

userRoutes.delete('/:user', ownerGuard, async(req, res) => { // delete a user
    const [status, data] = await userService.deleteUser(req.params.user)
    return res
        .status(status)
        .json(data)
});

userRoutes.use('/:user/notes', ownerGuard, express.Router()
    .get('/', async (req, res) => {
        const data = await userService.getAllNotes(req.params.user)
        return res
            .status(200)
            .json(data)
    })
    .get('/sent', async (req, res) => {
        const data = await userService.getSentNotes(req.params.user)
        return res
            .status(200)
            .json(data)
    })
    .get('/received', async (req, res) => {
        const data = await userService.getReceivedNotes(req.params.user)
        return res
            .status(200)
            .json(data)
    })
);
// authenticated routes (specific to logged-in user)
const protectedRoutes = express.Router();
protectedRoutes.use(ownerGuard);
protectedRoutes.get('/:user/notes'); // notes to/for the user
protectedRoutes.get('/:user/notes/sent'); // notes sent by the user
protectedRoutes.get('/:user/notes/received'); // notes received by the user
userRoutes.use(protectedRoutes);
// userRoutes.use('/', protectedRoutes);

// fallback route
userRoutes.all('*', (req, res) => {
    return res.send(`${req.params[0]} not found`);
})

module.exports = userRoutes;