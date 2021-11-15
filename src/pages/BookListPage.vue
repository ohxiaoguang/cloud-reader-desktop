<template>
  <div style="background-color: #ececec; padding: 20px;">

      <a-row :gutter="16" style="margin-left: -3px;margin-right: 0px;">
        <a-col class="gutter-row" :span="2">
            <a-button >
                <template #icon>
                <CloudUploadOutlined />
                </template>
            </a-button>
        </a-col>
        <a-col class="gutter-row" :span="6">
            <a-progress :percent="30" />
        </a-col>
        <a-col class="gutter-row" :span="9">
            <span>云空间：300M/1G</span>
        </a-col>
        <a-col class="gutter-row" :span="6">
            
            <a-input-search
                v-model:value="value"
                placeholder="搜索"
                @search="onSearch"
                />
        </a-col>
        </a-row>

       


       <a-row >
        
                <a-card  hoverable style="width: 150px;margin:5px" v-for="(val,key) in books" :key="key" >
                    <img
                    style="width:100%"
                    slot="cover"
                    
                    :src="val.cover"
                    />
                    <a-card-meta :title="val.bookName">
                        <template #description>
                            <CloudDownloadOutlined />
                            <a-button style="float:right" type="primary" size="small" @click="openPdf">阅读</a-button>
                        </template>
                    </a-card-meta>
                
                </a-card>
            
        </a-row>

  </div>
</template>

<script>
 import axios from 'axios';

 const {remote} = window.require('electron')
 const fs = window.require('fs')

// const ipcRenderer  = window.ipcRenderer 
const { ipcRenderer } =window.require('electron') 
const path = window.require("path")

var fileDirPath = "D:\\Code\\electron\\cloud-reader-desktop\\dist_electron\\file";
// var fileDirPath = path.join(__dirname, "file");
import {CloudUploadOutlined,CloudDownloadOutlined}  from '@ant-design/icons-vue'
export default {
    components: {
        CloudUploadOutlined,CloudDownloadOutlined
    },
    data(){
        return{
            books:[],
            value:''
        }
    }
    ,

    methods:{
        onSearch(searchValue){
            console.log(searchValue)
            console.log(this.value)
        },
        fetchBooks(){
            axios.get('http://110.42.188.51/book/page')
            .then(res=>{
                const result = res.data
                // console.log(result)
                this.books = result.data.list
                // this.dataList = res.data;
            })
            .catch(err=>{
                console.log(err);
            })
        },
        openPdf(){
            ipcRenderer.send('open-pdf',path.join(fileDirPath, 'a.pdf#page=101'))
        },
    }
    ,

    created(){
        this.fetchBooks()
    }
}
</script>
<style scoped>
    .ant-card-body {
        padding: 6px !important;
    }
</style>