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

//navigate to addform page to create task
app.get('/addform', (req, res) => {
  res.render('addform');
});

//update task
app.post("/updatetask/:id", async function(req, res) {
  try {
    await Model.updateTask(req.body, req.params.id);
    //redirect to the main page after updating the task
    res.redirect("/");
  } catch (err) {
    console.error("Error updating task:", err);
  }
});

//navigate to upateform page to update the seleted task
app.get("/updateform/:id", async function(req, res) {

  const allTasks = await Model.getAllTasks();
  const task = allTasks.todo.concat(allTasks.inProgress, allTasks.completed)
               .find(x => x.rowid == req.params.id);

  //determine which status to be selected in the 'status' dropdown of the update form
  const selectedNotStarted = task.status === "Not Started" ? "selected" : "";
  const selectedInProgress = task.status === "In Progress" ? "selected" : "";
  const selectedCompleted = task.status === "Completed" ? "selected" : "";

  res.render("updateform", {
    updateid: req.params.id,
    formdata: task,
    selectedNotStarted,
    selectedInProgress,
    selectedCompleted
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
