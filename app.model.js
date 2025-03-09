const sqlite3 = require("sqlite3").verbose();
let db;

module.exports.makeConnection = function() {
  db = new sqlite3.Database('taskmanager.db');
};

module.exports.addTask = function(taskData) {
  return new Promise((resolve, reject) => {
    const { title, description, dueDate, category, priority } = taskData;
    const status = "To-Do";

    const stmt = db.prepare("INSERT INTO Tasks (title, description, dueDate, category, priority, status) VALUES (?,?,?,?,?,?)");
    stmt.run(title, description, dueDate, category, priority, status, function(err) {
      if (err) reject(err);
      resolve(this.lastID);
    });
    stmt.finalize();
  });
};

module.exports.updateTask = function(taskData, taskId) {
  return new Promise((resolve, reject) => {
    const { title, description, dueDate, category, priority, status } = taskData;
    const stmt = db.prepare("UPDATE Tasks SET title = ?, description = ?, dueDate = ?, category = ?, priority = ?, status = ? WHERE rowid = ?");
    stmt.run(title, description, dueDate, category, priority, status, taskId, function(err) {
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
    db.all("SELECT rowid, title, description, dueDate, category, priority, status FROM Tasks", [], (err, rows) => {
      if (err) reject(err);

      //categorize tasks into three groups based on their status
      const categorizedTasks = {
        todo: [],
        inProgress: [],
        completed: []
      };

      rows.forEach(task => {
        if (task.status === 'To-Do') {
          categorizedTasks.todo.push(task);
        } else if (task.status === 'In Progress') {
          categorizedTasks.inProgress.push(task);
        } else if (task.status === 'Completed') {
          categorizedTasks.completed.push(task);
        }
      });

      //return the categorized tasks
      resolve(categorizedTasks);
    });
  });
};


