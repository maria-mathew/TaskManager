var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("taskmanager.db");

db.serialize(function() {

  // drop the Tasks table if it exists and create a new one for tasks
  db.run("DROP TABLE IF EXISTS Tasks");
  db.run(`
    CREATE TABLE Tasks (
      title TEXT,
      description TEXT,
      dueDate TEXT,
      category TEXT,
      priority TEXT,
      status TEXT
    )
  `);

  db.run("INSERT INTO Tasks (title, description, dueDate, category, priority, status) VALUES (?,?,?,?,?,?)", 
    ['Math Assignment 1', 'Solve the problems on page 24', '2025-04-10', 'Education', 'High', 'To-Do']);
  db.run("INSERT INTO Tasks (title, description, dueDate, category, priority, status) VALUES (?,?,?,?,?,?)", 
    ['History Project', 'Research on ancient civilizations', '2025-03-8', 'Education', 'Medium', 'In Progress']);
  db.run("INSERT INTO Tasks (title, description, dueDate, category, priority, status) VALUES (?,?,?,?,?,?)", 
    ['Grocery Shopping', 'Buy vegetables, fruits, and dairy products', '2025-04-07', 'Personal', 'Medium', 'To-Do']);
  db.run("INSERT INTO Tasks (title, description, dueDate, category, priority, status) VALUES (?,?,?,?,?,?)", 
    ['Work Presentation', 'Prepare slides for upcoming client meeting', '2025-04-12', 'Work', 'High', 'To-Do']);
  db.run("INSERT INTO Tasks (title, description, dueDate, category, priority, status) VALUES (?,?,?,?,?,?)", 
    ['Morning Jog', 'Go for a 30-minute jog around the park', '2025-03-06', 'Health', 'Low', 'Completed']);
  db.run("INSERT INTO Tasks (title, description, dueDate, category, priority, status) VALUES (?,?,?,?,?,?)", 
    ['Plan Social Gathering', 'Invite friends for a weekend BBQ', '2025-04-13', 'Social', 'Medium', 'In Progress']);

});
