const mongoose = require('mongoose');

console.log("Connecting to MongoDB");

mongoose.connect("mongodb://127.0.0.1:27017/rest-demo")
    .then(() => { console.log("Connected to MongoDB") })
    .catch(err => console.error(err))
