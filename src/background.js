'use strict'

import { app, protocol, BrowserWindow,BrowserView,ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const path = require('path')
const fs = require('fs')
var url = require("url");
var http = require("http");
var request = require('request');
const os = require('os')

const Store =  require('electron-store');
const store = new Store()

if(!store.has('bookPath')){
  store.set("bookPath",path.join(os.homedir(),'cloud_reader_desktop','books'))
}
if(!store.has('serverHost')){
  store.set("serverHost",'http://110.42.188.51')
}


// 初始化文件目录
if(!fs.existsSync(store.get('bookPath'))){
  fs.mkdir(store.get('bookPath'),{recursive:true},(err)=>{
    if(err){
        console.log('创建目录错误：',store.get('bookPath'));
        throw err;
    }else{
        console.log('创建目录成功：',store.get('bookPath'));
    }
  });
}




const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

ipcMain.on('download-book',function(event,id,bookName){
  console.log(bookName)
  downloadFile(store.get('serverHost')+'/book/rangePreview/'+id,bookName,function(){
    console.log('下载成功:',bookName)
    event.reply('download-book-reply', 'success')
  });
  
})

ipcMain.on('open-pdf', function(event, pdfUrl,pageNum,bookId) {
  openPdfWin(pdfUrl,pageNum,bookId)
});

function downloadFile(uri,filename,callback){
  let stream = fs.createWriteStream(path.join(store.get('bookPath'), filename));
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
      var filepath = path.join(store.get('bookPath'),pdfName);
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
      const {currPage,bookId,pagesCount} = url.parse(req.url,true).query

      request({
        url: store.get('serverHost')+'/book/person/updateCurrPage',
        method: "POST",
        json: true,
        headers: {'Authorization': store.get('token')},
        body: {currPage: currPage,bookId:bookId,pagesCount:pagesCount}
      }, function(error, response, body) {
       
        res.end('updatePage')
      })

    }
    

  })
  server.listen('9090', '127.0.0.1');
}

async function createWindow() {
  
  const win = new BrowserWindow({
    width: 1100,
    height: 707,
    webPreferences: {
      
      nodeIntegration: true, // is default value after Electron v5
      contextIsolation: false, // protect against prototype pollution
      enableRemoteModule: true, //this must be true
      webSecurity: false,
      // 插件支持
      plugins :true,
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {

    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)

  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
}

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})


app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  if(isDevelopment){
    store.set("serverHost",'http://localhost:18081')
  }

  createWindow()
  // 开启http服务器
  createHttpServer()
})

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
