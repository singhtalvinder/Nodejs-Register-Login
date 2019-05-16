const Validator = require('validator')
const isEmpty = require('is-empty')

module.exports = function validateRegisteriInput(data) {
    let errors = {};

    // convert the empty fields to an empty string so we can 
    // use Validator fns.
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    // Check email.
    if(Validator.isEmpty(data.email)) {
        errors.email = "Email is required.";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid. Please enter a valid email.";
    }

    // Check Password.
    if(Validator.isEmpty(data.password)) {
        errors.password = "Password is required.";
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    };
};