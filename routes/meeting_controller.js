const router = require('express').Router();
const Meeting = require('../model/meeting');
const verify = require('./verifyToken');

router.post('/meetings', verify, async (req, res) => {
  //CREATE A LINK
  //TODO
  link = 'new_link';

  //TAKE INFO FROM JWT DECODIFICATION
  user_id = req.user._id;

  //CREATE NEW MEETING
  const meeting = new Meeting({
    user_id: user_id,
    title: req.body.title,
    when: req.body.when,
    link: link
  });
  try {
    console.log('Saving meeting in DB...');
    const savedMeeting = await meeting.save();
    res.send(savedMeeting);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/meetings', verify, async (req, res) => {
  user_id = req.user._id;

  const meetings = await Meeting.find({ user_id: user_id }, function(
    err,
    found
  ) {
    console.log(found);
    if (err) return 'Error in findOne in DB';
  });
  console.log('GET meetings');
  console.log(meetings);

  res.send(meetings);
});

router.delete('/meetings/:id_meeting', verify, (req, res) => {
  const id_meeting = req.params.id_meeting;
  Meeting.deleteOne({ _id: id_meeting }, function(err) {
    if (err) return handleError(err);
    // deleted at most one tank document
  });
  res.send();
});

router.put('/meetings/', verify, async (req, res) => {
  console.log('PUT!!');
  console.log(req.body);
  const updatedMeeting = await Meeting.findByIdAndUpdate(
    req.body._id,
    { title: req.body.title, when: req.body.when },
    function(err, found) {
      console.log(found);
      if (err) return 'Error in findOne in DB';
    }
  );
  //const updateMeeting = new Meeting(req.body);
  //const update = await updateMeeting.save(updateMeeting);
  res.send(updatedMeeting);
});

module.exports = router;
