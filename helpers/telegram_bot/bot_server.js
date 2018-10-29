process.env["NTBA_FIX_319"] = 1 //Telegram Bot hatası için
const TelegramBot = require('node-telegram-bot-api');
const token = "705081525:AAGrp5vIoRr2iXRzlaGdKIMEC9ZB2ncqsFAmk";
const bot = new TelegramBot(token,{polling:true});
const axios = require('axios');


bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/register (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const geriatric_public_key = match[1];
    bot.sendMessage(chatId, geriatric_public_key.toString().toUpperCase());
});

bot.onText(/\/gss/, (msg) => {
    axios.get('/api/sensor/get/stimulus/2018/10/19')
        .then((response) => {
            console.log(response);
        })
});


bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome to Geriatric Surveillance Bot.\n");
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, "How can I help you?");
});

bot.onText(/\/örk/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hoşgeldiniz, Ömer Recep KÖPRÜCÜ.");
});

module.exports = bot;