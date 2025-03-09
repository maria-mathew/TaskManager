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

//add task
app.post("/addtask", async function(req, res) {
  await Model.addTask(req.body);
  const categorizedTasks = await Model.getAllTasks();
  res.render("homepage", { tasks: categorizedTasks });
});

//show form to create task
app.get("/addform", async function(req, res) {
  const categorizedTasks = await Model.getAllTasks();
  res.render("homepage", { addtask: true, tasks: categorizedTasks });
});

//update task
app.post("/updatetask/:id", async function(req, res) {
  await Model.updateTask(req.body, req.params.id);
  const categorizedTasks = await Model.getAllTasks();
  res.render("homepage", { tasks: categorizedTasks });
});

//show form to update task
app.get("/updateform/:id", async function(req, res) {
  const categorizedTasks = await Model.getAllTasks();
  res.render("homepage", {
    updatetask: true,
    updateid: req.params.id,
    formdata: categorizedTasks.todo.concat(categorizedTasks.inProgress, categorizedTasks.completed)
      .find(x => x.rowid == req.params.id),
    tasks: categorizedTasks
  });
});

//delete task
app.get("/deletetask/:id", async function(req, res) {
  await Model.deleteTask(req.params.id);
  const categorizedTasks = await Model.getAllTasks();
  res.render("homepage", { tasks: categorizedTasks });
});

//delete all tasks
app.get("/deletealltasks", async function(req, res) {
  await Model.deleteAllTasks();
  const categorizedTasks = await Model.getAllTasks();
  res.render("homepage", { tasks: categorizedTasks });
});

//show all tasks
app.get("/", async function(req, res) {
  const categorizedTasks = await Model.getAllTasks();
  res.render("homepage", { tasks: categorizedTasks });
});

//start the server
app.listen(3000, function() {
  console.log("Server listening on port 3000...");
});
