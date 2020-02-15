//CRUD - Create, Read, Update and Delete

const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error){
        return console.log('Unable to connect to database')
    }

    const db = client.db(databaseName)

    // db.collection('users').insertOne({
    //     name: 'Ayodeji',
    //     age: '22'
    // }, (error, result) => {
    //     if (error){
    //         return console.log('Unable to insert user')
    //     }
    //     console.log(result.ops)
    // })


    // db.collection('users').insertMany(
    //     [{
    //         name: 'John',
    //         age: 22
    //     },
    //     {
    //         name: 'Abraham',
    //         age: 19
    //     }], undefined, (error, result) => {
    //         if (error){
    //             return console.log('Documents not inserted!')
    //         }
    //         console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Do your shit',
    //         completed: true
    //     },
    //     {
    //         description: 'Wash the plates!',
    //         completed: false
    //     },
    //     {
    //         description: 'Read your books',
    //         completed: true
    //     }
    // ], undefined, (error, results) => {
    //     if (error){
    //         return console.log('Unable to insert tasks')
    //     }
    //     return console.log(results.ops)
    // })

    // db.collection('tasks').findOne({ _id: new ObjectID("5e3586e1dea4004b14282eba")}, (error, task) => {
    //     if (error){
    //         return console.log('Unable to fetch')
    //     }

    //     //console.log(task)
    // })

    // db.collection('tasks').find({ completed: true }).toArray((error, tasks) => {

    //     if (error){
    //         return console.log("Cannot fetch data!")
    //     }
    //     console.log(tasks)
    // })

    // db.collection('users').updateOne({
    //     _id: new ObjectID("5e35840469d92f4d48cc9233")
    // }, {
    //     $inc: {
    //         age: 2
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('tasks').deleteMany({
        description: 'Read your books'
    }, undefined).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
})