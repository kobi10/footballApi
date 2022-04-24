const jwt = require('jsonwebtoken');
const User = require('../Models/user');

module.exports = (req,res,next) => {
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader){
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        jwt.verify(token, 'Hbz4vGGGxe0bFk1eae3rn7GbOHS9t2c2', (err,data)=>{
            if(err){
                return res.sendStatus(403);
            } else {
                User.findById(data.id)
                .then(account => {
                    if(account){
                        req.user = account;
                        next();
                    } else {
                        return res.sendStatus(403);
                    }
                })
            }
        })
    } 
    else{
        return res.sendStatus(403);
    }
    //console.log(bearerHeader);
}