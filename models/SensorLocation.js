const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SensorLocationSchema = new Schema({
    name:Schema.Types.String,
    geriatric_id:Schema.Types.ObjectId,
    alert_duration:{
        type:Schema.Types.Number,
        default: -1
    },
    icon_name:{
        type:Schema.Types.String,
        default:'assistive listening systems'
    }
});

module.exports = mongoose.model('sensor_locations',SensorLocationSchema);