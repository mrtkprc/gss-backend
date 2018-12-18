const express = require('express');
const router = express.Router();
const Geriatric = require('../models/Geriatric');
const shortid = require('shortid');

router.post('/add', (req, res, next) => {
    const { name,surname,gsm } = req.decode;
    const value_added = new Geriatric({
        name,
        surname,
        gsm,
        telegram_chat_id:'',
        public_key:shortid.generate()
    });
    const promise = value_added.save();

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

router.get('/get/geriatric/', (req, res, next) => {
    const {_id} = req.decode;
    const promise = Geriatric.findOne({_id});

    promise.then((data) => {
        res.json(data);
    }).catch((err)=>{
        res.json({
            status:false,
            message:'Get Geriatric Failed'
        });
    });

});

router.put('/update/telegram/chat_id', (req, res, next) => {
    const { telegram_chat_id,public_key } = req.decode;
    console.log("Telegram Update Endpoint: ",telegram_chat_id," ",public_key);
    const promise = Geriatric.updateOne({public_key},{telegram_chat_id})

    promise.then((data) => {
        if(data.nModified == 1)
        {
            res.json({
                status:"true",
                text:"Updating Telegram ChatID is successful"
            })
        }
        else
        {
            res.json({
                status: "false",
                text: "Telegram Chat id is already active."
            });
        }
    }).catch((err) => {
        res.json({
            status: "false",
            text: "Updating Telegram ChatID is failed"
        });
    });
});



module.exports = router;
