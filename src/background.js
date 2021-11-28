'use strict'

import { app, protocol, BrowserWindow,BrowserView,ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const path = require('path')
const fs = require('fs')
var url = require("url");
var http = require("http");
var request = require('request');
const Store =  require('electron-store');
const store = new Store()


const os = require('os')
//全局变量
global.constDict = {
  bookPath:path.join(os.homedir(),'cloud_reader_desktop','books'),
  serverHost:'http://110.42.188.51',
  // serverHost:'http://localhost:18081',
};
// 初始化文件目录
if(!fs.existsSync(constDict.bookPath)){
  fs.mkdir(constDict.bookPath,{recursive:true},(err)=>{
    if(err){
        console.log('创建目录错误：',constDict.bookPath);
        throw err;
        
    }else{
        console.log('创建目录成功：',constDict.bookPath);
    }
  });
}





// import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

ipcMain.on('download-book',function(event,id,bookName){
  console.log(bookName)
  downloadFile(constDict.serverHost+'/book/preview/'+id,bookName,function(){
    console.log('下载成功:',bookName)
    event.reply('download-book-reply', 'success')
  });
  
})

ipcMain.on('open-pdf', function(event, pdfUrl,pageNum,bookId) {
  openPdfWin(pdfUrl,pageNum,bookId)
  // event.sender.send('asynchronous-reply', 'pong');
});

function downloadFile(uri,filename,callback){
  let stream = fs.createWriteStream(path.join(constDict.bookPath, filename));
  request(uri,{
    headers: {'Authorization': store.get('token')}
  }).pipe(stream).on('close', callback); 
}

function openPdfWin(bookName,pageNum,bookId){
  const pdfWin = new BrowserWindow({
    webPreferences: {
      // 插件支持
      plugins :true,webSecurity: false,
    }
  })
  pdfWin.maximize()

  if(isDevelopment){
    pdfWin.loadURL('file://' + __dirname + '/bundled/pdfviewer/web/viewer.html?file='+
    encodeURIComponent('http://localhost:9090/getPdf?pdfName='+bookName)+'#page='+pageNum+'&bookId='+bookId );
    // encodeURIComponent('http://localhost:9090/getPdf?pdfName='+pdfName+'#'+pageNum) );
  }else{
    pdfWin.loadURL('file://' + __dirname + '/pdfviewer/web/viewer.html?file='+
    encodeURIComponent('http://localhost:9090/getPdf?pdfName='+bookName)+'#page='+pageNum+'&bookId='+bookId );
  }

}

function createHttpServer(){


  var server = http.createServer(function(req, res){

    let pathname = url.parse(req.url,true).pathname;

    if(pathname == '/getPdf'){
      let pdfName = url.parse(req.url,true).query.pdfName
      var filepath = path.join(constDict.bookPath,pdfName);
      fs.readFile(filepath, function (err, data) {
          if (err) {
              console.log("读取文件失败");
              res.write('404')
          } else {
              console.log("读取文件成功！");
              res.write(data);
          }
          res.end();
      });
    }
    else if(pathname == '/updatePage'){
      // get获取数据
      const {currPage,bookId} = url.parse(req.url,true).query

      request({
        url: constDict.serverHost+'/book/person/updateCurrPage',
        method: "POST",
        json: true,
        headers: {'Authorization': store.get('token')},
        body: {currPage: currPage,bookId:bookId}
      }, function(error, response, body) {
       
        res.end('updatePage')
      })

    }
    

  })
  server.listen('9090', '127.0.0.1');
}

async function createWindow() {
  
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1100,
    height: 707,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      nodeIntegration: true, // is default value after Electron v5
      contextIsolation: false, // protect against prototype pollution
      enableRemoteModule: true, //this must be true
      webSecurity: false,
      // preload: path.join(__dirname, 'preload.js'),
      // 插件支持
      plugins :true,
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    //  todo 加载pdf
    // await win.loadURL(path.join(__dirname, 'file/a.pdf#page=100'))
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)

    // const view = new BrowserView()
    // win.setBrowserView(view)
    // view.setBounds({ x: 300, y: 0, width: 500, height: 600 })
    // view.webContents.loadURL(path.join(__dirname, 'file/a.pdf#page=100'))


    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  if(isDevelopment){
    constDict.serverHost = 'http://localhost:18081'
  }

  createWindow()
  // 开启http服务器
  createHttpServer()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
