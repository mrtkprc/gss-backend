const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeriatricSchema = new Schema({
    name:Schema.Types.String,
    surname:Schema.Types.String,
    gsm:Schema.Types.String,
    telegram_chat_ids:Schema.Types.Array,
    public_key: {
        type:Schema.Types.String,
        required:true,
        dropDups:true
    }
});

module.exports = mongoose.model('geriatrics',GeriatricSchema);