const User = require('../../database/models/user');

module.exports = {
    getLoginDetais: function(req) {
        const { authDetails } = req.session
        if (authDetails ?? null != null) {
            return [200, authDetails]
        }

        return [404, {
            error: "Login session not found",
            notes: [
                `HTTP 404 is returned in because ^ login session is not found`,
                `HTTP 401 may also be returned for this scenario, in which it denotes that this is a 'protected' route`,
            ]
        }];
    },

    loginUser: async function(req) {
        const { username } =  req.body;
        const foundUser = await User.findByUsername(username);
        const authDetails = req.session.authDetails = req.session.authDetails ?? {}

        if (foundUser ?? null != null) {
            authDetails.username = username;
            authDetails.userId   = foundUser._id;
            authDetails.name   = foundUser.name;
            return [200, authDetails];
        }

        return [404, {error: "User not found"}];
    },

    logoutUser: function (req) {
        req.session = null;
        return [204, null]
    }
}