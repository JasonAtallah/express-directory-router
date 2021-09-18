exports.get = (_, res) => {
  console.log('this is from GET /todo/coments/[comid/index');
  res.send('this is from GET /todo/coments/[comid/index');
};

exports.put = () => console.log('this is from put /todo/coments/[comid/index');
