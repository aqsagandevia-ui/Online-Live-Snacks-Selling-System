const mongoose = require('mongoose');

// Define the schema for the register collection
const RegisterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now }

});

// Export the model
module.exports = mongoose.model('Register', RegisterSchema);
