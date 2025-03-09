const express = require('express');
const app = express();

app.use(express.json());

app.post("/api", function(req,res) {

  console.log("Request coming in...");

  console.log(req.body);

  res.json(req.body);
});

app.listen(3000);