exports.get = (req, res, next) => {
  console.log('getting todos');
  res.send('get works!');
};

exports.post = [
  (_, __, next) => {
    console.log('numero uno');
    next();
  },
  (_, res) => {
    console.log('numero dos');
    res.send('posteddddd');
  },
];

exports.asdf = (req, res, next) => next();
