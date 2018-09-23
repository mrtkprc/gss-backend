const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SensorDataSchema = new Schema({
    sensor_location_id:Schema.Types.ObjectId,
    sensor_date:{
        type:Schema.Types.Date,
        default:Date.now
    },
    sensor_stimulations:Schema.Types.Array,
    geriatric_id:Schema.Types.ObjectId
});

module.exports = mongoose.model('sensor_data',SensorDataSchema);