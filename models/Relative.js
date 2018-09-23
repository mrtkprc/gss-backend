const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RelativeSchema = new Schema({
    name:Schema.Types.String,
    surname:Schema.Types.String,
    gsm:Schema.Types.String,
    email:Schema.Types.email,
    geriatric_id:Schema.Types.ObjectId
});

module.exports = mongoose.model('relatives',RelativeSchema);