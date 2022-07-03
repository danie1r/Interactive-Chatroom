const router = require('express').Router();
const User = require("../models/User");


//creating user
router.post('/',async(req, res)=>{
    try{
        const {name, password} = req.body;
        console.log(req.body);
        const user = await User.create({name,password});
        res.status(201).json(user);

    }catch(e){
        let msg;
        if(e.code == 11000){
            msg = "User already exists"
        } else{
            msg = e.message;
        }
        res.status(400).json(msg)
    }
})

//login user
router.post('/login', async(req,res)=>{
    try{
        const {name, password} = req.body;
        const user = await User.findByCredentials(name,password);
        user.status = 'online';
        await user.save();
        res.status(200).json(user);
    }catch(e){
        res.status(400).json(e.message);
    }
})

module.exports = router