const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const mongodb_url = 'mongodb+srv://store_user:Q78kF0frybnjS3nx@cluster0.yrd6o.mongodb.net/store_db?retryWrites=true&w=majority';
const port = 5900;
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


const actionRoute = require('./Controllers/actions');
app.use('/api', actionRoute);




mongoose.connect(mongodb_url, {useNewUrlParser: true,useUnifiedTopology:true})
.then(res => {
//    console.log(res);
   app.listen(port, function(){
    console.log(`Connect to port ${port}`);
   })
})
.catch(error => {
    console.log(error)
})