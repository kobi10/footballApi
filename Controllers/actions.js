const { response } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const match = require('nodemon/lib/monitor/match');
const Match = require('../Models/match');
const User = require('../Models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./auth');

//create match
router.post('/createMatch',auth ,(req,res)=>{

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
        pubId: req.user._id,
        pubName: req.user.firstName + " " + req.user.lastName
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

});
// get All match
router.get('/getMatches',auth , async(req,res) => {
    Match.find().populate('pubId')
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
//update single match
router.put('/updateMatch/:matchID',auth, async(req,res) => {
    const matchId = req.params.matchID;
    // Match.findOne({homeTeamName:'Juventus'})
    Match.findOne({_id: matchId, pubId: req.user._id})
    .then(match => {
        if(match){
            const {homeTeamName, awayTeamName, homeScore, awayScore, stadium, homeWin} = req.body;
            match.homeTeamName = homeTeamName;
            match.awayTeamName = awayTeamName;
            match.homeScore = homeScore;
            match.awayScore = awayScore;
            match.stadium = stadium;
            match.homeWin = homeWin;
            match.pubId = req.user._id
        
        return match.save()
        .then(match_updated => {
            return res.status(200).json({
                message:match_updated
            })
        })
    } else{
        return res.status(200).json({
            message: 'This game is not exist or Forbidden'
        })
    }
})
    .catch(err => {
        return res.status(500).json({
            message: err
        })
    })
});
//delete single match
router.delete('/removeMatch/:id',auth, async(req,res) => {
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



//Accounts
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

//passward_recover
//verify
//update_passward
//במידה והיוזר שכח את הסיסמא צריך לעדכן את הסיסמא של היוזר

router.post('/recoverPassword', async (req,res) => {
    const {email} = req.body;
    User.findOne({email: email})
    .then(async account => {
        if(account){
            const code = generateCode(100000,999999);
            account.passcode = code;
            return account.save()
            .then(newpasscode => {
                return res.status(200).json({
                    message: newpasscode
                })
            })
        } else {
            return res.status(200).json({
                message : 'User not Found'
            })
        }
    })
    .catch(err => {
        return res.status(500).json({
            message: err
        })
    })
});

router.post('/updatePassword', async(req,res) => {
    const {email , password} = req.body;
    User.findOne({email:email})
    .then(async account => {
        if(account){
            const hash = await bcryptjs.hash(password,10);
            account.password = hash;
            return account.save()
            .then((newpass) => {
                return res.status(200).json({
                    message: newpass
                })
            })
        } else {
            return res.status(200).json({
                message:'User not Found'
            })
        }
    })
    .catch(err => {
        return res.status(500).json({
            message: err
        })
    })

});


router.post('/getTeamMatchs',auth , async(req,res) => {
    const searchTeam = req.body.searchTeam;
    Match.find({$or:[{'homeTeamName':searchTeam},{'awayTeamName': searchTeam}]}).populate('pubId')
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



function generateCode(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
module.exports = router;