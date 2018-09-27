const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const SensorData = require('../models/SensorData');
const SensorLocation = require('../models/SensorLocation');

router.post('/add/location/', (req, res, next) => {
    //Sensor Location Added
    const value_added = new SensorLocation(req.body);
    const promise = value_added.save();

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

router.post('/add/stimulus/', (req, res, next) => {
    //Sensor Data Added
    const d = new Date();
    const today = d.getFullYear().toString()+"-"+("0" + (d.getMonth() + 1)).slice(-2).toString()+"-"+("0" + d.getDate()).slice(-2).toString();
    const today_with_hour = today+ " "+ ("0" + d.getHours()).slice(-2).toString()+":"+ ("0" + d.getMinutes()).slice(-2).toString()+":"+("0" + d.getSeconds()).slice(-2).toString();
    const {sensor_location_id,geriatric_id} = req.body;
    SensorData.countDocuments({ },( err, count) => {
        if(count < 1)
        {
            const sensor_data = new SensorData({
                sensor_location_id,
                geriatric_id,
                sensor_date:d.getFullYear().toString()+"-"+("0" + (d.getMonth() + 1)).slice(-2).toString()+"-"+("0" + d.getDate()).slice(-2).toString()
            });

            const value_added = sensor_data.save();
            value_added.then((data) => {
                res.json(data);
            }).catch((err) => {
                res.json(err);
            });
        }
        else
        {
            const val = SensorData.updateOne({geriatric_id},{$push:{sensor_stimulations:today_with_hour}});
            val.then((data) => {
                res.json({result:"Updated."});
            }).catch((err) => {
                res.json(err);
            });
        }
    });
});

module.exports = router;
