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
        
        newNote.from.id = req.session.authDetails.userId;
        if (hideSenderName) {
            newNote.from.name = undefined;
        } else {
            newNote.from.name = req.session.authDetails.username;
        }

        const saveStatus = await newNote.save();
        return [200, saveStatus];
        
    }
}