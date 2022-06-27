
const {MongoClient,ObjectId} = require('mongodb');
//const MongoClient = mongodb.MongoClient;

const id = new ObjectId();
console.log(id);
const connectionURL = 'mongodb://127.0.0.1:27017'
const dbname = 'task-manager';

MongoClient.connect(connectionURL,{useNewUrlParser: true},(error,client) =>{

    if(error){
        console.log(error);
        return console.log('unable to connect');
    }

    const db = client.db(dbname);

    db.collection('users').deleteMany({age:27}).then((result) =>{
        console.log("success "+result);
    }).catch((error) =>{
        console.log("error "+error);
    });
    // db.collection('tasks').updateMany({completed:false},{
    //     $set:{
    //         completed:true
    //     }
    // }).then((result) =>{
    //     console.log("success "+result);
    // }).catch((error) =>{
    //     console.log("error "+error);
    // });
    // db.collection('Users').findOne({age:27}, (error,result)=>{
    //     console.log(result);
    // });
    // const cursor = db.collection('tasks').find({completed:true});
    // cursor.forEach(console.dir);
    // db.collection('users').insertOne({
    //     name: 'Fil',
    //     age: 28
    //     });

    // 
    // db.collection('tasks').insertMany([
    //     {
    //     description: 'Clean the house',
    //     completed: true
    //     },{
    //     description: 'Renew inspection',
    //     completed: false
    //     }
    //     ], (error, result) => {
    //     if (error) {
    //     return console.log('Unable to insert tasks!')
    //     }
    //     console.log(result.ops)
    //     })
});