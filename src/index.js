const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const axios = require('axios')
const ipcRender = electron.ipcRenderer



const notifyBtn = document.getElementById('notifyBtn')
var price = document.querySelector('h1')
var targetPrice = document.getElementById('targetPrice')
var targetPriceVal

const notificatoin = {
    title: 'BTC Alert',
    body: 'BTC just beat your target price!',
    // icon: path.join(__dirname, '../assets/images/bitcoin.ico')//todo 都能用多大的？？什么格式的？
    //教程中用的是win所以用的是图片格式，但我的是macos 得用苹果的图标格式吧
}

function getBTC(){
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
        .then(res => {
            console.log(res)
            const cryptos = res.data.BTC.USD
            price.innerHTML = '$' + cryptos.toLocaleString('en')

            if(targetPrice.innerHTML != '' && targetPriceVal < res.data.BTC.USD){
                const myNotification = new window.Notification(notificatoin.title, notificatoin)//html5 通知 api
            }
        })
}

getBTC()
setInterval(getBTC, 10000)//每三十秒获取一下比特币对美元的'汇率'

notifyBtn.addEventListener('click', function(event){
    const modalPath = path.join('file://', __dirname, 'add.html')
    let win = new BrowserWindow({frame: false, transparent: true, alwaysOnTop: true, width: 400, height: 200})
    win.on('close', function(event){
        win = null
    })
    win.loadURL(modalPath)
    win.show()
    
})

ipcRender.on('targetPriceVal', function(event, arg){
    targetPriceVal = Number(arg)
    targetPrice.innerHTML = '$' + targetPriceVal.toLocaleString('en')

})