const {app, BrowserWindow, Menu, shell, globalShortcut, ipcMain} = require('electron')

const fs = require('fs')

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win
  
  function createWindow () {
    // 创建浏览器窗口。
    win = new BrowserWindow({width: 800, height: 600})
  
    // 然后加载应用的 index.html。
    win.loadFile('src/index.html')
  
    // 打开开发者工具
    // if (process.env && process.env.ENV === 'dev'){
      // win.webContents.openDevTools()
    // }
  
    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
      // 取消引用 window 对象，如果你的应用支持多窗口的话，
      // 通常会把多个 window 对象存放在一个数组里面，
      // 与此同时，你应该删除相应的元素。
      win = null
    })

    //初始化菜单
    var menu = Menu.buildFromTemplate([
      {
        role: 'window',  //TODO 具体作用还是没太明白，参考了electron-api-demos和在线文档也没想明白，怎么回事 window,help,services 标准菜单？
        submenu: [
          {label: 'Sub menu 1'},
          {label: 'Open Url BaiDu',
            click(){
              shell.openExternal('https://www.baidu.com')
            }
          },
          {type: 'separator'},
          {label: 'Exit APP',
            click(){
              console.log('will quit')
              app.quit()
            }
          }
        ]
      },
      {label: 'Info',
        submenu:[
          {label: 'Info-1'},
          {label: 'Info-2'}
        ]
      },
      { //3.0.0 如果子菜单为空则不展示顶级菜单
        label: 'About'
      }
    ])

    //设置应用菜单
    Menu.setApplicationMenu(menu)

    //定义相关快捷键
    globalShortcut.register('cmd+q', () => {
      app.quit()
    })

    globalShortcut.register('Command+Option+i', () => {
      win.webContents.openDevTools()
    })

    fs.writeFile('/etc/a.txt', 'this is for electron-sudo test', (err) => {
      if (! err) {
          console.log('写入成功')
      } else {
        console.log('写入失败' + err)
      }
  })

  }
  
  // Electron 会在初始化后并准备
  // 创建浏览器窗口时，调用这个函数。
  // 部分 API 在 ready 事件触发后才能使用。
  app.on('ready', createWindow)
  
  // 当全部窗口关闭时退出。
  app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
      createWindow()
    }
  })
  
  // 在这个文件中，你可以续写应用剩下主进程代码。
  // 也可以拆分成几个文件，然后用 require 导入。


  ipcMain.on('update-notify-value', (event, arg) => {
    win.webContents.send('targetPriceVal', arg)
  })