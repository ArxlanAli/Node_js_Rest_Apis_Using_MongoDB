const jwt = require('jsonwebtoken')
module.exports = (req,res,next) =>{
    try{
        const token = req.headers.token
        console.log(token)
        const decoded = jwt.verify(token,process.env.jwt_key)
        req.userData = decoded
        next()
    }catch(error){
        return res.json({
            message:"Auth failed"
        })
    }

}