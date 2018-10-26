const express = require('express');
const router = express.Router();
const SensorData = require('../models/SensorData');
const SensorLocation = require('../models/SensorLocation');

router.get('/get/stimulus/:year/:month/:day', (req, res, next) => {
    const {year, month, day} = req.params;
    const geriatric_id = '5ba8f3ec1b4f4a24ccb372c2'; //burayı jwtden al sonra
    /*
    const val = SensorData.find(
        {
            sensor_date: year+"-"+month+"-"+day,
            geriatric_id
        },
        {
            _id:0,
            geriatric_id:0,
            sensor_date:0,
            __v:0
        },
    );
    */
    const val = SensorData.aggregate([
        {
            $lookup: {
                from: 'sensor_locations',
                localField: 'sensor_location_id',
                foreignField: '_id',
                as: 'sensor_location'
            },

        },
        {
            $unwind: '$sensor_location'
        },
        {
            $project: {
                _id: 0,
                sensor_stimulations: 1,
                sensor_location_id: '$sensor_location._id',
                sensor_location_name: '$sensor_location.name'
            }
        }
    ], (err, val) => {
        const result = [];
        const final_result = [];
        for(let i = 0;i<Object.keys(val).length;i++)
        {
            let stimulations_array = val[i]['sensor_stimulations'];
            let last_stimulation = (stimulations_array[stimulations_array.length-1]).toString();
            let sensor_location_id = val[i]['sensor_location_id'];
            let sensor_location_name = val[i]['sensor_location_name'];

            if(final_result.length === 0) {
                final_result.push(
                    {
                        sensor_location_id,
                        last_stimulation,
                        sensor_location_name
                    }
                )
            }
            else{
                let first_element = val[0]['last_stimulation'];
                if(first_element > last_stimulation ){
                    final_result.push(
                        {
                            sensor_location_id,
                            last_stimulation,
                            sensor_location_name
                        }
                    );
                }else{
                    final_result.unshift(
                        {
                            sensor_location_id,
                            last_stimulation,
                            sensor_location_name
                        }
                    );
                }
            }

        }
        res.json(final_result);
    });
});

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

router.get('/add/stimulus_get/:token', (req, res, next) => {
    console.log("stimulus get");
    const d = new Date();

    const sensor_location_id = "5ba8f7bdb682be1b1c123e73";
    const geriatric_id = "5ba8f3ec1b4f4a24ccb372c2";
    const sensor_data = new SensorData({
        sensor_location_id,
        geriatric_id,
        sensor_date:d.getFullYear().toString()+"-"+("0" + (d.getMonth() + 1)).slice(-2).toString()+"-"+("0" + d.getDate()).slice(-2).toString()
    });
    const value_added = sensor_data.save();
    value_added.then((data) => {
        res.json("Okey Başarılı")
    });
    console.log("sitimulus get finished");
});
router.post('/add/stimulus/', (req, res, next) => {
    //Sensor Data Added
    const d = new Date();
    const today = d.getFullYear().toString()+"-"+("0" + (d.getMonth() + 1)).slice(-2).toString()+"-"+("0" + d.getDate()).slice(-2).toString();
    const today_with_hour = today+ " "+ ("0" + d.getHours()).slice(-2).toString()+":"+ ("0" + d.getMinutes()).slice(-2).toString()+":"+("0" + d.getSeconds()).slice(-2).toString();

    const {sensor_location_id,geriatric_id} = req.decode;
    console.log("Sensor Location id: ",sensor_location_id," Geriatric ID: ",geriatric_id);
    SensorData.countDocuments({geriatric_id,sensor_location_id, sensor_date:today },( err, count) => {
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
                const upd = SensorData.updateOne({geriatric_id,sensor_location_id,sensor_date:today },{$push:{sensor_stimulations:today_with_hour}});
                upd.then((data_with_insertion) => {

                })
            }).catch((err) => {
                res.json(err);
            });
        }
        else // count >= 1 ise
        {
            console.log("Count in Else ",count);

            const val = SensorData.updateOne({geriatric_id,sensor_location_id,sensor_date:today },{$push:{sensor_stimulations:today_with_hour}});
            val.then((data) => {
                res.json(
                    {
                        status:true,
                        result:"Stimulus is added."}
                    );
            }).catch((err) => {
                res.json(err);
            });
        }
    });
});

module.exports = router;
