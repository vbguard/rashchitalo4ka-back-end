const messages = {
  notFound: "Not found"
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: messages.notFound
  });
};

module.exports = notFoundHandler;
