// vue.config.js
module.exports = {
    pluginOptions: {
      electronBuilder: {
        // preload: 'src/preload.js',
        // nodeIntegration: true,
        // externals: ['electron'], // 这里是你使用的原生模块名字列表，改成自己的即可
        // nodeModulesPath: ['../../node_modules', './node_modules', '../node_modules']// 这里是多个node_modules路径，按自己需要配置即可
        // 打包参数配置
        builderOptions: {
          copyright: "Copyright © 2021", //版权信息
          asar: false,
          nsis:  {
            "oneClick": false, // 是否一键安装
            "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
            "allowToChangeInstallationDirectory": true, // 允许修改安装目录
            "installerIcon": "./public/favicon.ico", // 安装图标
            "uninstallerIcon": "./public/favicon.ico", //卸载图标
            "installerHeaderIcon": "./public/favicon.ico", // 安装时头部图标
            "createDesktopShortcut": true, // 创建桌面图标
            "createStartMenuShortcut": true, // 创建开始菜单图标
            "shortcutName": "CloudReader", // 图标名称
          },
          win: { //win相关配置
            icon: "./public/favicon.ico", //图标，当前图标在根目录下，注意这里有两个坑
            target: [{
                target: "nsis", //利用nsis制作安装程序
                arch: [
                    "x64", //64位
                    "ia32" //32位
                ]
            }]
          },
          linux: {
            icon: './public/favicon'
          },
          mac: {
              icon: './public/favicon512.ico'
          },
          "dmg": {
            "contents": [{
                    "x": 410,
                    "y": 150,
                    "type": "link",
                    "path": "/Applications"
                },
                {
                    "x": 130,
                    "y": 150,
                    "type": "file"
                }
              ]
          },
         
        }
      }
    },
    lintOnSave :false,
    devServer: {
        overlay: {
            warnings: false,
            errors: false
        },
      
    }
  }
