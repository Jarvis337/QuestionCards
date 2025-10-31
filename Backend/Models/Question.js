// // File: ../Models/Question.js

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// let Question = new Schema({
//   // The structure to match your single document
//   technologies: [{
//     name: String,
//     questions: [{
//       id: Number,
//       question: String,
//       answer: String
//     }]
//   }]
// }, {
//   collection: 'technology'
// });

// module.exports = mongoose.model('Question', Question);


// File: ../Models/Question.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Question sub-schema
const questionSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
}, { _id: false });

// Technology sub-schema
const technologySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  questions: [questionSchema]
}, { _id: false });

// Main Question schema
const Question = new Schema({
  technologies: {
    type: [technologySchema],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'technology',
  timestamps: true
});

module.exports = mongoose.model('Question', Question);