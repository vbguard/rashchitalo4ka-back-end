const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EventSchema = require("./Event.schema");

const UserFinanceSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  data: [EventSchema],
  totalBalance: {
    type: Number
  },
  totalCoasts: {
    type: Number
  },
  totalIncome: {
    type: Number
  }
});

const UserFinance = mongoose.model("UserFinance", UserFinanceSchema);

module.exports = UserFinance;
