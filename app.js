const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const productRoutes = require('./api/routes/products.js')
const ordersRoutes = require('./api/routes/orders.js')



mongoose.connect('mongodb://ArslanAli:tnv23TgB3IiSReU7@cluster0-shard-00-00-qmvpn.mongodb.net:27017,cluster0-shard-00-01-qmvpn.mongodb.net:27017,cluster0-shard-00-02-qmvpn.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',{
    useMongoClient: true
})

mongoose.Promise = global.Promise

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected');
})

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
  console.log()
})

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
})

//tnv23TgB3IiSReU7
app.use('/products',productRoutes)
app.use('/orders',ordersRoutes)


app.use((req,res,next)=>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error,req,res,next)=>{
    //res.status(error.status || 500)
    res.json({
        "errorMessage":error.message
    })
})
module.exports = app