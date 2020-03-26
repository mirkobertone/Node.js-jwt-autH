const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingSchema = mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  when: {
    type: Date,
    required: false,
    minlength: 3,
    maxlength: 50
  },
  link: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 50
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Meeting', meetingSchema);
