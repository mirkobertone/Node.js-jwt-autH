const router = require('express').Router();
const User = require('../model/user');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');

router.post('/register', async (req, res) => {
  //VALIDATE USER BEFORE ADD IT
  try {
    console.log(req.body);
    const { value } = await registerValidation(req.body);
    console.log('TRY register validation');
  } catch (err) {
    console.log('CATH register validation');
    return res.status(400).send(err.details[0].message);
  }

  //CHECK IF EMAIL ALREADY EXISTS
  const value = await User.findOne({ email: req.body.email }, function(
    err,
    found
  ) {
    if (err) return 'Error in findOne in DB';
    if (found) return 'Email already exists';
  });
  if (value) return res.status(400).send('Email already exists');

  //CHECK PASSWORD
  const pw1 = req.body.password1;
  const pw2 = req.body.password2;
  if (pw1 != pw2) return res.status(400).send('Passwords do not match');

  //HASH PASSWORD!  --  Usage - Sync
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hashSync(req.body.password1, salt);
  console.log(salt);
  console.log(hashedPassword);

  //VALIDATION IN PASSED
  const user = new User({
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    email: req.body.email,
    password: hashedPassword
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
    console.log(req.body);
    const { value } = await loginValidation(req.body);
    console.log('TRY login validation');
  } catch (err) {
    console.log('CATH login validation');
    return res.status(400).send(err.details[0].message);
  }

  //CHECK IF EMAIL ALREADY EXISTS
  // prettier-ignore
  const user = await User.findOne({ "email": req.body.email }, function (err, found) {
    console.log(found)
    if (err) return 'Error in findOne in DB';
  });
  //email not found
  if (!user) return res.status(400).send('Email or password is wrong');

  const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
  if (!isPasswordValid)
    return res.status(400).send('Email or password is wrong');

  //CREATE AND ASSIGN TOKEN
  //FORMAT OF TOKEN
  //Authorization: Bearer <access_token>
  // prettier-ignore
  const token = jwt.sign({ _id: user._id, email: user.email }, process.env.TOKEN_SECRET);

  //USER_ODT
  usrResp = {
    firstName: user.firstname,
    lastName: user.lastname,
    email: user.email,
    token: token
  };

  console.log(usrResp);
  console.log('Invio token');
  return res.send(usrResp);
  //res.send('Logged in!');
});

router.get('/verify', verify, (req, res) => {
  console.log(req.user);
  res.status(200).send('!!VERIFICATO!!');
});

module.exports = router;
