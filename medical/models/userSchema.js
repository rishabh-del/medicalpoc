var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {

    emailID: {
      type: String
    },
    password: {

    type: String
    },
    role:{
      type : String
    },

  },
  { collection: 'userdata' },
);

const User = mongoose.model('User', UserSchema);
module.exports = { User };


