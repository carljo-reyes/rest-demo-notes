const User = require('../database/models/user');

module.exports = {
    getAllUsers: async function() {
        const data = await User.find({});
        return data;
    },

    createUser: async function (body) {
        const searchedUser = await User.findByUsername(body.username);
        let data, status;
        if (searchedUser != null) {
            data = searchedUser
            status = 200
        } else {
            const createQuery = await User.create(body)
            data = createQuery;
            status = 201;
        }
        return [data, status];
    },

    findOneUser: async function (username) {
        const searchedUser = await User.findByUsername({username});
        let data, status;
        if (searchedUser != null) {
            status = 200;
            data = searchedUser;
        } else {
            status = 400
            data = {
                message: "User not found"
            }
        }
        return [status, data];
    },

    deleteUser: async function (username) {
        const deletedUser = await User.deleteOne({username});
        let data, status;
        if (deletedUser != null) {
            status = 204;
            data = deletedUser;
        } else {
            status = 400
            data = {
                message: "User not found"
            }
        }
        return [status, data];
    }
}