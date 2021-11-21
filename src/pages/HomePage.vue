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
          <FileSearchOutlined />
          <span>书架</span>
        </a-menu-item>
        <a-menu-item key="2">
          <MehOutlined />
          <span>个人</span>
        </a-menu-item>
        <a-menu-item key="3"  @click="menuClick('/setting')">
          <SettingOutlined />
          <span>设置</span>
        </a-menu-item>
        <a-menu-item key="4"  @click="menuClick('/login')">
          <LogoutOutlined />
          <span>退出</span>
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

import {SettingOutlined,MehOutlined,FileSearchOutlined,LogoutOutlined} from '@ant-design/icons-vue'

export default {
  components: {
    SettingOutlined,MehOutlined,FileSearchOutlined,LogoutOutlined
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



  },
  created(){

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
  min-height: 607px;
  }
.ds_layout  .ant-layout-has-sider{
    border:1px solid #eee;
    min-height: 607px;
  }
.ds_layout  .ant-layout-sider-children{
    border-right:1px solid #eee;
  }
.ds_layout  .ant-layout{
    height:100%;
    min-height: 607px;
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
