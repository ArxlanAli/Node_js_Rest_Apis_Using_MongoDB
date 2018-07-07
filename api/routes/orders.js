const express = require('express')

const router = express.Router()

router.get('/',(req,res,err)=>{
    res.status(200).json({
        message:"handling get orders requests"
    })
})

router.post('/',(req,res,err)=>{
    res.status(200).json({
        message:"handling post orders requests"
    })
})

router.get('/:orderId',(req,res,err)=>{
    const id = req.params.orderId
    res.status(200).json({
        message:id
    })
})




module.exports = router;