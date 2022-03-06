const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Match = require('../Models/match');


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



router.get('/sayHello', (req,res)=>{
    return res.status(200).json({
        resStatus: true,
        message: 'Hello From NodeJs Server..',
    });
});

module.exports = router;