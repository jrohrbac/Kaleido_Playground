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
const Image = require("../../models/Image");

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
                role: req.body.role,
                images: []
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
                    role: user.role,
                    images: user.images
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
    console.log("req.body.pictures: " + req.body.pictures);
    // Todo: try to figure out how to update the user object

    // Find user by id
    // User.findOneAndUpdate({ _id: req.body.id }, { pictures: req.body.pictures }, {new: true}, (err, doc) => {
    //     if (err) {
    //         console.log("Something went wrong while updating.");
    //     }
    //     console.log('doc is:' + doc);
    //     console.log("req.body", req.body);
    // });
    console.log();
    const newImage = new Image({
        owner: req.body.id,
        image: req.body.image,
        name: req.body.name
    });

    newImage
        .save()
        .then(result => {
            // Todo: figure out the user id
            // fix syntax here
            User.findOne({_id: req.body.id}, (err, user) => {
                console.log('testing saving image to user');
                console.log('req.body.id' + req.body.id);
                if (err) console.log(err);
                console.log('user ' + user);
                if (user) {
                    console.log('testing saving image to user, !!!!!!!');
                    console.log('saving image to user');
                    user.images.push(newImage);
                    user.save();
                    res.json({message: "Image Created!!!"});
                }
            });
        })
        .catch(err => console.log(err));
});

router.post("/getImages", (req, res) => {
    // try to see this console log, it does not have an email property in this object
    console.log("req.body", req.body);
    console.log("testing here" + req.body.userId);

    // User.find({_id: req.body.userId}, {pictures}, (err, doc) => {
    // User.findOne({_id: req.body.id}, (err, doc) => {
    //     if (err) {
    //         console.log("Something went wrong while getting images");
    //     }

    //     console.timeLog("doc is: " + doc);
    //     res.send(doc.pictures);
    // })

    User.findOne({_id: req.body.id}).populate("images").then((data) => {
        console.log('images ' + data.images);
        res.send(data.images);
    }).catch((err) => {
        console.log(err);
    });
});

module.exports = router;
