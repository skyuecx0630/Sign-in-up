const mongoose = require('mongoose');
const {Schema} = mongoose;
const crypto = require('crypto');
const { generateToken } = require('../lib/token');

function hash(password) {
    return crypto.createHmac('sha256', process.env.SECRET_KEY).update(password).digest('hex');
}

const Account = new Schema({
    profile: {
        username:String,
        thumbnail: { type: String, default: '/static/images/default_thumbnail.png'}
    },
    email: {type: String},
    social: {
        facebook: {
            id: String,
            accessToken: String
        },
        google: {
            id: String,
            accessToken: String
        }
    },
    password: String,
    thoughtCount: {type: Number, dafault: 0},
    createdAt: {type: Date, default: Date.now}
});

Account.statics.localRegister = function({ username, email, password }) {
  // 데이터를 생성 할 때는 new this() 를 사용합니다.
  const account = new this({
    profile: {
      username
      // thumbnail 값을 설정하지 않으면 기본값으로 설정됩니다.
    },
    email,
    password: hash(password)
  });
  return account.save();
};

Account.statics.findByUsername = function(username) {
  return this.findOne({ "profile.username": username }).exec();
};

Account.statics.findByEmail = function(email) {
  return this.findOne({ email }).exec();
};

Account.statics.findByEmailOrUsername = function({username, email}){
  return this.findOne({
    $or: [
      {profile: username},
      {email}
    ]
  }).exec();
};

Account.methods.validatePassword = function(password) {
    const hashed = hash(password);
    return this.password === hashed;
};

Account.methods.generateToken = () =>{
    const payload = {
        _id: this._id,
        profile: this.profile
    };

    return generateToken(payload, 'account');
};

module.exports = mongoose.model('Account', Account);