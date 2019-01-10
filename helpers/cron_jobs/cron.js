const cron = require('node-cron');
const axios_req = require('axios');
const _ = require('lodash');
const moment = require('moment');
const SensorData = require('../../models/SensorData');
const Relative = require('../../models/Relative');
const Geriatric =require('../../models/Geriatric');

const axios = require('axios');

const {convertDate2DateAndTime} = require('./../../helpers/global_operations');

let startDate;
let endDate;
let timeDiff;

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
                $sort:{sensor_date: -1 }
            },
            {
                $group:{
                    _id:"$sensor_location_id",
                    sensor_date:{$last:"$sensor_date"},
                    sensor_stimulation_last_time: { "$first": {$slice: ["$sensor_stimulations",-1]}},
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
const checkAlertDurationofLocation = (value) => {
    return new Promise((resolve,reject) => {
        startDate = moment(value.sensor_stimulation_last_time[0], 'YYYY-MM-DD HH:mm:ss');
        endDate = moment(convertDate2DateAndTime(new Date()), 'YYYY-MM-DD HH:mm:ss');
        timeDiff = endDate.diff(startDate, 'minutes');

        resolve(timeDiff);
    });
};

const doSchedule = cron.schedule('* * * * *', () => {
    getSensorDataAndLocations()
        .then((data)=>{
        data.map((val) => {

            checkAlertDurationofLocation(val)
                .then(data => {
                    console.log("Time Diff: ",data," val:",val);
                    //return {time_diff:data,val:val}
                    return false;
                })
                .then(data => {
                    if(data === true)
                    {
                        const params = {
                            "to": "ExponentPushToken[eNmORiHCU1FqSicXp3Pm36]",
                            "title":"hello world",
                            "body": "selammm dunya"
                         };
              
                         axios.post('https://exp.host/--/api/v2/push/send', params, {
                             headers: {
                            'content-type': 'application/json',
                            },
                         });
                    }
                })
        })
    });
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