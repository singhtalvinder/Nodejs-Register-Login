const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');



// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// load user model.
const User = require('../../models/User');

// Create the Register endpoint.
// @route POST api/users/register
// @desc Register user
// @access Public

router.post('/register', (req, res) => {
    // Form Validations.

    const {errors, isValid } = validateRegisterInput(req.body);

    // Check Validation.
    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email})
    .then(user => { 
        if(user) {
            return res.status(400).json({email: "This Email already exists."});
        }
    const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
    });

    // Hash the passwod so that its not readable, before saving to db.
     bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) {
                    throw err;
                }
                newUser.password = hash;
                newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            });
        });
       // }
    });
});

//Create the Login endpoint.
//@route POST api/users/login
//@desc Login user and return JWT token
//@access Public
router.post('/login', (req, res) => {
    // Form validation.

    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation.
    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // find user by the email.
    User.findOne({email}).then(user =>{
        // check if already exists.
        if(!user) {
            return res.status(400).json({ emailnotfound: "Email not found."});
        }
        // check password.
        bcrypt.compare(password, user.password). then(isMatch => {
            if(isMatch) {
                // user matched, create the jwt payload
                const payload = {
                    id: user.id,
                    name: user.name
                };
                
                // sign the token.
                jwt.sign(
                    payload, 
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926  // = 1yr.
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    }
                );
            } else { // no match.
                return res.status(400).json({ passwordincorrect: 'Password is incorrect.' });
            }
        });
    });
});

module.exports = router;