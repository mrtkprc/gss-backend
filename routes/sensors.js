const express = require('express');
const router = express.Router();
const SensorData = require('../models/SensorData');
const SensorLocation = require('../models/SensorLocation');



router.post('/add/location/', (req, res, next) => {
    /*
    //Başka bir şey yapmak için böyle eklenmeli
    const { name,surname,gsm,public_key } = req.body;
    const value_added = new SensorLocation({
        name,
        surname,
        gsm,
        public_key
    });
    */
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
    const d = new Date.now();

    const {sensor_location_id,geriatric_id} = req.body;
    const value_added = new SensorData({
        sensor_location_id,
        geriatric_id,
        sensor_date:d.getFullYear().toString()+"-"+d.getMonth().toString()+"-"+d.getDay().toString()
    });
    const promise = value_added.save();

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

module.exports = router;
