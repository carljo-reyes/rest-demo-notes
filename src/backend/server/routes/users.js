const express = require('express');
const userRoutes = express.Router();
const authMiddleware = require('./middleware/auth');
const loginGuard = authMiddleware.loginGuard;
const authorizeGuard = [ loginGuard, authMiddleware.authorizeGuard ];
const userService = require('../../services/user');

// user
userRoutes.get('/', async (_, res) => { // get all users
    return res
        .status(200)
        .json(await userService.getAllUsers());
}); 

userRoutes.post('/',  async (req, res) => { // create a user
    const [data, status] = await userService.createUser(req.body)
    return res
        .status(status)
        .json(data)
});

userRoutes.get('/:id'); // get a user
userRoutes.delete('/:id', authorizeGuard); // delete a user

// authenticated routes (specific to logged-in user)
const protectedRoutes = express.Router();
protectedRoutes.use(authorizeGuard);
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