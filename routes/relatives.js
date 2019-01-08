const express = require('express');
const router = express.Router();
const Relative = require('../models/Relative');


router.post('/add', (req, res, next) => {
    const { name,surname,gsm,email,geriatric_id,password } = req.decode;
    const value_added = new Relative({
        name,
        surname,
        gsm,
        email,
        password,
        geriatric_id
    });
    console.log(name,surname,gsm);
    const promise = value_added.save();

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

router.post('/login_control', (req, res, next) => {
    const { email,password } = req.decode;
    Relative.findOne({email,password},(err,data) => {
        if(data != null)
            res.json({status:true,email:data.email,geriatric_id:data.geriatric_id,name:data.name,surname:data.surname,gsm:data.gsm});
        else
            res.json({status:false,message:"Authentication failed"});
    });
});

router.get('/get/relative', (req, res, next) => {
    const { email } = req.decode;
    Relative.findOne({email},(err,data) => {
        if(data != null)
            res.json({email:data.email,name:data.name,surname:data.surname,gsm:data.gsm});
        else
            res.json({status:false,message:"Authentication failed"});
    });
});

router.put('/add/expo_push_notification', (req, res, next) => {
    const { data,email } = req.decode;
    console.log("expo push id",data," and email: ",email);
    res.end();
    
});


module.exports = router;