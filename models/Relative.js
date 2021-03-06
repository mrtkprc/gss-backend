const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RelativeSchema = new Schema({
    name:Schema.Types.String,
    surname:Schema.Types.String,
    gsm:Schema.Types.String,
    email:Schema.Types.String,
    geriatric_id:Schema.Types.ObjectId,
    expo_push_id:Schema.Types.String
});

module.exports = mongoose.model('relatives',RelativeSchema);