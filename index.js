const TelegramApi = require('node-telegram-bot-api') 
let fs = require('fs');
let product_read = fs.readFileSync('product.txt').toString().split("\n");
for(i in product_read) {
    /* console.log(product_read.length); */
};

let links_read = fs.readFileSync('links.txt').toString().split("\n");
for(i in product_read) {
    /* console.log(product_read.length); */
};



const token = "1850230832:AAED80DMUF-tcR50VP252HRaOh0mCAu02hM"

const bot = new TelegramApi(token, {polling: true})



bot.setMyCommands( [
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию о пользователе'},
])

bot.on('message',  msg => {  
    const text = msg.text;
    const chatId = msg.chat.id;
   
 for (var i=0, len=product_read.length; i<len; i++) {
    if (product_read[i] === text)
        return bot.sendPhoto(chatId, `${links_read[i]}`)
      };
})


