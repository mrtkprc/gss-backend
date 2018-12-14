const express = require('express');
const ObjectId = require('mongoose').Types.ObjectId;
const router = express.Router();
const SensorData = require('../models/SensorData');
const SensorLocation = require('../models/SensorLocation');
const { convertDate2YearMonthDay,convertDate2DateAndTime } = require('../helpers/global_operations');

router.get(['/get/stimulus/:year/:month/:day','/get/stimulus/today','/get/stimulus/last'], (req, res, next) => {
    console.log();
    let date_time = "";
    let isLastEndPoint = false;
    const {geriatric_id} = req.decode;
    console.log("Geriatric ID: ",geriatric_id);
    console.log("Req.Path: ",req.path);
    if ( req.path === '/get/stimulus/today/' || req.path === '/get/stimulus/today' )
    {
        date_time = convertDate2YearMonthDay(new Date());
        
    }
    else if ( req.path === '/get/stimulus/last/' || req.path === '/get/stimulus/last')
    {
        isLastEndPoint = true;
        
    }
    else
    {
        const {year, month, day} = req.params;
        date_time = convertDate2YearMonthDay(new Date(parseInt(year),parseInt(month)-1,parseInt(day),0,0,0,0));
    }
    let match_value = {};
    //LastEndPoint'de match için tarih verilmemesi adına yapıldı.
    if(isLastEndPoint === false)
    {
        match_value = {
            sensor_date : date_time,
            geriatric_id:ObjectId(geriatric_id)
        };
    }
    else
    {
        match_value = {
            geriatric_id:ObjectId(geriatric_id)
        };
    }
    const val_pro = SensorData.aggregate([
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
            $match:match_value
        }
        ,
        {
            $project: {
                _id: 1,
                sensor_stimulations: 1,
                sensor_location_id: '$sensor_location._id',
                sensor_location_name: '$sensor_location.name',
                sensor_location_icon_name: '$sensor_location.icon_name'
            }
        }
    ], (err, val) => {
        const final_result = [];


        for(let i = 0;i<Object.keys(val).length;i++)
        {
            let stimulations_array = val[i]['sensor_stimulations'];
            let last_stimulation = (stimulations_array[stimulations_array.length-1]).toString();
            let sensor_location_id = val[i]['sensor_location_id'];
            let sensor_location_name = val[i]['sensor_location_name'];
            let sensor_location_icon_name = val[i]['sensor_location_icon_name'];
            let _id = val[i]['_id'];

            if(final_result.length === 0) {
                final_result.push(
                    {
                        sensor_location_id,
                        last_stimulation,
                        sensor_location_name,
                        sensor_location_icon_name,
                        _id
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
                            sensor_location_name,
                            sensor_location_icon_name,
                            _id
                        }
                    );
                }else{
                    final_result.unshift(
                        {
                            sensor_location_id,
                            last_stimulation,
                            sensor_location_name,
                            sensor_location_icon_name,
                            _id
                        }
                    );
                }
            }
        }
        if(final_result.length > 0)
        {
            res.json(final_result.sort((a, b) => {
                return b.last_stimulation.toString().localeCompare(a.last_stimulation.toString());
            }));
        }
        else
        {
            res.json([]);
        }
    });
});

router.get('/get/locations',(req,res,next) => {
    const {geriatric_id} = req.decode;
    const val_pro = SensorLocation.find({geriatric_id});

    val_pro.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({
            ...err,
            status:false
        })
    });
});

router.get('/get/location/stimuluses',(req,res,next) => {
    const {sensor_location_id} = req.decode;
    const sensor_date = convertDate2YearMonthDay(new Date());
    console.log(sensor_date);
    const val_pro = SensorData.find({sensor_location_id,sensor_date});

    val_pro.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({
            ...err,
            status:false
        })
    });
});

router.post('/add/location/', (req, res, next) => {
    const value_added = new SensorLocation(req.decode);
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
    const today = convertDate2YearMonthDay(new Date());
    const today_with_hour = convertDate2DateAndTime(new Date());

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
