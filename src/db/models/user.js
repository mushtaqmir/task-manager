const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./Task');

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required:true,
    trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate: (value) =>{
        if(!validate.isEmail(value))
            throw new Error('Invalid Email');
        }
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minLength:6,
        validate:(value)=>{
            // if(validate.isLength(value,{min:8,max:100})){
            //     throw new Error('Password too short');
            // }
            if(validate.contains(value,'password',{ ignoreCase: true, minOccurrences: 1 })){
                throw new Error('Password cannot contain password');
            }
        }
    },
    age: {
    type: Number,
    default:0,
    min: 0,
    max: 100
    }, 
    tokens:[{
        token:{
        type:String,
        required:true
    }}],
    avatar: {
        type:'Buffer'
    }
    }, 
    {
        timestamps:true
    });
    userSchema.statics.findByCred = async function(email,password){

        const user = await User.findOne({email});
        console.log('user ',user);
        if(!user){
            throw new Error('Invalid Credentails');
        }
        
       const isvalid =  await bcrypt.compare(password,user.password);
       console.log('isvalid password ',isvalid);
        if(!isvalid){
            throw new Error('Invalid Credentails');
        }
        return user;
    };
    //instance methods
    userSchema.methods.generateAuthToken = async function(){
        const user = this;
        const token = jwt.sign({ _id: user._id.toString() }, 'qwerty');
        user.tokens = user.tokens.concat({token});
        await user.save();
        return token;
    };

    //instance methods
    userSchema.methods.toJSON = function(){
        const user = this;
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.tokens;
        return userObj;
    };

    userSchema.virtual('tasks', {
        ref: 'Task',
        localField: '_id',
        foreignField: 'owner'
        });

userSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified('password')){
        const hashedPassword = await bcrypt.hash(user.password, 8)
        user.password = hashedPassword;
    }
    
    next();
});
//delete tasks when user is deleted
userSchema.pre('remove',async function(next){
    const user = this;
    const owner = user._id;
    await Task.deleteMany({owner});
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;