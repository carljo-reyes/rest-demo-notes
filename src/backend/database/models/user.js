const mongoose = require('mongoose');

const user = {
    username: String,
    name: String,
    bio: String,
    isAdmin: Boolean,
    createdAt: { type: Date, default: new Date() },
    updatedAt: Date
}
const userSchema = mongoose.Schema(user);

userSchema.statics.findByUsername = function(username) {
    return this.findOne({username});
}

module.exports = mongoose.model('User', userSchema);