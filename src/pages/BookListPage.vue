<template>
  <div style="background-color: #ececec; padding: 20px;">

      <a-row :gutter="16" style="margin-left: -3px;margin-right: 0px;">
        <a-col class="gutter-row" :span="2">
             <a-upload
                v-model:file-list="fileList"
                name="file"
                accept="application/pdf"
                :multiple="false"
                :action="uploadUrl"
                :headers="headers"
                @change="uploadHandle"
            >
                <a-button >
                    <template #icon>
                    <CloudUploadOutlined/>
                    </template>
                </a-button>
            </a-upload>
            
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

       

        <div style="height:500px">
            <a-row >
                <a-card  hoverable style="width: 150px;margin:5px" v-for="(val,key) in books" :key="key" >
                    <img
                    style="width:100%"
                    slot="cover"
                    :src="val.cover||defaultCover"
                    />
                    <a-card-meta :title="val.bookName">
                        <template #description>
                            <CloudDownloadOutlined v-if="!val.isDown" :id="`download${val.id}`" @click="downloadBook(val.id,val.fileName)"/>
                            <a-button v-if="val.isDown" style="float:right" type="primary" size="small" @click="openPdf(val)">阅读</a-button>
                        </template>
                    </a-card-meta>
                
                </a-card>
            </a-row>
        </div>

        <a-pagination v-model:current="current" :total="total" show-less-items />

  </div>
</template>

<script>
import {CloudUploadOutlined,CloudDownloadOutlined,SmileOutlined}  from '@ant-design/icons-vue'
import { notification,message  } from 'ant-design-vue';
import {  h } from 'vue';

import defaultCover from '../assets/default_cover.png'
export default {
    inject: ['$axios','$constDict','$ipcRenderer','$path','$serverHost','$fs','$electronStore'],
    components: {
        CloudUploadOutlined,CloudDownloadOutlined
    },
    data(){
        return{
            books:[],
            value:'',
            defaultCover:defaultCover,
            fileList:[],
            headers: {
                authorization: this.$electronStore.get('token'),
            },
            uploadUrl:this.$serverHost+'/book/upload',
            current:1,
            total:0
        }
    },
    watch: {
        current: function (val) {
            this.fetchBooks()
        },
    },
    methods:{
        uploadHandle(info){
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }

            if (info.file.status === 'done') {
                 notification['success']({
                            message: '上传成功',
                            description: info.file.name,
                            duration: 5,
                            placement:'bottomRight'
                            });

                this.fetchBooks()
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        },
        downloadBook(id,bookName){
            const key = 'updatable';
            
            notification.open({
                key,
                message: '正在下载...',
                description: bookName,
                duration: 0,
                placement:'bottomRight',
                icon: h(SmileOutlined, { style: 'color: #108ee9' }),

            });
            this.$ipcRenderer.on('download-book-reply', (event, arg) => {
                    if(arg == 'success'){
                        notification['success']({
                            key,
                            message: '下载完成',
                            description: bookName,
                            duration: 5,
                            placement:'bottomRight'
                            });
                        for(const book of this.books){
                            if(bookName == book.fileName){
                                book.isDown = true
                            }
                        }    
                    }
                })
            this.$ipcRenderer.send('download-book',id,bookName)
            
        },
        onSearch(searchValue){
            console.log(searchValue)
            console.log(this.value)
        },
        fetchBooks(){
            this.$axios.get(this.$serverHost+'/book/person/'+this.$electronStore.get('user').id,
            {
                headers:this.headers,
                params: {
                    pageNum: this.current,
                    pageSize: 10                }
            })
            .then(res=>{
                const result = res.data
                this.books = result.data.list
                this.total = result.data.total
                this.loadLocalBooks()
            })
            .catch(err=>{
                message.error("获取图书列表错误");
            })
        },

        loadLocalBooks(){
            const that = this
            
            this.$fs.readdir(this.$constDict.bookPath,'utf8',function(err,data){
                for(const localItem of data){
                    
                    for(const cloudItem of that.books){
                        if(localItem == cloudItem.fileName){
                            cloudItem.isDown = true
                        }
                    }
                }
            })
        },
        openPdf(file){

             this.$axios.get(this.$serverHost+'/book/person/personBook/'+file.bookId,
            {
                headers:this.headers
            })
            .then(res=>{
                
                this.$ipcRenderer.send('open-pdf',file.fileName,res.data.data.currPage,file.bookId)
            })
            .catch(err=>{
                message.error("获取当前页码错误");
            })
                  
        },
    },
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