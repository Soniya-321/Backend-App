const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Allow requests from your frontend
const corsOptions = {
  origin: 'https://frontend-project-7ksn.onrender.com', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Include credentials like cookies, if needed
};


// Middleware
app.use(bodyParser.json());
app.use(cors(corsOptions));

// Routes
app.use('/api', userRoutes);

// Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
