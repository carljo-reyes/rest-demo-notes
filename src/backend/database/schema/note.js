const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const note = {
    _id: ObjectId,
    title: String,
    body: String,
    from: {
        id: { type: ObjectId, ref: 'User' },
        name: String
    },
    to: {
        id: { type: ObjectId, ref: 'User' },
        name: String
    },
    createdAt: { type: Date, default: new Date() },
    updatedAt: Date
}

const noteSchema = mongoose.Schema(note);
module.exports = mongoose.model('Note', noteSchema);