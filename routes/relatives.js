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
            res.json({status:true,email:data.email,geriatric_id:data.geriatric_id});
        else
            res.json({status:false,message:"Authentication failed"});
    });
});

module.exports = router;
