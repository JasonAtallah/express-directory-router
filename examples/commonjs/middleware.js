module.exports = {
  emptyMiddleware(_, __, next) {
    console.log('Running empty middleware');
    next();
  },

  sendResponse(req, res) {
    const { path } = req.route;
    const method = Object.keys(req.route.methods)[0].toUpperCase();

    res.send(`${method} ${path} - SUCCESS`);
  },
};
