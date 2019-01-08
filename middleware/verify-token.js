const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token;
    
    if(token){
        jwt.verify(token,req.app.get('API_SECRET_KEY'),(err,decoded) => {
            if(err){
                res.json({
                   status:false,
                   err:err,
                   message:'Failed to authenticate token.'
                });
            }else{
                req.decode = decoded;
                next();
            }
        })
    }
    else{
        res.json({
            status:false,
            message:'No token provided.'
        });
    }

}