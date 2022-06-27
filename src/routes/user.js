const express = require("express");
const User = require("../db/models/User");
const auth = require("../db/middleware/auth");


const userRouter = new express.Router();
const multer  = require('multer');
//const sharp = require('sharp');

const upload = multer({ 
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png)$/)){
            cb(new Error('Please upload image'))
        }
        cb(null, true);
    } })
 //upload image  
 userRouter.post('/users/me/avatar',auth, upload.single('avatar') , async(req,res)=>{
//await sharp(req.file.buffer).resize(240, 240).jpeg().toBuffer();
    req.user.avatar = req.file.buffer;
    await req.user.save();
        res.send();   
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
});

//upload image  
userRouter.delete('/users/me/avatar',auth, upload.single('avatar') , async(req,res)=>{
    req.user.avatar = undefined;
    await req.user.save();
        res.send();   
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
});
    //get users profile 
    userRouter.get('/users/me', auth , async(req,res)=>{

        try{
            res.send({user:req.user,token:req.token});
        }catch(e){
            console.log("Error ",e);
            res.status(500).send(e);
        }
    
    });
//delete user
userRouter.delete('/users/me', auth , async(req, res) => {

     try{
        const user = req.user.remove();
   
    res.status(200).send(user);
    }catch(e){
        console.log(e);
        res.status(400).send(e)
    }
    
    });

//update user
userRouter.patch('/users/me', auth , async(req, res) => {

    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const updatedAllowed = ["name","age","password","email"];
    const isValidUpdate = updates.every(update => updatedAllowed.includes(update));

    //const user = new User(req.body);
    try{
        if(!isValidUpdate){
            res.status(400).send({"error":"invalid fields"})
        }
       const user = req.user;//await User.findById(_id);
       if(user){
        updates.forEach((update)=>{
            user[update] = req.body[update];
        });
       }
       await user.save();
    res.status(201).send({user,token:req.token});
    }catch(e){
        console.log(e);
        res.status(400).send(e)
    }
    
    });

//get users end point 
userRouter.get('/users', auth , async(req,res)=>{

    try{
        const user = await User.find({});
        res.send(user);
    }catch(e){
        res.status(500).send(e);
    }

});

//get user with id 
userRouter.get('/users/:id', auth ,async(req,res)=>{

   const _id = req.params.id;

   try{
    const user = await User.findById(_id);
    if(!user){
        res.status(404).send(user);
    }else{
        res.send(user);
    }
    
    }catch(e){
        res.status(500).send(e);
    }

});

//save user end point
userRouter.post('/users', async(req, res) => {

const user = new User(req.body);
try{
const user1 = await user.save();
const token =  await user1.generateAuthToken();
res.status(201).send({user1,token});
}catch(e){
    console.log(e);
    res.status(400).send(e)
}

});

//user login 
userRouter.post('/users/login', async(req, res) => {

   // const user = new User(req.body);
    try{
    const user1 = await User.findByCred(req.body.email, req.body.password);
    console.log('Login user ',user1);
    const token =  await user1.generateAuthToken();
    res.send({user1,token});
    }catch(e){
        console.log(e);
        res.status(400).send({'error ':'Invalid Credentails'})
    }
    
    });



//logout 
userRouter.post('/users/logout', auth , async(req,res)=>{

    try{
        const user = req.user;
        user.tokens = user.tokens.filter(token => token.token != req.token);
        console.log(user);
        const user1 = await user.save(user);
        res.send(user1);
    }catch(e){
        res.status(500).send(e);
    }

});

//logout all
userRouter.post('/users/logoutAll', auth , async(req,res)=>{

    try{
        const user = req.user;
        user.tokens = [];
        console.log(user);
        const user1 = await user.save(user);
        res.send(user1);
    }catch(e){
        res.status(500).send(e);
    }

});

module.exports = userRouter;