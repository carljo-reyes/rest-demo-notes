const loginGuard = (req, res, next) => {
    if (req?.session?.username ?? null != null) {
        return next();
    }

    return res.send(401).send({
        error: "User not logged in"
    });
}

const authorizeGuard = async (req, res, next) => {
    const resource = req; //TODO: get resource

    let resourceId;
    switch(resource) {
        case "user":
            resourceId = req.params.user;
            if (resourceId == req.session.username) {
                return next();
            }
        break;

        case "note":
            resourceId = req.params.note;
            const note = await Notes.findOne({_id: resourceId})
            const noteAuthor = note?.from?.id;
            if (noteAuthor == undefined || noteAuthor == req.session.username) {
                return next();
            }
        break;

        default:
            next();
    }
    
    if (req.session.isAdmin == true) {
        return next();
    }

    return res.status(400).json({
        message: "Unauthorized access to resource: "
    })
}

module.exports = {
    loginGuard,
    authorizeGuard
}