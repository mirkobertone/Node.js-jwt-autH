const jwt = require('jsonwebtoken');

/* module.exports = function(req, res, next) {
  console.log('Verifica Token');
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(req.user);
    //THERE IS THE JWT DECODED PAYLOAD
    req.user = decodedToken;
    console.log(req.user);
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
}; */

module.exports = function(req, res, next) {
  console.log('Verifica Token');

  const bearerHeader = req.headers['authorization'];
  console.log(bearerHeader);
  if (bearerHeader === undefined) return res.status(401).send('Access Denied');
  try {
    const bearerToken = bearerHeader.split(' ')[1];
    console.log(bearerToken);
    const decodedToken = jwt.verify(bearerToken, process.env.TOKEN_SECRET);
    req.user = decodedToken;
    console.log(req.user);
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};
