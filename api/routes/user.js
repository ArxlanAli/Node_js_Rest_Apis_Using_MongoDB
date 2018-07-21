const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()


const User = require('../models/users')


router.post('/login',(req,res,err)=>{
    User.find({email:req.body.email}).exec().then(user=>{
        if(user.length != 0){
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
                if(err){
                    return res.json({
                        error:"Password incorrect"
                    })
                }else{
                    if(result){
                        const token = jwt.sign({
                            email:user[0].email,
                            id:user[0]._id
                        },process.env.jwt_key,{
                            expiresIn:"1h"
                        })
                        return res.json({
                            message:"user is authentic",
                            token:token,
                            user:user
                        })
                    }
                }
                return res.json({
                    error:"Password incorrect"
                   
                })
            })
        }else{
            return res.json({
                error:"Email not exist failed"
            })
        }
    }).catch(err=>{
        return res.json({
            error:err
        })
    })
})

router.post('/signUp',(req,res,err)=>{


    User.find({email:req.body.email}).exec().then(user=>{
        if(user.length != 0){
            res.json({
                "message":"user already exist",
                user:user
            })
        }else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.json({
                        error:err
                    })
                }else{
                    const user = new User({
                        _id:new mongoose.Types.ObjectId(),
                        email:req.body.email,
                        password:hash
                    })
                    user.save().then(result=>{
                        res.json({
                            "mesage":"user created",
                            user:result
                        })
                    }).catch(err=>{
                        return res.json({
                            error:err
                        })
                    })
                }
            })
        }
    })

})

module.exports = router;