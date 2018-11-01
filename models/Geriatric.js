const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeriatricSchema = new Schema({
    name:Schema.Types.String,
    surname:Schema.Types.String,
    gsm:Schema.Types.String,
    telegram_chat_id:Schema.Types.String,
    public_key: {
        type:Schema.Types.String,
        required:true,
        unique:true,
    }
});

module.exports = mongoose.model('geriatrics',GeriatricSchema);