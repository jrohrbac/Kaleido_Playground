const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load Patient model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        }
        else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    console.log('email :' + email);
    console.log('email :' +  req.body.email);

    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found"});
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    role: user.role
                };

                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            }
            else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

// @route POST api/users/uploadImage
// @desc Upload patient image
// @access Patient Only
router.post("/uploadImage", (req, res) => {
    // try to see this console log, it does not have an email property in this object
    console.log("req.body", req.body);
    console.log("req.body.name: " +  req.body.name);

    // Todo: try to figure out how to update the the user object 

    // Todo: req.body.email is not in the user object, that's why it's null
    // If you want to find user by email, you need to add the email to the user object
    // so this req.body can get the email
    const email = req.body.email;
    //const image = req.body.formData;
    // Find user by email
    // User.findOneAndUpdate({ email: email }, { name: "Testing123321" }, {new: true}, (err, doc) => {
    //     if (err) {
    //         console.log("Something went wrong while updating.");
    //     }
    //     console.log('doc is:' + doc);
    // });

    // Find user by id 
    User.findOneAndUpdate({ _id: req.body.id }, { name: "newNameHungTesting" }, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something went wrong while updating.");
        }
        console.log('doc is:' + doc);
    });
});

module.exports = router;
