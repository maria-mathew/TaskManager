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
      subject TEXT,
      status TEXT
    )
  `);

  db.run("INSERT INTO Tasks (title, description, dueDate, subject, status) VALUES (?,?,?,?,?)", 
    ['Math Assignment 1', 'Solve the problems on page 24', '2025-03-10', 'Mathematics', 'To-Do']);
  db.run("INSERT INTO Tasks (title, description, dueDate, subject, status) VALUES (?,?,?,?,?)", 
    ['History Project', 'Research on ancient civilizations', '2025-03-15', 'History', 'In Progress']);
  db.run("INSERT INTO Tasks (title, description, dueDate, subject, status) VALUES (?,?,?,?,?)", 
    ['English Essay', 'Write an essay on your favorite book', '2025-03-20', 'English', 'Completed']);
  db.run("INSERT INTO Tasks (title, description, dueDate, subject, status) VALUES (?,?,?,?,?)", 
    ['Science Lab Report', 'Complete the lab report for experiment 3', '2025-03-25', 'Science', 'To-Do']);
  db.run("INSERT INTO Tasks (title, description, dueDate, subject, status) VALUES (?,?,?,?,?)", 
    ['Computer Science Homework', 'Code the final project in Python', '2025-03-30', 'Computer Science', 'In Progress']);

});
