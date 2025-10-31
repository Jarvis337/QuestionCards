const express = require('express');
const jwt = require('jsonwebtoken');
const Question = require('../Models/Question');
const questionRoute = express.Router();


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}


questionRoute.route('/').get(authenticateToken, async (req, res, next) => {
  try {
    const data = await Question.find();
    res.json(data);
  } catch (error) {
    next(error);
  }
});


questionRoute.route('/by-technology/:technology').get(authenticateToken, async (req, res, next) => {
  try {
    const technology = req.params.technology;
    

    const doc = await Question.findOne({ "technologies": { $exists: true } });
    
    if (!doc || !doc.technologies) {
      return res.status(404).json({ message: 'Technology data container not found' });
    }
    

    const techData = doc.technologies.find(t => 
      t.name.toLowerCase() === technology.toLowerCase()
    );
    
    if (!techData || techData.questions.length === 0) {
      return res.status(404).json({ message: `No questions found for technology: ${technology}` });
    }
    

    res.json(techData.questions);
  } catch (error) {
    console.error('Error:', error);
    next(error);
  }
});

module.exports = questionRoute;