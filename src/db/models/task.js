const mongoose = require('mongoose');
const validate = require('validator');
const User = require('./User');

const taskSchema =new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
});
const Task = mongoose.model('Task',taskSchema);

module.exports = Task;