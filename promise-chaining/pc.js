require('../src/db/mongoosdb');
const Task = require('../src/db/models/Task');

//
// Task.findByIdAndRemove('6290cc5e6297e47ebe9d76b6').then((result)=>{
//     console.log(result);

//     return Task.where({ 'completed': 'true' }).countDocuments();

// }).then((count)=>{
// console.log("completed "+count);
// }).catch((error)=>{
//     console.log(error);
// });

findTaskandcount = async(id) => {
const task = await Task.findByIdAndRemove(id);
const count = await Task.where({ 'completed': 'false' }).countDocuments();

return count;
};

findTaskandcount('6290d0906297e47ebe9d76ba').then((count)=>{
    console.log("incomplete tasks ",count);
}).catch((e)=>{
    console.log("error ",e);
});
