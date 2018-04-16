const mongoose = require('mongoose');
const config = require('../config/Database');


//Online Schmema generation https://transform.now.sh/json-to-mongoose#

const UserDetails = mongoose.Schema({
  UserId:String,
  MACId:String,
  Message:String,
  Date:String,
  CallLog:String,
  IsCall:Boolean,
  IsSMS:Boolean,  
  IsViewed:Boolean
});

const UserLoginToken = mongoose.Schema({
  UserId:String,
  Password:String,
  Date:String,
  AESToken:String,
  IsValid:Boolean
});

const UserDetailsAES = mongoose.Schema({
  AESToken:String,
  Message:String,
  Date:String,
  CallLog:String,
  IsCall:Boolean,
  IsSMS:Boolean,  
  IsViewed:Boolean
});


const ExceptionUserDetails = mongoose.Schema({
  Exception:String,
  Date:String
});



  const UserDetailsModel  = mongoose.model('UserDetails',UserDetails);
  const UserLoginTokenModel  = mongoose.model('UserLoginToken',UserLoginToken);
  const UserDetailsAESModel  = mongoose.model('UserDetailsAES',UserDetailsAES);
  const ExceptionUserDetailsModel  = mongoose.model('ExceptionUserDetails',ExceptionUserDetails);
  



  module.exports = {
    UserDetails: UserDetailsModel,
    UserLoginTokenM :UserLoginTokenModel,
    UserDetailsAESM:UserDetailsAESModel,
    ExceptionUserDetailsM:ExceptionUserDetailsModel
    //, FoodType: FoodTypeModal,
    // PhoneDetails: UPhoneDetails,
    // ByLocation: UByLocation
};
