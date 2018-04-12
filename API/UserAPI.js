const express = require('express');
const router = express.Router();
const UserdetailsM =require('../Model/UserDetails');
const config = require('../config/Database');
const url = require('url');
const querystring = require('querystring');
const async = require('async');
const Request = require("request");
const crypto = require('crypto');


const ENCRYPTION_KEY = '@&*$%^$!@#anuj^^^^^####!!!!!!^^^'; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16
//Ref:http://stackabuse.com/get-query-strings-and-parameters-in-express-js/
// router.get('/textsearch',(req,res)=>{

//     let parsedUrl = url.parse(req.url);  
//     let parsedQs = querystring.parse(parsedUrl.query);
//     console.log(parsedQs.location);
//     console.log(parsedQs.cuisine);
//     console.log(parsedQs.radius);

//     Request.get("https://maps.googleapis.com/maps/api/place/textsearch/json?radius=" + parsedQs.radius +"&key=AIzaSyAkL7MteqiUjMsqjdLIkMWEMEKlmmzXpfQ&query="+ parsedQs.cuisine + "+near+" + parsedQs.location, (error, response, body) => {
//         if(error) {
//             return console.dir(error);
//         }
//         console.dir(JSON.parse(body));
//         var objGoogleResponse = new googleResponse(JSON.parse(req.body));
//         console.log(objGoogleResponse);
//         res.json({success : false,msg:'Invalid Password'});
//         // objGoogleResponse.save((err,success)=>{
//         //     if(err) res.json({ success :false ,msg:'Not added'});
//         //     else res.json({success :true, msg:'Added'});
//         //     });
//     });


    
//     // getUserByUser(UserDetails.email,(err,userData)=>{
//     //     if(err) res.json({success : false,msg:'Unable to process request'});
//     //     if(!userData)
//     //        res.json({success : false,msg:'Invalid User'});
//     //    //  console.log("gETTING RESPONSE FORM DB: "+userData);
//     //     if(UserDetails.password == userData.password){
//     //    const token = jwt.sign({ClientEmail :userData.email,exp: Math.floor(Date.now() / 1000) + (60 * 60) },config.secrete);
//     //        res.json({success:true,token:'JWT '+ token,UserDetail:{id:userData._id,username:userData.username,name:userData.name,email:userData.email}});
        
//     //    }else
//     //        res.json({success : false,msg:'Invalid Password'});
//     //    //  comparePassword(UserDetails.password,userData.password,function(err,isMatch){
//     //    //     if(err) res.json({success : false,msg:'Unable to process request'});
//     //    //     if(isMatch){
//     //    //        // const token = jwt.sign(userData,config.s)
//     //    //     res.json({success:true,UserDetail:{id:userData._id,username:userData.username,name:userData.name}});
//     //    //     }
//     //    //     else
//     //    //         res.json({success : false,msg:'Invalid Password'});
//     //    //  });
//     // });
   
//    });


   router.post('/getLogDetails',(req,res,next)=>{
     var Username = req.body.Username;
     var MacId = req.body.MacId;
    // console.log("Username:"+ Username,"MacId:"+MacId);
    
    // UserdetailsM.UserDetails.find({UserId:Username,MACId:MacId,IsViewed:false},(mongoerr,mongoresponse)=>{    
    UserdetailsM.UserDetails.findOneAndUpdate({UserId:Username,MACId:MacId,IsViewed:false},{$set:{IsViewed:true}},(mongoerr,mongoresponse)=>{
        //  console.log("findData" + mongoresponse);
        //  console.log("mongoerr:" + mongoerr);
            if(mongoerr == null){
            res.json({success:true,Data:mongoresponse});
        }
        else{
            res.json({success :false, Error:mongoerr});
     }
    });
   });
   

   router.post('/getallLogDetails',(req,res,next)=>{
    var Username = req.body.Username;
    var MacId = req.body.MacId;   
   UserdetailsM.UserDetails.find({UserId:Username,MACId:MacId},(mongoerr,mongoresponse)=>{    
           if(mongoerr == null){
           res.json({success:true,Data:mongoresponse});
       }
       else{
           res.json({success :false, Error:mongoerr});
    }
   });
  });



   router.post('/postLogDetails',(req,res,next)=>{
       console.log(req);
    var Username = req.body.Username;
    var MacId = req.body.MacId;
    var message = req.body.Message;
    var Date = req.body.Date;
    var CallLog =  req.body.CallLog;
    var ObjIsCall = req.body.IsCall;
    var ObjIsSMS = req.body.IsSMS;
   console.log("Username:"+ Username,"MacId:"+ MacId);
   var ObjUserdetailsM = new UserdetailsM.UserDetails({
            UserId:Username,
            MACId:MacId,
            Message:message,
            Date:Date,
            CallLog:CallLog,
            IsCall:ObjIsCall,
            IsSMS:ObjIsSMS,
            IsViewed:false
        });
        ObjUserdetailsM.save((mongoerr,success)=>{
            if(mongoerr !=null) res.json({ success :false ,msg:'Not added',error:mongoerr});
             else
             res.json({success :true, msg:'Added'});
             });
  });


  router.post('/getEncrpToken',(req,res,next)=>{
    var Username = req.body.Username;
    var password = req.body.password;
    if(Username!=null && Username!=undefined && password!=null && password!=undefined)
    {
        var Token = encrypt(password.trim() + " || " + Username.trim());
            var ObjUserLoginTokenM = new UserdetailsM.UserLoginTokenM({
                UserId:Username,
                Password:password,
                AESToken:Token,
                Date:new Date().toDateString(),
                IsValid:true
            });    
            ObjUserLoginTokenM.save((mongoerr,success)=>{
            if(mongoerr !=null) res.json({ success :false ,msg:'Not added',error:mongoerr,AESToken:""});
            else
            res.json({success :true, msg:'Added', AESToken : Token});
            });
            }
    else
    {
        res.json({success :false, msg:'Value required'});
    }
  });


router.post('/GetLoginToken',(req,res)=>{
    var Username = req.body.Username;
    var password = req.body.password;
    if(Username!=null && Username!=undefined && password!=null && password!=undefined)
    {
        UserdetailsM.UserLoginTokenM.findOne({UserId:Username,Password:password,Date:new Date().toDateString()},(mongoerr,mongoresponse)=>{    
            if(mongoerr == null){
            res.json({success:true,AESToken:mongoresponse.AESToken});
        }
        else{
            res.json({success :false, Error:mongoerr});
         }
    });

    }
});
  
  router.post('/getDecrToken',(req,res,next)=>{
    var Username = req.body.Token;
    if(Username!=null && Username!=undefined)
    {
        var Token = decrypt(Username.toUpperCase());
        res.json({success :true, msg:'Added', AESDescToken : Token});
    }
    else
    {
        res.json({success :false, msg:'Value required'});
    }
  });


  function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
  
    encrypted = Buffer.concat([encrypted, cipher.final()]);
  
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }
  
  function decrypt(text) {
    let textParts = text.split(':');
    let iv = new Buffer(textParts.shift(), 'hex');
    let encryptedText = new Buffer(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
  
    decrypted = Buffer.concat([decrypted, decipher.final()]);
  
    return decrypted.toString();
  }

   module.exports = router;