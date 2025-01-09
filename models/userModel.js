const db = require('../config/db');

const User = {
  create: (user, callback) => {
    const sql = `
      INSERT INTO users (first_name, last_name, mobile_number, password, created_by, updated_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(
      sql,
      [user.firstName, user.lastName, user.mobileNumber, user.password, user.createdBy, user.updatedBy],
      function (err) {
        callback(err, { id: this.lastID });
      }
    );
  },

  getAll: (callback) => {
    const sql = `SELECT * FROM users`;
    db.all(sql, callback);
  },

  getById: (id, callback) => {
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.get(sql, [id], callback);
  },

  update: (id, user, callback) => {
    const sql = `
      UPDATE users
      SET first_name = ?, last_name = ?, mobile_number = ?, updated_by = ?
      WHERE id = ?
    `;
    db.run(
      sql,
      [user.firstName, user.lastName, user.mobileNumber, user.updatedBy, id],
      function (err) {
        callback(err, { changes: this.changes });
      }
    );
  },

  delete: (id, callback) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    db.run(sql, [id], function (err) {
      callback(err, { changes: this.changes });
    });
  },
};

module.exports = User;
