const Validator = require('validator');
const isEmpty = require('./isEmpty');

const validateRegisterInput = (data) =>{
    let errors = {};

    //check the mail field
    if(isEmpty(data.email)){
        errors.email = "Email fiels cannot be empty ";
    }else if(!Validator.isEmail(data.email)){
        errors.email = "Email is not valid, please provide a valid email"
    }

    //Check password field
    if(isEmpty(data.password)){
        errors.password = "Please field can not be empty"
    }else if(!Validator.isLength(data.password, {min: 6, max:150})){
        errors.password = "Password must be between 6 and 150 characters long"
    }

    //Check name field
    if(isEmpty(data.name)){
        errors.name = "Please field can not be empty"
    }else if(!Validator.isLength(data.name, {min: 4, max:150})){
        errors.name = "Name must be between 12 and 150 characters long"
    }


    //check confirm password field
    if(isEmpty(data.confirmPassword)){
        errors.confirmPassword = "confirm password can not empty"
    }else if(!Validator.equals(data.password, data.confirmPassword)){
        errors.confirmPassword = "Password and confirm password must match"
    }

    return{
        errors,
        isValid: isEmpty(errors),

    }
}


module.exports = validateRegisterInput;
