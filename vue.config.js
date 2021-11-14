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
          nsis: {},
          asar: false,
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
