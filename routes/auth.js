const express = require('express')
const router = express.Router();
const User = require ('../Models/User')
const bcrypt = require ('bcryptjs')
const validateRegisterInput = require('../validation/registerValidation')


//@route GET /api/auth/test
//@desc Test the auth route
//@access Public
router.get("/test", (req, res)=>{
    res.send("Auth route working")
})

//@route POST /api/auth/register
//@desc Create new user
//@access Public

router.post("/register", async(req, res)=>{

    try {

        const { errors, isValid} = validateRegisterInput(req.body);

        if(!isValid){
            return res.status(400).json(errors)
        }


        //check for existing user
        const existingEmail = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i")
        })
        if(existingEmail){
            return res.status(400).json({error: "There is already a user with this email"});
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 12)


        //create new user
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,

            name: req.body.name
        });
        //save to database
        const savedUser = await newUser.save();

        //return new user 
        return res.json(savedUser)

    } catch (error) {
        //error
        console.log(error)
        res.status(500).send(error.message)
    }
})

module.exports = router