const mongoose = require("mongoose");
require('dotenv').config();

const conn = async () => {
  try {    
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error.message);
  }
};

module.exports = conn;