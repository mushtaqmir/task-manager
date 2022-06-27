const express = require('express');
require('./db/mongoosdb');
const User = require('./db/models/User');
const Task = require('./db/models/Task');
const userRouter  = require('./routes/user');
const taskRouter  = require('./routes/task');

var app = express();

var port = process.env.PORT || 3000;

app.use(express.json());

app.use(userRouter);

app.use(taskRouter);

// const main = async ()=>{
// //    const task =  await Task.findById('6297a0868d1e56dc6d1fa560');
// //    console.log(task);
// //    await task.populate('owner');
// //     console.log(task.owner);

// const user =  await User.findById('6297a43f0595835c1c3f2b6a');
//    //console.log(task);
//    await user.populate('tasks');
//     console.log(user.tasks);
// };

// main();


app.listen(port,()=>{
    console.log("listening to port "+port);
});