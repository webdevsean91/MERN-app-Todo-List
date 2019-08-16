const express = require("express")
        ,router = express.Router()
        ,bcrypt = require("bcryptjs")
        ,jwt = require("jsonwebtoken")
        ,keys = require("../../config/keys")
        ,UserSession = require('../../models/UserSession');

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/To_Do_User");

// DEBUG - Simple get
/* router.get("/", (req, res) => {
    res.send("got to to_do_users.js")
}) */

// @route POST /api/auth/login
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

    //Debug
    //console.log(`email: '${email}'`)
    //console.log(`password: '${password}'`)

    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    user_id: user._id,
                    name: user.name
                };
                // Sign token and add some user details
                jwt.sign(
                    payload,
                    keys.session.cookieKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        //Debug
                        //console.log(`user_id: payload.user_id: '${payload.user_id}'`)

                        res.json({
                            success: true,
                            token: `Bearer ${token}`,
                            name:   payload.name,
                            user_id: payload.user_id
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

// @route POST api/auth/register
// @desc Register user
// @access Public
router.route("/register").post((req, res) => {
    //Debug
    //console.log("******** Server Debug in routes/api/to_do_users.js: *********")
    //console.log(req)
    //console.log(req.body)

    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    console.log(errors)
    // Check validation
    if (!isValid) {
        //Debug
        //console.log("****** Server Error in routes/api/to_do_users.js: ******")
        //console.log(errors)
        return res.status(400).json(errors);
        //res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        // don't allow the user to register if they already have
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        }
        else 
        // try to register them
        {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
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

// @route GET /api/auth/users/
// @desc Get a list of users - used for isAdminUser on front end
// @access Public
router.get("/users", (req, res) => {
    //DEBUG
    //console.log(`got to 'router.get("/users"' - "${req.params.id}"`)

    // get all users
    return User.find(
        (err, list) => {
            if (err) return console.error(err)
            res.send(list)
        }
    )
})

// @route GET /api/auth/users/:id
// @desc Get a user by id - used for switching when isAdminUser
// @access Public
router.get("/:id", (req, res) => {
    //DEBUG
    //console.log(`got to 'router.get("/:id"' - "${req.params.id}"`)
    
    // find user info
    return User.findById(req.params.id, '-password',
        (err, list) => {
            if (err) return console.error(err)
            res.send(list)
        }
    )
})

module.exports = router;