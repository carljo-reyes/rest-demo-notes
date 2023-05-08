const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const user = {
    _id: ObjectId,
    name: String,
    bio: String,
    isAdmin: Boolean,
    createdAt: { type: Date, default: new Date() },
    updatedAt: Date
}

const userSchema = mongoose.Schema(user);
module.exports = mongoose.model('User', userSchema);