const apiRoute = require("express").Router();
const userRoutes = require('./userRoutes.js');
const noteRoutes = require('./noteRoutes.js');
const authRoutes = require('./authRoutes.js');

apiRoute.use('/users', userRoutes);
apiRoute.use('/notes', noteRoutes);
apiRoute.use('/auth', authRoutes);

apiRoute.use('/users/:id/notes')

apiRoute.all('*', (_, res) => {
    return res.status(404).send("404 Endpoint not found");
})

module.exports = apiRoute;