const cron = require('node-cron');
const axios_req = require('axios');
const ObjectId = require('mongoose').Types.ObjectId;
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
        startDate = moment(value.last_stimulation, 'YYYY-MM-DD HH:mm:ss');
        endDate = moment(convertDate2DateAndTime(new Date()), 'YYYY-MM-DD HH:mm:ss');
        timeDiff = endDate.diff(startDate, 'minutes');

        resolve(timeDiff);
    });
};

const getLastLocation = (geriatric_id) => {
    return new Promise((resolve,reject) => {
    const match_value = {
        geriatric_id:ObjectId(geriatric_id)
    };

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
                sensor_location_icon_name: '$sensor_location.icon_name',
                alert_duration:'$sensor_location.alert_duration'
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
            let alert_duration = val[i]['alert_duration'];
            let _id = val[i]['_id'];

            if(final_result.length === 0) {
                final_result.push(
                    {
                        sensor_location_id,
                        last_stimulation,
                        sensor_location_name,
                        sensor_location_icon_name,
                        alert_duration,
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
                            alert_duration,
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
                            alert_duration,
                            _id
                        }
                    );
                }
            }
        }
        if(final_result.length > 0)
        {
            const last_location =final_result.sort((a, b) => {
                return b.last_stimulation.toString().localeCompare(a.last_stimulation.toString());
            })[0];
            resolve(last_location);
        }
        else
        {
            resolve({});
        }
    });
    });
}

const doSchedule = cron.schedule('* * * * *', () => {
   Geriatric.find({}).then(data => {
      data.map(val => {
          getLastLocation(val._id)
              .then(data => {
                  if(Object.keys(data).length > 0)
                  {
                      checkAlertDurationofLocation(data)
                          .then(duration => {
                              if (duration > 0)
                                  return {notification_status:true,geriatric_id:val._id,duration,sensor_location_name:data.sensor_location_name};
                              else
                                  return {notification_status:false};
                          })
                          .then(condition => {
                              if (condition.notification_status === true)
                              {
                                  Relative.find({geriatric_id:condition.geriatric_id})
                                      .then(relative => {
                                          if(relative[0].expo_push_id === undefined)
                                          {

                                          /*
                                          const params = {
                                              "to": relative[0].expo_push_id,
                                              "title":"Check Your Relative",
                                              "body": "Sensor Location Name: "+condition.sensor_location_name+" Duration: "+condition.duration
                                          };

                                          axios.post('https://exp.host/--/api/v2/push/send', params, {
                                              headers: {
                                                  'content-type': 'application/json',
                                              },
                                          });
                                          */
                                          }


                                      });
                              }
                          });

                  }
              })

      })
   });
});

module.exports.doSchedule = doSchedule;