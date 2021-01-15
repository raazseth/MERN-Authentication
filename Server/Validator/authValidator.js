const { check, validationResult } = require("express-validator");

//Validating signup request through Apis array

exports.validateRequest =[
    check("name")
    .notEmpty()
    .withMessage("Name is required"),

    check("email")
    .isEmail()
    .withMessage("Email is required"),

    check("address")
    .notEmpty()
    .withMessage("Address is required"),

    check("state")
    .notEmpty()
    .withMessage("State is required"),

    check("city")
    .notEmpty()
    .withMessage("City is required"),

    check("contactnumber")
    .isLength({min:10})
    .withMessage("contact Number is required"),

    check("password")
    .isLength({min:6})   
     .withMessage("Password must be aleast 6 character long"),

];

//Sending msg to vaildate errors

exports.isRequestValidate = (req,res,next)=>{
    const errors = validationResult(req);
    if(errors.array().length>0){
        return res.status(400).json({error : errors.array()[0].msg})
    }
    next();
}

//Validating signin request through Apis array--second validation

exports.validateSignRequest =[
    check("email")
    .isEmail()
    .withMessage("Email is required"),

    check("password")
    .isLength({min:6})   
     .withMessage("Password must be aleast 6 character long"),

];

//Sending msg to vaildate errors

exports.isRequestSignValidate = (req,res,next)=>{
    const errors = validationResult(req);
    if(errors.array().length>0){
        return res.status(400).json({error : errors.array()[0].msg})
    }
    next();
}
