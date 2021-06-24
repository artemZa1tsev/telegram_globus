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
    ])

bot.on('message',  msg => {  
    const newStr = msg.text;
    const chatId = msg.chat.id;
    if (newStr === '/start') {
                
                 bot.sendPhoto(chatId, 'https://i.ibb.co/YdwprZS/kisspng-globus-sb-warenhaus-sankt-wendel-retail-supermarke-globus-sb-warenhaus-holding-gmbh-amp-co-k.png');
               return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот поиска продуктов в гипермаркете Глобус. Напиши название товара и я попробую его найти.`);
            };

    
  
    const text = newStr.toLowerCase();
   
    const oneUpper = text.charAt(0).toUpperCase() + text.slice(1);
    
   
   
 for (var i=0, len=product_read.length; i<len; i++) {
    if (product_read[i] === oneUpper)
        return bot.sendPhoto(chatId, `${links_read[i]}`)
      };

      return bot.sendMessage(chatId, 'Товар не найден.');
})


