const slugify = require('slugify');
const Note = require('./database/models/note');
const config = {
    lower: true,
    strict: true
}

const lastElem = (arr) => {
    return arr[arr.length - 1];
}

const slugifyWithOptions = async (string) => {
    const slugged = slugify(string, config)
    const similarSlugs = await Note.findBySlug(slugged);

    if (similarSlugs?.length > 0) {
        const lastSlug = lastElem(similarSlugs).slug;
        const copies = +lastElem(lastSlug.split('-'));
        if (isNaN(copies)) {
            return slugged + "-1";
        } else {
            return `${slugged}-${copies +1}`
        }
    } else {
        return slugged;
    }
}

module.exports = slugifyWithOptions;