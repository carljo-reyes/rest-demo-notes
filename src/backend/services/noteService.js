const Note = require('../database/models/note');
const slugify = require('../slugify');

const validateNote = (note, session) => {
    let status, 
        data = {},
        errors = data.errors = [];

    if (note.from.id != null && note.from.id != session.authDetails.userId) {
        errors.push("Cannot impersonate another user")
        status = 404
    }

    if (note.title == null) {
        errors.push("Title cannot be blank");
        status = 400;
    }

    return [status, data];
}
module.exports = {
    getAll: async function(optionalUser) {
       const criteria = { 
            "$or": [ { "isPublic": true} ]
        };

       if (optionalUser) {
        criteria["$or"].push({ "to.id": optionalUser })
        criteria["$or"].push({ "from.id": optionalUser })
       }

       const foundNotes = await Note.find(criteria);
       return [200, foundNotes];
    },
    createNote: async function(req) {
        let status, data;
        const { hideName } = req.query;
        const newNote = new Note(req.body);
        [status, data] = validateNote(newNote, req.session)

        if (data.errors.length == 0) {
            newNote.slug = await slugify(req.body.title);

            newNote.from = {
                ...newNote.from,
                id: req.session.authDetails.userId
            };
            status = 201;
            data = await newNote.save();
        }



        return [status, data];
        
    }
}
