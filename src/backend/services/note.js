const Note = require('../database/models/note');

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
       return foundNotes;
    },
    createNote: async function(req) {
        const { hideSenderName = false, ...noteMtd } = req.body
        const newNote = new Note(noteMtd);
        
        if (hideSenderName) {
            newNote.from.name = undefined;
        } else {
            newNote.from.name = req.session.username
        }

        const saveStatus = newNote.save();
        return [200, req];
        
    }
}