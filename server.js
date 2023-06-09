const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const bodyParser = require('body-parser')
const path = require("path");

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))
app.use(bodyParser.json())
app.use("/", express.static(path.join(__dirname, "public")));

require('./src/backend/database/mongoConn');

const apiRoutes = require("./src/backend/server/routes/apiRoutes");
const assetsRouter = require("./src/backend/server/assets-router");
const mongoose = require("mongoose");
app.use("/src", assetsRouter);

app.use('/api', apiRoutes);

app.get("/*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
})

const errorHandler = function(err, req, res, next) {
  console.error(err);

  let error = { 
    error: "Oops... something broke. It's not you, it's us", 
    message: err.message
  };
  let status = 500;
  if (err instanceof SyntaxError) {
    error.error = "JSON error"
    status = 400;
  } 
  if (err instanceof mongoose.Error || err.message.includes('ECONNREFUSED')) {
    status = 503;
  }
  res
    .status(status)
    .json(error);
}

app.use(errorHandler);

const { PORT = 5000 } = process.env;

app.listen(PORT, () => {
  console.log();
  console.log(`  App running in port ${PORT}`);
  console.log();
  console.log(`  > Local: \x1b[36mhttp://localhost:\x1b[1m${PORT}/\x1b[0m`);
});
