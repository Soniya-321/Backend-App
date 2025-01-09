const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Create a new user
exports.createUser = async (req, res) => {
  const { firstName, lastName, mobileNumber, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    firstName,
    lastName,
    mobileNumber,
    password: hashedPassword,
    createdBy: 'admin',
    updatedBy: 'admin',
  };

  User.create(newUser, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User created successfully', userId: results.insertId });
  });
};

// Get all users
exports.getAllUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Get user by ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  User.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(results[0]);
  });
};

// Update a user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, mobileNumber } = req.body;

  const updatedUser = {
    firstName,
    lastName,
    mobileNumber,
    updatedBy: 'admin',
  };

  User.update(id, updatedUser, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'User updated successfully' });
  });
};

// Delete a user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  User.delete(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'User deleted successfully' });
  });
};
