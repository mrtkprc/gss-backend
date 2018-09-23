const express = require('express');
const router = express.Router();
const SensorData = require('../models/SensorData');


router.post('/add/:public_key', (req, res, next) => {
    const { public_key } = req.params;
    const { sensor_name } = req.body;

    const sensor_data = new SensorData({

    });

    sensor_data.save((err,data) => {
        res.json(data);
    });
});


module.exports = router;
