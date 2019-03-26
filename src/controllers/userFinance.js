const UserFinance = require("../models/UserFinance.model");

module.exports.getFinance = (req, res) => {
  const userId = req.params.userId;

  UserFinance.findOne({ userId }).then(doc => {
    if (!doc) {
      res.status(400).json({
        success: false,
        message: "Not found finance data with this user ID"
      });
    }

    res.status(200).json({
      success: true,
      message: "Data found with this ID",
      finance: doc
    });
  });
};

module.exports.saveFinance = (req, res) => {
  const userId = req.params.userId;

  const newData = {
    dateEvent: req.body.data.dateEvent,
    typeEvent: req.body.data.typeEvent,
    category: req.body.data.category,
    comments: req.body.data.comments,
    amountEvent: req.body.data.amountEvent,
    balanceAfter: req.body.data.balanceAfter
  };

  UserFinance.findOneAndUpdate(
    { userId },
    { $push: { data: newData }, totalBalance: newData.balanceAfter },
    { new: true, upsert: true }
  )
    .lean()
    .exec(function(err, docs) {
      if (err) {
        res.status(400).json({
          success: false,
          message: err
        });
      }
      res.status(200).json({
        success: true,
        message: "Data updated",
        data: docs
      });
    });
};
