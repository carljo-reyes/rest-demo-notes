const mongoose = require('mongoose');

require('dotenv');
const MONGO_URI = process.env?.MONGO_URI ??
    "mongodb://127.0.0.1:27017/rest-demo"

console.log("Connecting to MongoDB");

mongoose.connect(MONGO_URI)
    .then(() => { console.log("Connected to MongoDB") })
    .catch(err => console.error(err))
