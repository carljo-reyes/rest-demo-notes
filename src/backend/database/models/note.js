const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const note = {
    slug: { type: String, required: true },
    title: { type: String, required: true },
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

noteSchema.statics.findBySlug = function (slug) {
    const regex = new RegExp(`^${slug}`);
    return this.find({
        slug: regex
        
    });
}

module.exports = mongoose.model('Note', noteSchema);