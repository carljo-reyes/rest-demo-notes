const apiRoute = require("express").Router();
const userRoutes = require('./userRoutes.js');
const noteRoutes = require('./noteRoutes.js');
const authRoutes = require('./authRoutes.js');
const userNotesRoutes = require('./userNotesRoutes.js');

apiRoute.use('/users', userRoutes);
apiRoute.use('/notes', noteRoutes);
apiRoute.use('/', userNotesRoutes); // 'users/{id}/notes

apiRoute.use('/auth', authRoutes);

apiRoute.all('*', (_, res) => {
    return res.status(404).send("404 Endpoint not found");
})

module.exports = apiRoute;