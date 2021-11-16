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
                            <CloudDownloadOutlined :id="`download${val.id}`" @click="downloadBook(val.id,val.bookName+'.'+val.fileType)"/>
                            <a-button style="float:right" type="primary" size="small" @click="openPdf('zzg_'+val.bookName+'.'+val.fileType)">阅读</a-button>
                        </template>
                    </a-card-meta>
                
                </a-card>
            
        </a-row>

  </div>
</template>

<script>

// const ipcRenderer  = window.ipcRenderer 



// var fileDirPath = "D:\\Code\\electron\\cloud-reader-desktop\\dist_electron\\file";
// var fileDirPath = path.join(__dirname, "file");
import {CloudUploadOutlined,CloudDownloadOutlined,SmileOutlined}  from '@ant-design/icons-vue'
import { notification  } from 'ant-design-vue';
import {  h } from 'vue';


export default {
    inject: ['$axios','$constDict','$ipcRenderer','$path','$serverHost'],
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
        downloadBook(id,bookName){
            const key = 'updatable';
            
            notification.open({
                key,
                message: '正在下载...',
                description: bookName,
                duration: 0,
                placement:'bottomRight',
                // style: {
                //     width: '300px',
                //     marginRight: `${0}px`,
                // },
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
                    }
                })
            this.$ipcRenderer.send('download-book',id,'zzg_'+bookName)
            
            // console.log(bookPath)
            // console.log(this.$constDict.filePath)
        },
        onSearch(searchValue){
            console.log(searchValue)
            console.log(this.value)
        },
        fetchBooks(){
            this.$axios.get(this.$serverHost+'/book/page')
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
        openPdf(filename){
            this.$ipcRenderer.send('open-pdf',filename,'1')
                
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