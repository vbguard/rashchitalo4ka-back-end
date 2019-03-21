const UserFinance = require("../models/UserFinance.model");

module.exports.getFinance = (req, res) => {
  UserFinance.findOne({ userId: req.params.id }).exec((err, doc) => {
    if (err) console.log(err);
    res.status(200).json({
      msg: "success",
      data: doc
    });
  });
};

module.exports.saveFinance = (req, res) => {
  const userId = req.body.userId;
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
