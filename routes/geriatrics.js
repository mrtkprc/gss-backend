const express = require('express');
const router = express.Router();
const SensorData = require('../models/Geriatric');


router.post('/add', (req, res, next) => {
    const { name,surname,gsm,public_key } = req.body;
    const value_added = new SensorData({
        name,
        surname,
        gsm,
        public_key
    });
    const promise = value_added.save();

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});


module.exports = router;
