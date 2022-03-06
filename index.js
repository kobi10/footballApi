const express = require('express');
const bodyParsar = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const url = 'mongodb+srv://matchProject:ujT9qIo3DsCmvfSR@cluster0.g85tt.mongodb.net/match_db?retryWrites=true&w=majority'
app.use(bodyParsar.urlencoded());
app.use(bodyParsar.json());
const port = 5090

mongoose.connect(url)
.then(res => {
    console.log(res)
    app.listen(port, function(){
        console.log(`Server is Running in ${port}`)
    })

})
.catch(err => {
    console.log(err)
})