const express = require("express");
const auth = require("../db/middleware/auth");
const Task = require("../db/models/Task");


const taskRouter = new express.Router();


//get All Tasks
taskRouter.get('/tasks', auth ,async (req,res)=>{

   //await Task.populate('owner')
   const match={};
   if(req.query.completed){
      match.completed = req.query.completed === 'true';
   }
   await req.user.populate({
      path:'tasks',
      match
   });
    try{
        const task = req.user.tasks//await Task.find({owner:req.user._id});
        if(!task){
         res.status(404).send(task);
        }else{
            res.send(task);
         }
        
    }catch(e){
    console.log('error ',e);
     res.status(500).send(e);
    };

 
 });
//get Task with id 
taskRouter.get('/tasks/:id', auth ,async (req,res)=>{

    const _id = req.params.id;
   
    try{
        const task = await Task.findOne({_id,owner:req.user._id});
        console.log(task);
        if(!task){
         res.status(404).send(task);
        }else{
            res.send(task);
         }
        
    }catch(e){
        console.log('error ',e)
     res.status(500).send(e);
    };

 
 });
 
 //get Task with id 
taskRouter.get('/tasks/:id', auth ,async (req,res)=>{

    const _id = req.params.id;
   
    try{
        const task = await Task.findOne({_id,owner:req.user._id});
        console.log(task);
        if(!task){
         res.status(404).send(task);
        }else{
            res.send(task);
         }
        
    }catch(e){
        console.log('error ',e)
     res.status(500).send(e);
    };

 
 });
 
 //save task end point
 taskRouter.post('/tasks', auth , async(req, res) => {
 
     const task = new Task({
        ...req.body,
        owner:req.user._id
     });
 
     
     try{
         const task1 = await task.save();
         res.status(200).send(task1);
     }catch(e){
        
        res.status(400).send(e);
     }
  
     });

module.exports = taskRouter;