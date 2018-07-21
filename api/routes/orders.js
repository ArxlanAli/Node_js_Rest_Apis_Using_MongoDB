const express = require('express')
const mongoose = require('mongoose')
const Order = require('../models/orders')
const Product = require('../models/products')

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
    Product.findById(req.body.productId).then(product=>{
        if(!product){
            return res.status(404).json({
                message:"Product for this order is not found"
            })
        }
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
    }).catch(err=>{
        res.json({
            error:err
        })
    })
})

router.get('/:orderId',(req,res,err)=>{
    Order.findById(req.params.orderId).exec().then(order=>{
        if(!order){
            return res.status(404).json({
                message:"Order is not found"
            })
        }
        res.status(200).json({
            order:order
        })
    }).catch(error=>{
        res.status(500).json({
            error:error
        })
    })
})

router.delete('/:orderId',(req,res,err)=>{
    const orderId = req.params.orderId
    Order.remove({_id : orderId}).exec().then(result=>{
        res.status(200).json({
            message:"order deleted"
        })
    }).catch(error=>{
        res.status(500).json({
            error:error
        })
    })


})


module.exports = router;