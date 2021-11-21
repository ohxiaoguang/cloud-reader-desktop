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
                    
                    :src="val.cover||'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.soutu123.com%2Fback_pic%2F04%2F60%2F35%2F72586ca222efe89.jpg%21%2Ffw%2F700%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue&refer=http%3A%2F%2Fpic.soutu123.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640090844&t=79e394204c1b210298f0a74cc7693310'"
                    />
                    <a-card-meta :title="val.bookName">
                        <template #description>
                            <CloudDownloadOutlined v-if="!val.isDown" :id="`download${val.id}`" @click="downloadBook(val.id,val.fileName)"/>
                            <a-button v-if="val.isDown" style="float:right" type="primary" size="small" @click="openPdf(val.fileName)">阅读</a-button>
                        </template>
                    </a-card-meta>
                
                </a-card>
            
        </a-row>

  </div>
</template>

<script>
import {CloudUploadOutlined,CloudDownloadOutlined,SmileOutlined}  from '@ant-design/icons-vue'
import { notification  } from 'ant-design-vue';
import {  h } from 'vue';


export default {
    inject: ['$axios','$constDict','$ipcRenderer','$path','$serverHost','$fs','$electronStore'],
    components: {
        CloudUploadOutlined,CloudDownloadOutlined
    },
    data(){
        return{
            books:[],
            value:''
        }
    },
    methods:{
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
                headers: {
                'Authorization': this.$electronStore.get('token')
                }
            })
            .then(res=>{
                const result = res.data
                this.books = result.data.list
                this.loadLocalBooks()
            })
            .catch(err=>{
                console.log(err);
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
        openPdf(filename){
            this.$ipcRenderer.send('open-pdf',filename,'1')
                
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