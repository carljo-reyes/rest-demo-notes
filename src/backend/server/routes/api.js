const apiRoute = require("express").Router();
const userRoutes = require('./users.js');
const noteRoutes = require('./notes.js');
const authRoutes = require('./auth.js');

apiRoute.use('/users', userRoutes);
apiRoute.use('/notes', noteRoutes);
apiRoute.use('/auth', authRoutes);

apiRoute.all('*', (_, res) => {
    return res.status(400).send("404");
})

module.exports = apiRoute;