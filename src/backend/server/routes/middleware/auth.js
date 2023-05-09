const loginGuard = (req, res, next) => {
    if (req?.session?.authDetails?.username ?? null != null) {
        return next();
    }

    return res.status(401).send({
        error: "User not logged in"
    });
}

const ownerGuard = [ loginGuard, async (req, res, next) => {
    const resource = req; //TODO: get resource

    let resourceId;
    switch(resource) {
        case "user":
            resourceId = req.params.user;
            if (resourceId == req.session.authDetails.username) {
                return next();
            }
        break;

        case "note":
            resourceId = req.params.note;
            const note = await Notes.findOne({_id: resourceId})
            const noteAuthor = note?.from?.id;
            if (noteAuthor == undefined || noteAuthor == req.session.authDetails.username) {
                return next();
            }
        break;

        default:
            next();
    }
    
    if (req.session.authDetails.isAdmin == true) {
        return next();
    }

    return res.status(403).json({
        message: "Unauthorized access to resource: "
    })
}]

const hasAccessGuard = [ loginGuard, async(req, res, next) => {
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
            resourceId = req.params.slugOrId;
            const note = await Notes.findBySlugOrId(resourceId);
            if (note ?? null == null) {
                res.send(404).json({ message: "Resource not found"})
            }

            const noteAuthor = note?.from?.id;
            const noteReceiver = note?.to?.id;
            const isSenderOrReceiver = [noteAuthor, noteReceiver]
                .some(v => v == req.session.username);

            if (isSenderOrReceiver) {
                res.locals.note = note;
                return next();
            }
        break;

        default:
            next();
    }
    
    if (req.session.isAdmin == true) {
        return next();
    }

    return res.status(403).json({
        message: "Unauthorized access to resource: "
    })
}]

module.exports = {
    loginGuard,
    ownerGuard,
    hasAccessGuard
}