const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const mongodb_url = 'mongodb+srv://matchProject:kobiton9664@cluster0.g85tt.mongodb.net/match_db?retryWrites=true&w=majority';
const port = 5900;
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


const actionRoute = require('./Controllers/actions');
app.use('/api', actionRoute);




mongoose.connect(mongodb_url, {useNewUrlParser: true,useUnifiedTopology:true})
.then(res => {
   console.log(res);
   app.listen(port, function(){
    console.log(`Connect to port ${port}`);
   })
})
.catch(error => {
    console.log(error)
})