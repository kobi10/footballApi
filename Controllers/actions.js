const { response } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const match = require('nodemon/lib/monitor/match');
const Match = require('../Models/match');
const User = require('../Models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/createMatch', (req,res)=>{

    const id = mongoose.Types.ObjectId();
    const homeTeamName = req.body.homeTeamName;
    const awayTeamName = req.body.awayTeamName;
    const homeScore = req.body.homeScore;
    const awayScore = req.body.awayScore;
    const stadium = req.body.stadium;
    const homeWin = req.body.homeWin;
    
    const _match = new Match({
        _id: id,
        homeTeamName: homeTeamName,
        awayTeamName: awayTeamName,
        homeScore: homeScore,
        awayScore: awayScore,
        stadium: stadium,
        matchDate: Date.now(),
        homeWin: homeWin,
    })

    return _match.save()
    .then(results => {
        return res.status(200).json({
            message: results
        });
    })
    .catch(error => {
        return res.status(500).json({
            message: error
    })
})

})

router.get('/getMatches', async(req,res) => {

    Match.find()
    .then(results => {
        return res.status(200).json({
            message: results
        })
    })
    .catch(err => {
        return res.status(500).json({
            message: err
        })
    })

})

router.put('/updateMatch/:matchID', async(req,res) => {
    const matchId = req.params.matchID;
    // Match.findOne({homeTeamName:'Juventus'})
    Match.findById(matchId)
    .then(match => {
        if(match){
            const {homeTeamName, awayTeamName, homeScore, awayScore, stadium, homeWin} = req.body;
            match.homeTeamName = homeTeamName;
            match.awayTeamName = awayTeamName;
            match.homeScore = homeScore;
            match.awayScore = awayScore;
            match.stadium = stadium;
            match.homeWin = homeWin;
        
        return match.save()
        .then(match_updated => {
            return res.status(200).json({
                message:match_updated
            })
        })
    } else{
        return res.status(404).json({
            message: 'This game is not exist'
        })
    }
})
    .catch(err => {
        return res.status(500).json({
            message: err
        })
    })
});

router.delete('/removeMatch/:id', async(req,res) => {
    const matchId = req.params.id;
    Match.findByIdAndDelete(matchId)
    .then(results => {
        return res.status(200).json({
            message: results
        })
    })
    .catch(err => {
        return res.status(500).json({
            message: err
        })
    })
});

router.post('/createUser', (req,res) => {
    const id = mongoose.Types.ObjectId();
    const {firstName,lastName,age,email,password} = req.body;
    //
    User.findOne({email:email })
    .then(async account => {
        if(account){
            return res.status(500).json({
                message: 'User Exist'
            })

        } else {
            const hash = await bcryptjs.hash(password,10);
            const code = generateCode(100000,999999);
            const user = new User({
                _id: id,
                firstName: firstName,
                lastName: lastName,
                age: age,
                email: email,
                password: hash,
                passcode: code
            })
            return user.save()
            .then(account_created => {
                return res.status(200).json({
                    message: account_created
                })
            })
        }       
    })
    .catch(err => {
        return res.status(500).json({
            message: err
        })
    })
});

router.post('/verifyAccount', async(req,res) => {
    const {email, passcode} = req.body;
    User.findOne({email:email })
    .then(async account => {
        if(account){
            if(parseInt(account.passcode) === parseInt(passcode)){
                account.isApproved = true;
                return account.save()
                .then(account_updated => {
                    return res.status(200).json({
                        message: account_updated
                    })
                })
            } else {
                return res.status(200).json({
                    message: 'Passcode not match'
                })
            }
        } else {
            return res.status(200).json({
                message: 'User Not Found'
            })
        }
    })
    .catch(err => {
        return res.status(500).json({
            message: err
        })
    })
})

router.post('/login', async (req,res) => {
    const {email, password} = req.body;
    //Check if user exists
    User.findOne({email : email})
    .then(async account => {
        if(account){
            //Check if account is approved
            if(account.isApproved) {
                //Check if password is ok
                const isMatch = await bcryptjs.compare(password, account.password);
                if(isMatch) {
                    //Generate token
                    const data = {
                        account_name: account.firstName + ' ' + account.lastName,
                        email: account.email,
                        id: account._id
                    }
                    const token = await jwt.sign(data, 'Hbz4vGGGxe0bFk1eae3rn7GbOHS9t2c2')
                    return res.status(200).json({
                        message : token
                    })
                } else {
                    return res.status(200).json({
                        message : 'Wrong password'
                    })
                }
            } else {
                return res.status(200).json({
                    message : 'Account not approved'
                })
            }
        } else {
            return res.status(200).json({
                message : 'User not found'
            })
        }
    })
    .catch(error => {
        return res.status(500).json({
            message: error
        });
    })
});



function generateCode(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports = router;