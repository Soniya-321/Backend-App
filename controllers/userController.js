const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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


// Login a user
exports.loginUser = async (req, res) => {
  const { mobileNumber, password } = req.body;

  if (!mobileNumber || !password) {
    return res.status(400).json({ message: 'Mobile number and password are required' });
  }

  User.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Find the user by mobile number
    const user = results.find((user) => user.mobile_number === mobileNumber);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user.id, mobileNumber: user.mobile_number }, 'your_jwt_secret', {
        expiresIn: '1h', // Token expires in 1 hour
      });

      res.status(200).json({ message: 'Login successful', token });
    });
  });
};

// Verify user and get details
exports.verifyUser = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Fetch user details using the decoded token's user ID
    User.getById(decoded.id, (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Send user details back to frontend
      res.status(200).json({
        firstName: user.first_name,
        lastName: user.last_name,
      });
    });
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
    if (results === undefined) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(results);
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
