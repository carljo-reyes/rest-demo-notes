const User = require('../database/models/user');

module.exports = {
    getAllUsers: async function() {
        const data = await User.find({});
        return data;
    },

    createUser: async function (body) {
        const searchedUser = await User.findByUsername(body.username);
        let status, data;
        if (searchedUser != null) {
            data = searchedUser
            status = 200
        } else {
            const createQuery = await User.create(body)
            data = createQuery;
            status = 201;
        }
        return [data, status];
    }
}