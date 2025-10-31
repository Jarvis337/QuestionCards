// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// require('dotenv').config();

// const questionRoute = require("./Routes/Question.route");

// // Create app FIRST
// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// // Database connection
// mongoose.connect('mongodb://127.0.0.1:27017/questionsDb')
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((err) => {
//     console.error('Error connecting to mongo', err.reason);
//   });


// const credentialSchema = new mongoose.Schema({
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true }
// });

// // Hash password before saving
// credentialSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   try {
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// const Credential = mongoose.model('credentialDb', credentialSchema);

// //jwt
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
  
//   if (!token) {
//     return res.status(401).json({ error: 'Token required' });
//   }
  
//   jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, user) => {
//     if (err) return res.status(403).json({ error: 'Invalid token' });
//     req.user = user;
//     next();
//   });
// }


// app.post('/api/auth/seed', async (req, res) => {
//   try {
//     await Credential.deleteMany({});
//     const sampleUsers = [
//       { email: 'john@example.com', password: 'password123' },
//       { email: 'jane@example.com', password: 'securepass456' },
//       { email: 'bob@example.com', password: 'mypass789' }
//     ];
    

//     const users = [];
//     for (const userData of sampleUsers) {
//       const user = new Credential(userData);
//       const savedUser = await user.save();
//       users.push(savedUser);
//     }
    
//     res.json({ message: 'Database seeded with 3 users', users });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Login endpoint
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password required' });
//     }
    
//     // Find user by email in credentialDb collection
//     const user = await Credential.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }
    
//     // Compare passwords
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }
    
//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET || 'your_secret_key',
//       { expiresIn: '24h' }
//     );
    
//     res.json({ 
//       message: 'Login successful',
//       token,
//       user: { id: user._id, email: user.email }
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Protected route example - verify token
// app.get('/api/auth/verify', authenticateToken, (req, res) => {
//   res.json({ 
//     message: 'Token is valid',
//     user: req.user 
//   });
// });


// app.use('/api/questions', questionRoute);


// // 404 handler
// app.use((req, res, next) => {
//   res.status(404).json({ message: 'Route not found' });
// });


// app.use((err, req, res, next) => {
//   console.error(err.message);
//   if (!err.statusCode) err.statusCode = 500;
//   res.status(err.statusCode).send(err.message);
// });


// const port = process.env.PORT || 4000;
// app.listen(port, () => {
//   console.log('Connected to port ' + port);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const questionRoute = require("./Routes/Question.route");

// Create app FIRST
const app = express();

// Middleware - IMPORTANT: Must be before routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/questionsDb')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason);
  });

const credentialSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

// Hash password before saving
credentialSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

const Credential = mongoose.model('credentialDbs', credentialSchema);

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Seed endpoint
app.post('/api/auth/seed', async (req, res) => {
  try {
    await Credential.deleteMany({});
    const sampleUsers = [
      { email: 'john@example.com', password: 'password123' },
      { email: 'jane@example.com', password: 'securepass456' },
      { email: 'bob@example.com', password: 'mypass789' }
    ];

    const users = [];
    for (const userData of sampleUsers) {
      const user = new Credential(userData);
      const savedUser = await user.save();
      users.push(savedUser);
    }

    res.json({ message: 'Database seeded with 3 users', users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validation
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Email, password, and confirm password are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if email already exists
    const existingUser = await Credential.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const newUser = new Credential({ email, password });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'Registration successful',
      user: { id: savedUser._id, email: savedUser.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user by email
    const user = await Credential.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected route - verify token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: req.user
  });
});

app.use('/api/questions', questionRoute);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Connected to port ' + port);
});