exports.get = (req, res, next) => {
  console.log('getting todos');
  res.send('get works!');
};

exports.post = [
  (_, __, next) => {
    console.log('mw');
    next();
  },
  (_, res) => {
    console.log('mw 2');
    res.send('posted');
  },
];

exports.asdf = (req, res, next) => next();
