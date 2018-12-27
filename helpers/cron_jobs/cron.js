const cron = require('node-cron');
const axios_req = require('axios');
const _ = require('lodash');
const moment = require('moment');
const SensorData = require('../../models/SensorData');
const Relative = require('../../models/Relative');

const {convertDate2DateAndTime} = require('./../../helpers/global_operations');


const getSensorDataAndLocations = () => {
    return new Promise((resolve,reject) => {
        SensorData.aggregate([
            {
                $lookup:{
                    from: 'sensor_locations',
                    localField: 'sensor_location_id',
                    foreignField: '_id',
                    as: 'sensor_location'
                }
            },
            {
                $unwind: '$sensor_location'
            },
            {
                $sort:{sensor_date: 1 }
            },
            {
                $group:{
                    _id:"$geriatric_id",
                    sensor_date:{$last:"$sensor_date"},
                    sensor_stimulations: { "$first": {$slice: ["$sensor_stimulations",-1]}},
                    sensor_location_id: { "$first": "$sensor_location_id"},
                    alert_duration: { "$first": "$sensor_location.alert_duration"},

                }
            },

        ],(err,result)=> {
            if(err === null)
                resolve(result);
            else
                reject(err);
        });
    });
}
//const eachLocationSignalControl()

const doSchedule = cron.schedule('* * * * *', () => {
    console.log("DoSchedule");
});

getSensorDataAndLocations().then((data)=>{
    data.map((val) => {
        console.log(val);
    })
});


module.exports.doSchedule = doSchedule;



/*
{
    $project: {
        _id:0,
            sensor_stimulations: {$slice: ["$sensor_stimulations",-1]},
        geriatric_id:1,
            sensor_location_id: '$sensor_location._id',
            sensor_location_name: '$sensor_location.name',
            alert_duration:'$sensor_location.alert_duration',
            sensor_date:1
    }
}
*/