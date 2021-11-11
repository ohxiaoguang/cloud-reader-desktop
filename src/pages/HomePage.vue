<template>
 <div class="ds_layout">
    <a-layout>
      <a-layout-sider theme="light">
        <div class="logo" >
          <img height="60px" src="../assets/logo.png">
        </div>
        <div class="aside">
      <a-menu  mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="1" @click="menuClick('/books')">
          <a-icon type="user" />
          <span>书架</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="video-camera" />
          <span>个人</span>
        </a-menu-item>
        <a-menu-item key="3"  @click="menuClick('/setting')">
          <a-icon type="upload" />
          <span>设置</span>
        </a-menu-item>
      </a-menu>

        </div>

      </a-layout-sider>
      <a-layout>
<!--        <a-layout-header>Header</a-layout-header>-->
        <a-layout-content>
          <router-view></router-view>
        </a-layout-content>
        <a-layout-footer>
          <div class="footer">
            ©2020-2021
          </div>
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>

  <!-- <div>
    <button  @click="openPdf">打开pdf</button>
  </div> -->
</template>

<script>
 import axios from 'axios';

const fileDirPath = window.fileDirPath
const ipcRenderer  = window.ipcRenderer 
const path = window.path


export default {
  components: {
    
  },
  name: 'HelloWorld',
  props: {
    
  },
  data(){
    return{
      text:'',
      collapsed: false,
    }
  },
  methods: {
    menuClick (path) {
      this.$router.push(path)
    },





    // readFile(){
    //   const fs = window.fs
    //   let data = fs.readFileSync(fileDirPath+'/a.pdf','utf8')
    //   console.log(data)
    //   this.text = data
    // } ,
    downFile(url, fileName) {
          const request = window.request
          const fs = window.fs

            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let stream = fs.createWriteStream(path.join(fileDirPath, fileName));
                    request(url).pipe(stream).on("close", function (err) {
                        console.log("下载成功");
                    });
                } else {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(response);
                    }
                }
            });
      
    }
  },
  created(){
    // this.downFile("http://110.42.188.51/book/preview/1","a.pdf")
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.ds_layout {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  }
.ds_layout  .ant-layout-has-sider{
    border:1px solid #eee;
  }
.ds_layout  .ant-layout-sider-children{
    border-right:1px solid #eee;
  }
.ds_layout  .ant-layout{
    height:100%
  }
.ds_layout  .logo{
    padding:5px;
    border-bottom: #eee solid 1px;
    height:60px;
     }
 .ds_layout  .logo   img{
      height:100%
    }
 
  .ds_layout .ant-layout-footer{
    padding:10px;
    text-align: center;
    border-top:#d6d4d4 solid 1px;
  }
  .ds_layout .ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left{
    border:0;
  }

</style>
