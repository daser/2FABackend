'use strict';
//=============================================================================
/**
 * Module dependencies
 */
//=============================================================================
const UserOtp = require('../userotp'),
     error_codes = require('../../libs/errorMessages').error_codes,
     log = require('../../helpers/logger').getLogger('UserUtils'),
      Id = require('../../libs/ValidObjectid'),
     _ = require("lodash"),
     Promise = require("bluebird"),
     speakeasy = require('speakeasy');

//=============================================================================
/**
 * module functionality
 */
//=============================================================================

exports.createUserOtp = (UserID) => {
     if (!UserID || !Id.isValid(UserID)) {
        return Promise.reject(error_codes.MissingOrInvalid);
     }
     return this.getUserSecret(UserID)
            .then(result => {
                if(!_.isEmpty(result)){
                    return Promise.reject(error_codes.DuplicateResource);
                }
                // var verified = speakeasy.totp.verify({ secret: result.tfatoken,encoding: 'base32', token: UserInfo.token });
                // return verified;
                var secretKey = this.generateSecretKey();
                var properties= {
                    "userid": UserID,
                    "otpkey" : secretKey.base32,
                    "otpauth_url":secretKey.otpauth_url
                };
                const newUserOtp = new UserOtp(properties);
                return newUserOtp.save();
            })
            .catch(err => {
                return res.status(error.code).json(error.msg);
            });    

};


exports.getUserSecret = (UserID)=>{
     if (!Id.isValid(UserID)) {
        return Promise.reject(error_codes.MissingOrInvalid);
     }
     return UserOtp.find({"userid":UserID})
        .exec()
        .then(result => {
            // if (!_.isEmpty(result)) {
                console.log("secret " + result);
                return result;
        })
        .catch(err => {
            return Promise.reject(error_codes.ResourceNotExist);
        });
};


exports.generateSecretKey = () => {
    return speakeasy.generateSecret();
};


exports.verifyOtp = (UserInfo) => {
    console.log(JSON.stringify(UserInfo));
    return this.getUserSecret(UserInfo.uid)
            .then(result => {
                var verified = speakeasy.totp.verify({ secret: result.tfakey,encoding: 'base32', token: UserInfo.token});
                return verified;
            })
            .catch(err => {
                return res.status(error.code).json(error.msg);
            });   
};


exports.disableOtp = (UserID) =>{
    if (!UserID || !Id.isValid(UserID)) {
        return Promise.reject(error_codes.MissingOrInvalid);
    }
    return UserOtp.remove({"userid":UserID})
        .then(result => {
            result = JSON.parse(result);
            if (result.n == 0) {
                console.log("Error cannot find any resource in the db");
                return Promise.reject(error_codes.ResourceNotExist);
            }
            else if (result.n > 0) {
                return result;
            }
            else if (result.ok !== 1) {
                console.log("Error cannot delete the value or object described by the input");
                return Promise.reject(error_codes.BadRequest);
            }
            else {
                console.log("Error cannot delete the resource " + JSON.stringify(result));
                return Promise.reject(error_codes.UnknownError)
            }
        });

};


exports.generateTotp= (UserID) =>{
     if (!UserID || !Id.isValid(UserID)) {
        return Promise.reject(error_codes.MissingOrInvalid);
     }
     return this.getUserSecret(UserID)
            .then(result => {
                if(!_.isEmpty(result)){
                   // return Promise.reject(error_codes.DuplicateResource);
                    var token = speakeasy.totp({secret: result.otpkey, encoding: 'base32'});
                    return token;
                }else{
                    return Promise.reject(error_codes.ResourceNotExist);
                }
            })
            .catch(err => {
                return res.status(error.code).json(error.msg); // you need to look at this really...use promise reject
            });    


};

