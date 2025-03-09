const express = require("express");
const app = express();

const Model = require("./app.model.js");

Model.makeConnection();

const mustacheExpress = require("mustache-express");

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.use(express.static('public')); 

app.post("/addtask", async function(req, res) {
  await Model.addTask(req.body);
  const taskArray = await Model.getAllTasks();
  res.render("homepage", { tasks: taskArray });
});

//show form to create task
app.get("/addform", async function(req, res) {
  const taskArray = await Model.getAllTasks();
  res.render("homepage", { addtask: true, tasks: taskArray });
});

//update task
app.post("/updatetask/:id", async function(req, res) {
  await Model.updateTask(req.body, req.params.id);
  const taskArray = await Model.getAllTasks();
  res.render("homepage", { tasks: taskArray });
});

//show form to update task
app.get("/updateform/:id", async function(req, res) {
  const taskArray = await Model.getAllTasks();
  res.render("homepage", {
    updatetask: true,
    updateid: req.params.id,
    formdata: taskArray.filter(x => x.rowid == req.params.id)[0],
    tasks: taskArray
  });
});

//delete task
app.get("/deletetask/:id", async function(req, res) {
  await Model.deleteTask(req.params.id);
  const taskArray = await Model.getAllTasks();
  res.render("homepage", { tasks: taskArray });
});


//delete all tasks
app.get("/deletealltasks", async function(req, res) {
  await Model.deleteAllTasks();
  const taskArray = await Model.getAllTasks();
  res.render("homepage", { tasks: taskArray });
});

//show all tasks
app.get("/", async function(req, res) {
  const taskArray = await Model.getAllTasks();
  res.render("homepage", { tasks: taskArray });
});

//start the server
app.listen(3000, function() {
  console.log("Server listening on port 3000...");
});
