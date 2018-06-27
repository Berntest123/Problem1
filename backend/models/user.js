const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // We can add plugins on the Schema

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true},  // unique doesn't validate the email, doesn't throw an error
  password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
