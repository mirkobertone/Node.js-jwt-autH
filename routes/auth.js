const router = require('express').Router();
const User = require('../model/user');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');

router.post('/register', async (req, res) => {
  //VALIDATE USER BEFORE ADD IT
  try {
    const { value } = await registerValidation(req.body);
    console.log('TRY register validation');
  } catch (err) {
    console.log('CATH register validation');
    return res.status(400).send(err);
  }

  //CHECK IF EMAIL ALREADY EXISTS
  // prettier-ignore
  const value = await User.findOne({ "email": req.body.email }, function(err, found) {
    if (err) return 'Error in findOne in DB';
    if (found) return 'Email already exists';
  });
  if (value) return res.status(400).send('Email already exists');

  //HASH PASSWORD!  --  Usage - Sync
  const salt = await bcrypt.genSalt(10);
  const hashedPasswor = await bcrypt.hashSync(req.body.password, salt);
  console.log(salt);
  console.log(hashedPasswor);

  //VALIDATION IN PASSED
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPasswor
  });

  //DATA PERSISTENCE
  try {
    console.log('Saving in DB...');
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  //VALIDATE USER INPUT AT LOGIN
  try {
    const { value } = await loginValidation(req.body);
    console.log('TRY login validation');
  } catch (err) {
    console.log('CATH login validation');
    return res.status(400).send(err);
  }

  //CHECK IF EMAIL ALREADY EXISTS
  // prettier-ignore
  const user = await User.findOne({ "email": req.body.email }, function(err, found) {
    if (err) return 'Error in findOne in DB';
    if (found) return 'Email already exists';
  });
  //email not found
  if (!user) return res.status(400).send('Email or password is wrong');

  const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
  if (!isPasswordValid)
    return res.status(400).send('Email or password is wrong');

  //Create and assign a token
  // prettier-ignore
  const token = jwt.sign({ _id: user._id, name:user.name }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
  //res.send('Logged in!');
});

router.get('/', verify, (req, res) => {
  res.send('!!VERIFICATO!!');
});

module.exports = router;
