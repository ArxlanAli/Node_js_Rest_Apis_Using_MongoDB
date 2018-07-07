const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Product = require('../models/products')

router.get('/',(req,res,err)=>{
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs=>{
        res.json({
            count:docs.length,
            "products":docs
        })
    })
    .catch(err=>{
        res.json({
            "message":"Something error"
        })
    })
})

router.post('/',(req,res,err)=>{

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    product.save().then(result=>{
        console.log(result)
        return res.status(201).json({
            product:product
        })
    })

    .catch(err=>{
        return res.status(500).json({
            error:err
        })
    })
    
})

router.get('/:productId',(req,res,err)=>{
    const id = req.params.productId
    Product.findById(id).exec().then(doc=>{
        if(doc){
            res.status(200).json({
                product:doc
            })
        }else{
            res.status(404).json({
                "message":"Not valid id"
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})


router.delete('/',(req,res,err)=>{
    Product.remove().exec()
    .then(docs=>{
        res.json({
            "message":"All deleted"
        })
    })
    .catch(err=>{
        res.json({
            "message":"Something error"
        })
    })
})


module.exports = router;