const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const note = {
    slug: String,
    title: String,
    body: String,
    isPublic: Boolean,
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

noteSchema.statics.findBySlugOrId = function (slugOrId) {
    return this.find({
        "$or": [
            { _id: slugOrId },
            { slug: slugOrId },
        ]
    });
}

module.exports = mongoose.model('Note', noteSchema);