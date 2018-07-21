const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        cb(null,Date.now() + file.originalname)
    }
})
const fileFilter = (req,file,cb)=>{
    //reject a file
    if(file.mimeType === 'image/jpeg' || file.mimeType === 'image/png'){
        cb(null,true)
    }else{
        cb(null,true)
    }
}

const upload = multer({storage:storage, 
    limit:{
        fileSize:1024 * 1024 * 5
    },
    fileFilter:fileFilter
})

const Product = require('../models/products')

router.get('/',(req,res,err)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs=>{
        res.json({
            count:docs.length,
            "products":docs.map(doc=>{
                return{
                    name:doc.name,
                    price:doc.price,
                    _id:doc._id,
                    productImage:doc.productImage,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        })
    })
    .catch(err=>{
        res.json({
            "message":"Something error"
        })
    })
})

router.post('/',checkAuth,upload.single('productImage'),(req,res,err)=>{

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage:req.file.path
    })
    product.save().then(result=>{
        console.log(result)
        return res.status(201).json({
            product:{
                name:result.name,
                price:result.price,
                _id:result._id,
                request:{
                    type:'POST',
                    url:'http://localhost:3000/products/' + result._id
                }
            }
            
        })
    })

    .catch(err=>{
        return res.status(500).json({
            error:err
        })
    })
    
})

router.get('/:productId',checkAuth,(req,res,err)=>{
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


router.delete('/:productId',checkAuth,(req,res,err)=>{
    Product.remove({_id: req.params.productId}).exec()
    .then(docs=>{
        res.json({
            "message":"product deleted",
            product:docs
        })
    })
    .catch(err=>{
        res.json({
            "message":"Something error"
        })
    })
})


router.delete('/',checkAuth,(req,res,err)=>{
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