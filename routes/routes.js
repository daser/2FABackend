const
    express = require('express'),
    tfUser = require('../models/utils/tfauserUtils'),
    errorMessages = require('../libs/errormessages');

//=============================================================================
/**
 * Router instance
 */
//=============================================================================
const router = express.Router();
//=============================================================================
/**
 * API Routes
 */
//=============================================================================
router.post('/verifyOtp', (req, res) => {

    if(!req.body.uid) {
        return res.status(409).json({error: "Please provide user id"});
    }else if(!req.body.token){
        return res.status(409).json({error: "Please provide user token."});
    }else{
         var data = {
                        "uid": req.body.uid,
                        "token" : req.body.token
         };
        return tfUser.verifyOtp(data)
                .then(doc => {
                    return res.status(200).json(doc);
                })
                .catch(err => {
                    let error = errorMessages.processError(err);
                    return res.status(error.code).json(error.msg);
                });
                    
    }
});


router.post( '/enableOtp' ,(req, res)=>{
    if(!req.body.uid){
        return res.status(409).json({error: "Please provide user id"});
    }else{
        return tfUser.createUserOtp(req.body.uid)
                .then(doc => {
                    return res.status(200).json(doc);
                }).catch(err =>{
                    let error = errorMessages.processError(err);
                    return res.status(error.code).json(error.msg);
                });
    }
});



router.post('/getTotp', (req, res) =>{
     if(!req.body.uid){
        return res.status(409).json({error: "Please provide user id"});
    }else{
        return tfUser.generateTotp(req.body.uid)
                .then(doc => {
                    return res.status(200).json(doc);
                }).catch(err =>{
                    let error = errorMessages.processError(err);
                    return res.status(error.code).json(error.msg);
                });
    }
});


router.delete('/disableTotp', (req, res) =>{
     if(!req.body.uid){
        return res.status(409).json({error: "Please provide user id"});
    }else{
        return tfUser.disableOtp(req.body.uid)
                .then(doc => {
                    return res.status(200).json(doc);
                }).catch(err =>{
                    let error = errorMessages.processError(err);
                    return res.status(error.code).json(error.msg);
                });
    }
});

//=============================================================================
/**
 * Export Router
 */
//=============================================================================
module.exports = router;
//=============================================================================
