const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SensorLocationSchema = new Schema({
    name:Schema.Types.String,
    geriatric_id:Schema.Types.ObjectId
});

module.exports = mongoose.model('sensor_locations',SensorLocationSchema);