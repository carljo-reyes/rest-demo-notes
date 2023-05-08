const express = require("express");
const app = express();
const path = require("path");

const assetsRouter = require("./src/backend/server/assets-router");
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/src", assetsRouter);

app.get("/api/v1", (req, res) => {
  return res.json({
    project: "React and Express Boilerplate",
    from: "Vanaldito",
  });
});

app.get('/foo', (req, res) => {
  return res.send("etits");
});

app.get("/*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
})

const { PORT = 5000 } = process.env;

app.listen(PORT, () => {
  console.log();
  console.log(`  App running in port ${PORT}`);
  console.log();
  console.log(`  > Local: \x1b[36mhttp://localhost:\x1b[1m${PORT}/\x1b[0m`);
});
