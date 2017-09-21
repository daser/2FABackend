
_ = require("lodash");

exports.error_codes = {
    "ResourceNotExist": {code: 409, msg: "Requested resource does not exist"},
    "ResourceNotValid": {code: 409, msg: "Requested resource could not be validated"},
    "ResourceNotCreated": {code: 409, msg: "Requested resource could not be created"},
    "MissingFields": {code: 409, msg: "Please add the missing fields"},
    "UnknownError": {code: 409, msg: "There was an unknown error while processing the request"},
    "DuplicateResource": {code: 409, msg: "Requested resource already exists"},
    "ActionCancelled": {code: 409, msg: "Requested action has been cancelled because it is not applicable"},
    "BadRequest": {code: 400, msg: "Bad request, please contact us"},
    "MissingOrInvalid" : {code: 409, msg: "Invalid userid or missing userid"},
    "NoRecord" : {code: 409, msg: "No record found"},
    "TokenError" :{code:409, msg: "Invalid parameters to generate accessToken"}
};


exports.processError = (err) => {

    let error ={};
    if (err.name == "StatusCodeError") {
        error.code = err.statusCode;
        error.msg = err.error;
    }
    else if (err.code==11000)
    {
        error = this.error_codes.DuplicateResource;
    }
    else if (err.name == "MongoError")
    {
        error.code = 400;
        error.msg = err.message;
    }
    else if (err.name === "ValidationError") {
        error.code = 409;
        error.msg = _.map(err.errors, "message");
    }
    else if (err.name == "RequestError") {
        error.code = 500;
        error.msg = err.message;
    }
    else if (Object.keys(err).length === 1) {
        let field = Object.keys(err)[0];
        error.code = 409;
        error.msg = err[field].message;
    }
    else if (typeof err.code === 'string' && err.statusCode) {
        error.code= err.statusCode;
        error.msg=err.message;

    }
    else if (!err.code)
    {
        error = this.error_codes.UnknownError;
    }
    else
    {
        error = err;
    }

    return error;
};

exports.convertRestError= (err) =>
{
    let statusCode = err.statusCode,
        error = err.error;

    for (var name in this.error_codes)
    {
        if (this.error_codes.hasOwnProperty(name))
        {
            let message = this.error_codes[name];
            if (message.code== statusCode && error==message.msg)
            {
                err = message;
                break;
            }
        }
    }

    return err;
};
