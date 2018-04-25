const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose =require('mongoose');
const config = require('./config/Database');


//Connect mongodb with config file 
mongoose.connect(config.database);

//successfull connection
mongoose.connection.on('connected',()=>{
console.log('connected to database' + config.database); 
});

//on Error connection
mongoose.connection.on('error',(err)=>{
    console.log('Failed to connect to  database' + err); 
});


const app = express();
const UserLogAPI  = require('./API/UserAPI');


//CORS Middleware
app.use(cors());

//Port Number
const port = process.env.PORT || 9899
//  const port = 9899;



app.use(bodyparser.urlencoded({ extended: true }))


//Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Body parser middleware 
app.use(bodyparser.json());

app.use('/api',UserLogAPI);

app.use('/',(req,res)=>{
    res.send('sorry this website is not available in your country.');
});

app.listen(port,()=>{
    console.log("Server created at:" + port);
});
