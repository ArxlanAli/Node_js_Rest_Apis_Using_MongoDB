const express = require('express')
const mongoose = require('mongoose')
const Order = require('../models/orders')

const router = express.Router()

router.get('/',(req,res,err)=>{
    Order.find()
    .select('product quantity _id')
    .then(result=>{
        res.json({
            count:result.length,
            orders:result.map(order=>{
                return{
                    _id:order._id,
                    quantity:order.quantity,
                    product:order.product,
                    request:{
                        type:"GET",
                        url:"https://loclhost:3000/orders/" + order._id
                    }
                }
            })
        })
    })
})

router.post('/',(req,res,err)=>{
    const order = new Order({
        _id:mongoose.Types.ObjectId(),
        quantity:req.body.quantity,
        product:req.body.productId
    })
    order
    .save()
    .then(result=>{
        console.log(result)
        res.json({
            order:result
        })
    })
    .catch(err=>{
        res.json({
            error:err
        })
    })
})

router.get('/:orderId',(req,res,err)=>{
    const id = req.params.orderId
    res.status(200).json({
        message:id
    })
})




module.exports = router;