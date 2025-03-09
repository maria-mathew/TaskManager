const sqlite3 = require("sqlite3").verbose();
let db;

module.exports.makeConnection = function() {
  db = new sqlite3.Database('taskmanager.db');
};

module.exports.addTask = function(taskData) {
  return new Promise((resolve, reject) => {
    const { title, description, dueDate, subject, status } = taskData;
    const stmt = db.prepare("INSERT INTO Tasks (title, description, dueDate, subject, status) VALUES (?,?,?,?,?)");
    stmt.run(title, description, dueDate, subject, status, function(err) {
      if (err) reject(err);
      resolve(this.lastID);
    });
    stmt.finalize();
  });
};

module.exports.updateTask = function(taskData, taskId) {
  return new Promise((resolve, reject) => {
    const { title, description, dueDate, subject, status } = taskData;
    const stmt = db.prepare("UPDATE Tasks SET title = ?, description = ?, dueDate = ?, subject = ?, status = ? WHERE rowid = ?");
    stmt.run(title, description, dueDate, subject, status, taskId, function(err) {
      if (err) reject(err);
      resolve(this.changes);
    });
    stmt.finalize();
  });
};

module.exports.deleteTask = function(taskId) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM Tasks WHERE rowid = ?", [taskId], function(err) {
      if (err) reject(err);
      resolve(this.changes);
    });
  });
};

module.exports.deleteAllTasks = function() {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM Tasks", function(err) {
      if (err) reject(err);
      resolve(this.changes);
    });
  });
};

module.exports.getAllTasks = function() {
  return new Promise((resolve, reject) => {
    db.all("SELECT rowid, title, description, dueDate, subject, status FROM Tasks", [], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

