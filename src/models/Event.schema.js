const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  date: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  comments: {
    type: String,
    default: ""
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  }
});

module.exports = EventSchema;
