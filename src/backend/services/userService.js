const User = require('../database/models/user');
const Note = require('../database/models/note');

module.exports = {
    getAllUsers: async function() {
        const data = await User.find({});
        return data;
    },

    createUser: async function (body, username = null) {
        body.username = username ?? body.username;
        const searchedUser = await User.findByUsername(body.username);
        let data, status;
        if (searchedUser != null) {
            data = { "message": "Resource already exists" }
            status = 409
        } else {
            const createQuery = await User.create(body)
            data = createQuery;
            status = 201;
        }
        return [data, status];
    },

    getUser: async function (username) {
        const searchedUser = await User.findByUsername(username);
        let data, status;
        if (searchedUser != null) {
            status = 200;
            data = searchedUser;
        } else {
            status = 404
            data = { error: "User not found" }
        }
        return [status, data];
    },

    upsertUser: async function(reqBody, username) {
        reqBody.username = username;
        const replacedUser = await User.findOneAndReplace({username}, reqBody, 
            {upsert: true, new: true});
        return [200, replacedUser];
        
    },


    deleteUser: async function (username) {
        const deleteStatus = await User.deleteOne({username});
        let data, status;
        if (deleteStatus.deletedCount > 0) {
            status = 204;
            data = null
        } else {
            status = 404
            data = {
                message: "No user found"
            }
        }
        return [status, data];
    },

    getNotes: async function (req, res, next) {
        try {
            const { user } = req.params
            const userQuery = await User.findByUsername(user);
            const userId = userQuery._id;
            const userNotes = await Note.find({
                $or: [
                    { "from.id": userId },
                    { "to.id": userId }
                ]
            })
            return res.status(200).json(userNotes);
        } catch (err) {
            next(err);
        }
    },

    sentNotes: async function (username) {
        const userNotes = await Note.find({
            "from.id": username
        })
        return userNotes;
    },

    receivedNotes: async function (username) {
        const userNotes = await Note.find({
            "to.id": username
        })
        return userNotes;
    },

}