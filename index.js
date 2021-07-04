const { token } = require('./config')
const TelegramApi = require('node-telegram-bot-api') 
const puppeteer = require('puppeteer');
let fs = require('fs');
const { join } = require('path');
let product_read = fs.readFileSync('product.txt').toString().split("\n");
let links_read = fs.readFileSync('links.txt').toString().split("\n");
let html_read = fs.readFileSync('index.html').toString().split("\n");
 



function transliterate(word) {
    const keys = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
      'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i',
      'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
      'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh',
      'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya'
    }
    return word.split("").map((char) => keys[char] || char).join("");
  }

function search_elem (product) {
    console.log("Ищу " + product)
    for (var i=0, len=html_read.length; i<len; i++) {
      if ( html_read[i].match(product) != null)  
      return html_read[i]  
    }     
};
 


function update_elem (str) {
   

    const length = str.length
    const mergeStyle = str.substr(0, length - 7);
    const result = mergeStyle + 'class="display = none"' +'></div>'
    console.log("Обновил html " + result)
    for (var i=0, len=html_read.length; i<len; i++) {
        
        if ( html_read[i].match(str) != null)  
        return html_read[i] = result
      } 
    }; 

    function delElem () {
        for (var i = 0, len=html_read.length; i<len; i++) {
        if ( html_read[i].match('class="display = none"') != null) 
        return html_read[i] = `${html_read[i]}`.replace('class="display = none"', "")
        }    
    }
   
   
 
function index_screen () {
    console.log("Создаю index_screen.html")
    const htmlReadUpdate = html_read;
    for (var i=0, len=html_read.length; i<len; i++){
     fs.appendFileSync("index_screen.html", htmlReadUpdate[i] + '\n')
     
    }
};


async function returnSide(str) {
    console.log( "Ищу крыло "  + str)
        const product =  str;
        console.log( "Присвоил переменную str ")
        const browser = await puppeteer.launch();
        console.log("запустился") 
        page = await browser.newPage();
        console.log("создал страницу") 
        await page.goto('file:///home/artem/workspace/js//telegram-globus-clone/telegram_globus/index.html', {waitUntil: 'load'});
        console.log("открыл страницу")
        const newPage = await page.evaluate((product) => {
        return document.getElementById(product).parentNode.className;
        },product);
        console.log( "Нашел крыло " + newPage)
        
              
        if (newPage === "north__plates") {          
            return  {'x': 750, 'y': 700, 'width': 2250, 'height': 900};
        };
        if (newPage === "western__plates") {
            return  {'x': 0, 'y':0, 'width': 1000, 'height': 1500};
        };
        if (newPage === "eastern__plates") {
            return {'x': 2800, 'y':0, 'width': 900, 'height': 1500};
        };
        if (newPage === "south__plate") {
            return  {'x': 750, 'y': 0, 'width': 2250, 'height': 750};
        }
        else {
            return {'x': 0, 'y':0, 'width': 3700, 'height': 1800};
        }
                       
};



 async function screen(name, side) {  
    console.log("SCREEN Получил крыло " + side)
    console.log("SCREEN Получил имя " + name)
    name = name + ".png"                               
    const browser = await puppeteer.launch(); 
    console.log("запустился")      
    const page = await browser.newPage();  
    console.log("создал страницу")         
    await page.goto('file:///media/artem/5124137a-47d7-4780-96b5-3be3d8c9fbb4/workspace/js/telegram-globus-clone/telegram_globus/index_screen.html');    
    console.log("открыл страницу")
    await page.screenshot({path: name, 'clip': side });    
    await browser.close();
    
    await fs.unlinkSync('index_screen.html')
    var oldPath = name
    var newPath = "./screen/" + name 
    fs.renameSync(oldPath, newPath)
    
    console.log("удалил")
                                
  };

  async function callScreen (str) {
     const a = await returnSide(str);
     return await screen(str, a)
    
  }


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
            const n = transliterate(newStr)
            const x = search_elem(n)
            const y = update_elem(x)         
            index_screen()
            callScreen(n);
            delElem()
            
    
  
    const text = newStr.toLowerCase(); 
    const oneUpper = text.charAt(0).toUpperCase() + text.slice(1);

    
   
   
 for (var i=0, len=product_read.length; i<len; i++) {
    if (product_read[i] === oneUpper)
        return bot.sendPhoto(chatId, './screen/' + n + '.png')
      };
      fs.appendFileSync("not_found.txt", "Not found: " + msg.text + ", Username: " + msg.chat.username + '\n')
      return bot.sendMessage(chatId, 'Товар не найден.');
})


