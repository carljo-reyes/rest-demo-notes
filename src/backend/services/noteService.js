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
            "$or": [ { "isPublic": true} ] // default search criteria
        };

       if (optionalUser) {
        criteria["$or"].push({ "to.id": optionalUser })
        criteria["$or"].push({ "from.id": optionalUser })
       }

       const foundNotes = await Note.find(criteria);
       return [200, foundNotes];
    },
    
    makePublic: async function(slug) {
        const updatedField = { isPublic: true };
        const options = { new: true };
        const data = await Note.findOneAndUpdate({ slug }, updatedField, options);
        return [200, data];
    },

    getNote: async function(slug) {
        let status;
        let data = await Note.findOne({slug});
        if (data != null) {
            status = 200
        } else {
            status = 404
            data = undefined;
        }
        return [status, data];
    },

    overwriteNote: async function(slug, noteMtd) {
        const noteObj = { ...noteMtd };
        const options = { new: true };
        delete noteObj.slug;
        delete noteObj.from.id;
        delete noteObj.to.id;

        let status = 200,
            data;
        data = await Note.findOneAndUpdate({slug}, noteObj, options);

        if (data == null) {
            data = { error: "Note not found"};
            status = 404;
        } else {
            status = 200
        }


        return [status, data];
    },

    deleteNote: async function(slug, authUserId) {
        let status = 204,
            data;
        let deletedNote = await Note.findOneAndDelete({
            slug, 
            "from.id": authUserId
        })

        if (deletedNote == null) {
            status = 404;
            data = {
                error: "Note not found",
                message: [
                    "Make sure that passed resource id (i.e. slug) is correct",
                    "Also ensure that you sent this note"
                ]
            }
        }

        return [status, data];
        
    },

    /* @deprecated */
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
