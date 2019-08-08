var fs = require("fs");
const express = require("express");
var app = express();

app.use(express.static(__dirname));
app.get("/", (req, res) => {
  var data = fs.readFileSync("index.html").toString();

  res.send(data);
});
const port = process.env.port || 8080;
app.listen(port);