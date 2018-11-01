process.env["NTBA_FIX_319"] = 1 //Telegram Bot hatası için
const config = require('../../config');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.telegram_bot_token,{polling:true});
const axios_req = require('axios');
const jwt = require('jsonwebtoken');
const Geriatric = require('../../models/Geriatric');

const axios = axios_req.create({
   baseURL:'http://localhost:3000/api/'
});

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/register (.+)/, (msg, match) => {
    const telegram_chat_id = msg.chat.id;
    const public_key = match[1].trim();
    const payload ={
        telegram_chat_id,
        public_key
    };
    const token = jwt.sign(payload,config.api_secret_key);
    axios.put('geriatric/update/telegram/chat_id',{
        telegram_chat_id,
        public_key,
        token
    })
    .then((response) => {
        bot.sendMessage(telegram_chat_id, response.data.text);
    })
    .catch((error) => {
        bot.sendMessage(telegram_chat_id, error.text);
    });
});

bot.onText(/\/today/, (msg) => {
        let payload = {};
        Geriatric.findOne({telegram_chat_id:msg.chat.id})
        .then((response) => {
            payload = {geriatric_id:response._id};
        })
        .catch(error => {
            bot.sendMessage(msg.chat.id,"An Error occurred.");
            return;
        });

        const token = jwt.sign(payload,config.api_secret_key);
        axios.get('sensor/get/stimulus/today'+'?token='+token)
        .then((response) => response.data)
        .then((data) => {

            const last_data = data[0];
            let message = "";
            if(data.length > 0)
            {
                const {sensor_location_name, last_stimulation} = last_data;
                message = "Last Signal Date: " + last_stimulation +"\n" +"Location Information: " + sensor_location_name+"\n";
            }
            else
                message = "There is no signal today!\nIf you learn last signal, only you can send /last message";

            bot.sendMessage(msg.chat.id,message);
        })
        .catch((error) => {
           bot.sendMessage(msg.chat.id,"An Error occurred.");
        });
});

bot.onText(/\/last/, (msg) => {
    let token = '';
    Geriatric.findOne({telegram_chat_id:msg.chat.id})
        .then((response) => {
            token = jwt.sign({geriatric_id:response._id},config.api_secret_key);
            axios.get('sensor/get/stimulus/last?token='+token)
                .then((response) => response.data)
                .then((data) => {

                    const last_data = data[0];
                    let message = "";
                    if(data.length > 0)
                    {
                        const {sensor_location_name, last_stimulation} = last_data;
                        message = "Last Signal Date: " + last_stimulation +"\n" +"Location Information: " + sensor_location_name+"\n";
                    }
                    else
                        message = "There is no any signal in the system.";

                    bot.sendMessage(msg.chat.id,message);
                })
                .catch((error) => {
                    bot.sendMessage(msg.chat.id,"An Error occurred.");
                });
        })
        .catch((error) => {
            bot.sendMessage(msg.chat.id,"An Error occurred.");
            return;
        });
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id,
        "Welcome to Geriatric Surveillance Bot.\n" +
        "In order to get messages, you have to register to Telegram Bot System.\n" +
        "You should send message like following prototype for registration\n\n" +
        "/register <your_api_key> (without angular parenthesis)");
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, "How can I help you?");
});

bot.onText(/\/örk/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hoşgeldiniz, Ömer Recep KÖPRÜCÜ.");
});

module.exports = bot;