const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SensorDataSchema = new Schema({
    sensor_location_id:Schema.Types.ObjectId,
    sensor_date:Schema.Types.String,
    sensor_stimulations:Schema.Types.Array,
    geriatric_id:Schema.Types.ObjectId
});

module.exports = mongoose.model('sensor_datas',SensorDataSchema);