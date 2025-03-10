const express = require("express");
const { Parser } = require('json2csv');

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
  const errors = {};

  // validate form
  //1. title
  const title = req.body.title.trim();
  if(title == ""){
    errors.title = "Title is a required field.";
  }
  else if (title.length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }
  //2. title
  const description = req.body.description;
  if (description.length > 500) {
    errors.description = "Description cannot exceed 500 characters.";
  }
  //3. due date
  const dueDate = new Date(req.body.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if(dueDate == ""){
    errors.dueDate = "Due date is a required field.";
  }
  else if (isNaN(dueDate) || dueDate <= today) {
    errors.dueDate = "Due date must be a future date.";
  }

  //if there are errors return them to the front-end along with the form data enetered by user
  if (Object.keys(errors).length > 0) {
    return res.render("addform", { 
      errors, 
      formdata: req.body,
      selectedEducation: req.body.category === "Education" ? "selected" : "",
      selectedHealth: req.body.category === "Health" ? "selected" : "",
      selectedSocial: req.body.category === "Social" ? "selected" : "",
      selectedWork: req.body.category === "Work" ? "selected" : "",
      selectedPersonal: req.body.category === "Personal" ? "selected" : "",
      selectedTravel: req.body.category === "Travel" ? "selected" : "",
      selectedShopping: req.body.category === "Shopping" ? "selected" : "",
      selectedFamily: req.body.category === "Family" ? "selected" : "",
      selectedHigh: req.body.priority === "High" ? "selected" : "",
      selectedMedium: req.body.priority === "Medium" ? "selected" : "",
      selectedLow: req.body.priority === "Low" ? "selected" : ""
    });
  }
  
  //add the task if validation pass
  await Model.addTask(req.body);
  res.redirect("/");
});

//navigate to addform page to create task
app.get('/addform', (req, res) => {
  res.render('addform', {
    selectedEducation: "",
    selectedHealth: "",
    selectedSocial: "",
    selectedWork: "",
    selectedPersonal: "",
    selectedTravel: "",
    selectedShopping: "",
    selectedFamily: "",
    selectedHigh: "",
    selectedMedium: "",
    selectedLow: "",
  });
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

  //determine which category to be selected in the 'category' dropdown of the update form
    const selectedEducation = task.category === "Education" ? "selected" : "";
    const selectedHealth = task.category === "Health" ? "selected" : "";
    const selectedSocial = task.category === "Social" ? "selected" : "";
    const selectedWork = task.category === "Work" ? "selected" : "";
    const selectedPersonal = task.category === "Personal" ? "selected" : "";
    const selectedTravel = task.category === "Travel" ? "selected" : "";
    const selectedShopping = task.category === "Shopping" ? "selected" : "";
    const selectedFamily = task.category === "Family" ? "selected" : "";

  //determine which priority to be selected in the 'priority' dropdown of the update form
    const selectedHigh = task.priority === "High" ? "selected" : "";
    const selectedMedium = task.priority === "Medium" ? "selected" : "";
    const selectedLow = task.priority === "Low" ? "selected" : "";

    //determine which status to be selected in the 'status' dropdown of the update form
    const selectedNotStarted = task.status === "To-Do" ? "selected" : "";
    const selectedInProgress = task.status === "In Progress" ? "selected" : "";
    const selectedCompleted = task.status === "Completed" ? "selected" : "";

    res.render("updateform", {
      updateid: req.params.id,
      formdata: task,
      selectedEducation,
      selectedHealth,
      selectedSocial,
      selectedWork,
      selectedPersonal,
      selectedTravel,
      selectedShopping,
      selectedFamily,
      selectedHigh,
      selectedMedium,
      selectedLow,
      selectedNotStarted,
      selectedInProgress,
      selectedCompleted
    });
});

//delete task
app.get("/deletetask/:id", async function(req, res) {
  await Model.deleteTask(req.params.id);
  const categorizedTasks = await Model.getAllTasks();
  //redirect to the main page after updating the task
  res.redirect("/");
});

//delete all tasks
app.get("/deletealltasks", async function(req, res) {
  await Model.deleteAllTasks();
  const categorizedTasks = await Model.getAllTasks();
  //redirect to the main page after updating the task
  res.redirect("/");
});

//show all tasks
app.get("/", async function(req, res) {
  const categorizedTasks = await Model.getAllTasks();

  //check if due date is in the past for incompleted tasks and mark them overdue
  categorizedTasks.todo.forEach(task => {
    task.isOverdue = new Date(task.dueDate) < new Date();
    if(task.isOverdue == true){
      task.title = task.title + " - Overdue";
    }
    else{
      task.title = task.title
    }
  });
  categorizedTasks.inProgress.forEach(task => {
    task.isOverdue = new Date(task.dueDate) < new Date();
    if(task.isOverdue == true){
        task.title = task.title + " - Overdue";
      }
      else{
        task.title = task.title
      }
  });
  categorizedTasks.completed.forEach(task => {
    task.title = task.title
  });

  res.render("homepage", { tasks: categorizedTasks });
});

//get all tasks based on the filter provided
app.get("/tasks", async function(req, res) {
  const { filterCategory, filterPriority, sortBy } = req.query;

  let tasks = await Model.getTaskList();

  //filter tasks
  if (filterCategory) {
    tasks = tasks.filter(task => task.category === filterCategory);
  }
  if (filterPriority) {
    tasks = tasks.filter(task => task.priority === filterPriority);
  }

  //sort tasks
  if (sortBy) {
    tasks = tasks.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priority') {
        const priorities = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return priorities[a.priority] - priorities[b.priority];
      }
      return 0;
    });
  }

  tasks.forEach(task => {
    if(task.status != "Completed"){
      task.isOverdue = new Date(task.dueDate) < new Date();
      if(task.isOverdue == true){
          task.title = task.title + " - Overdue";
        }
        else{
          task.title = task.title
        }
    }
  });

  res.render("tasklist", { tasks: tasks });
});

//export list into a csv file
app.get("/exportcsv", async (req, res) => {
  try {
    const tasks = await Model.getTaskList();

    if (!tasks || tasks.length === 0) {
      return res.status(400).send("No tasks to export.");
    }

    //defines the field name for the csv file columns
    const fields = ["title", "description", "dueDate", "category", "priority", "status"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(tasks);

    //set response headers
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=tasks.csv");
    
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating CSV file.");
  }
});

//start the server
app.listen(3000, function() {
  console.log("Server listening on port 3000...");
});
