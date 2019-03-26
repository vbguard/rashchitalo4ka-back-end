const UserFinance = require("../models/UserFinance.model");

module.exports.getFinance = (req, res) => {
  UserFinance.findOne({ userId: req.params.userId }).then(doc => {
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

  UserFinance.findOne({ userId }).exec((err, userFinance) => {
    userFinance.data.push(newData);
    userFinance.totalBalance = newData.balanceAfter;
    userFinance.save();
    res.json({ userFinance });
  });
};
