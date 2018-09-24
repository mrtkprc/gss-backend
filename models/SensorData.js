const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SensorDataSchema = new Schema({
    sensor_location_id:Schema.Types.ObjectId,
    sensor_date:{
        type:Schema.Types.String,
        default:Date.now
    },
    sensor_stimulations:{
        type:Schema.Types.Array,
        default:Date.now
    },
    geriatric_id:Schema.Types.ObjectId
});

module.exports = mongoose.model('sensor_datas',SensorDataSchema);