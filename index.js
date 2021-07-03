const { token } = require('./config')
const TelegramApi = require('node-telegram-bot-api') 
const puppeteer = require('puppeteer');
let fs = require('fs');
let product_read = fs.readFileSync('product.txt').toString().split("\n");
let links_read = fs.readFileSync('links.txt').toString().split("\n");
let html_read = fs.readFileSync('index.html').toString().split("\n");
 




function search_elem (product) {
    for (var i=0, len=html_read.length; i<len; i++) {
      if ( html_read[i].match(product) != null)  
      return html_read[i]  
    }     
};
 


function update_elem (str) {
    const length = str.length
    const mergeStyle = str.substr(0, length - 7);
    const result = mergeStyle + ' class="display = none"' +'></div>'
    
    for (var i=0, len=html_read.length; i<len; i++) {
        if ( html_read[i].match(str) != null)  
        return html_read[i] = result
      } 
    }; 


 
function index_screen () {
    const htmlReadUpdate = html_read;
    for (var i=0, len=html_read.length; i<len; i++){
        fs.appendFileSync("index_screen.html", htmlReadUpdate[i] + '\n')
    }
};


async function returnSide(str) {
        console.log(str)
        const product = str;
        const browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('file:///home/artem/workspace/js/telegram-globus/index.html', {waitUntil: 'load'});
        const newPage = await page.evaluate((product) => {
        return document.getElementById(product).parentNode.className;
        },product);
        return newPage
             
               
};





function sideMap (newPage) {
    if (newPage === "north__plates") {          
        return  {'x': 750, 'y': 700, 'width': 2250, 'height': 900};
    };
    if (newPage === "western__plates") {
        return {'x': 2800, 'y':0, 'width': 900, 'height': 1500};
    };
    if (newPage === "eastern__plates") {
        return {'x': 0, 'y':0, 'width': 1000, 'height': 1500};
    };
    if (newPage === "south__plate") {
        return  {'x': 750, 'y': 0, 'width': 2250, 'height': 750};
    }
    else {
        return {'x': 0, 'y':0, 'width': 3700, 'height': 1800};
    }
}

console.log(sideMap("north__plates"))


 async function screen(side, name) {  
    console.log(side)
    console.log(name)
    name = name + ".png"                               
    const browser = await puppeteer.launch();       
    const page = await browser.newPage();           
    await page.goto('file:///home/artem/workspace/js/telegram-globus/index_screen.html');        
    await page.screenshot({path: name, 'clip': side });    
    await browser.close();
    fs.unlinkSync('index_screen.html')
    var oldPath = name
    var newPath = "./screen/" + name 
    fs.renameSync(oldPath, newPath)
    
                            
  };


 

const bot = new TelegramApi(token, {polling: true})


bot.setMyCommands( [
    {command: '/start', description: 'Начальное приветствие'},
    ])

bot.on('message',  msg => {  
    const newStr = msg.text;
    const chatId = msg.chat.id;
    if (newStr === '/start') {        
        fs.appendFileSync("hello.txt", msg.chat.username + '\n')  
                 bot.sendPhoto(chatId, 'https://i.ibb.co/YdwprZS/kisspng-globus-sb-warenhaus-sankt-wendel-retail-supermarke-globus-sb-warenhaus-holding-gmbh-amp-co-k.png');
               return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот поиска продуктов в гипермаркете Глобус. Напиши название товара и я попробую его найти.`);
            };

            const x = search_elem(newStr)
            console.log(x)
            const y = update_elem(x)
            console.log(y)
            index_screen(y)
            console.log(newStr)
            const s =  returnSide(newStr).then(sideMap);
           
            console.log(s)
            screen(s, newStr)
  
    const text = newStr.toLowerCase(); 
    const oneUpper = text.charAt(0).toUpperCase() + text.slice(1);
    
   
   
 for (var i=0, len=product_read.length; i<len; i++) {
    if (product_read[i] === oneUpper)
        return bot.sendPhoto(chatId, './screen/toilet-paper.png')
      };
      fs.appendFileSync("not_found.txt", "Not found: " + msg.text + ", Username: " + msg.chat.username + '\n')
      return bot.sendMessage(chatId, 'Товар не найден.');
})


