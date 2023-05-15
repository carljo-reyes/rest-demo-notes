const Note = require('../database/models/note');
const User = require('../database/models/user');
const slugify = require('../slugify');
const generateCriteria_accessibleNotes = (targetUsername, authUserId) => {
    const TO_OR_FROM_TARGET = { $or: [{ "to.id": authUserId }, { "from.id": authUserId }] }
    
    if (targetUsername == authUserId) { // if target and auth user is same. 
        return TO_OR_FROM_TARGET; // i.e. auth user is pulling their notes
    } else { // else
        return { 
            $or: [
                { $and: [TO_OR_FROM_TARGET, { isPublic: true }] }, // publicly available notes
                { "from.id": authUserId, "to.id": targetUsername }, // sent by auth user
                { "to.id": authUserId, "from.id": targetUsername } // sent to auth user
            ]
        }
    }

};

module.exports = {
    postNote: async function(noteMtd, sendTo, senderData) {
        const noteObj = { ...noteMtd };
        noteObj.from = {
            ...noteObj.from,
            id: senderData.id,
            name: senderData.name,
        }

        let recipientDetails = await User.findByUsername(sendTo);

        if (recipientDetails == null)  {
            return [404, { error: "recipient not found" }]
        }
        noteObj.to = {
            ...noteObj.to,
            id: recipientDetails.id,
            name: recipientDetails.name,
        }

        const newNote = new Note(noteObj);
        newNote.slug = await slugify(noteMtd.title);
        
        const data = await newNote.save();
        return [201, data];
    },

    getUserNotes: async function(targetUsername, authUserId, queryFilters) {
        const userDetails = await User.findByUsername(targetUsername);
        const targetUserId = userDetails.id.toString();
        const isPublic = getQueryStringValue(queryFilters?.isPublic);
        const direction = queryFilters?.direction?.trim();

        const criteria = {
            $and: [
                { 
                    // mongoquery must be related to target username
                    $or: [
                        { "from.id": targetUserId },
                        { "to.id": targetUserId }
                    ]
                },
                {   
                   // placeholder for accessLevelCriteria 
                    $or: [
                    ]
                }
            ]
        }
        const baseCriteria = criteria["$and"];
        const accessLevelCriteria = criteria["$and"][1]["$or"];
        isPublic != null ? // if isPublic is specified in queryString
            accessLevelCriteria.push({ isPublic }) : // then, append value to mongoquery
            accessLevelCriteria.push({ isPublic: true }) // else, notes made available to public
        authUserId != null ? accessLevelCriteria.push(
            { "from.id": authUserId }, { "to.id": authUserId }) :
            0
        direction == 'received' ? baseCriteria.push({ "to.id": targetUserId }) :
            direction == 'sent' ? baseCriteria.push({ "from.id": targetUserId }) :
            0
        

       const foundNotes = await Note.find(criteria);
       const categorizedNotes = foundNotes.reduce((accumulator, val) => {
            val?.from?.id?.toString() == targetUserId ?
                accumulator.sent.push(val) :
                accumulator.received.push(val);

            return accumulator;
       }, { sent: [], received: [] })
       return [200, categorizedNotes];
    },

}

function getQueryStringValue(parameter) {
    switch (parameter?.toString()?.trim()) {
        case undefined:
        case '':
            return null;

        case '1':
        case 'true':
            return true;

        case '0':
        case 'false':
        default:
            return false;
    }
}
