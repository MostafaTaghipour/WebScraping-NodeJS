const express = require("express");
const samples = require("./samples");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello Web Scraping!");
});

app.use("/samples", samples);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
