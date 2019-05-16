const Validator = require('validator');
const isEmpty = require('is-empty');

// data is what is recevied from the front end app 
module.exports = function validateRegisterInput(data) {
    let errors = {};

    // convert empty fields to empty so that validator fns can be used.
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if(Validator.isEmpty(data.name)) {
        errors.name = "Name is required";        
    }

    if(Validator.isEmpty(data.email)) {
        errors.name = "Email is required";        
    } else if (!Validator.isEmail(data.email)) {
        errors.name = "Email is invalid. Please enter a valid email.";        
    }

    if(Validator.isEmpty(data.password)) {
        errors.name = "Password is required";        
    }

    if(Validator.isEmpty(data.password2)) {
        errors.name = "Confirm Password is required";        
    }

    if(!Validator.isLength(data.password, {min : 6, max : 30 })) {
        errors.password = "Passwords must be atleast 6 chars and less that 30."
    }

    if(!Validator.equals(data.password, data.password2)) {
        errors.name = "Passwords must match";        
    }


    return { 
        errors,
        isValid: isEmpty(errors)
        };
};
