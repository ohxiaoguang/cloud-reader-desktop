<template>
  <div style="background-color: #ececec; padding: 20px;">
       <a-row >
        
                <a-card hoverable style="width: 180px;margin:5px" v-for="(val,key) in books" :key="key" @click="openPdf">
                    <img
                    style="width:100%"
                    slot="cover"
                    alt="example"
                    :src="val.cover"
                    />
                    <a-card-meta :title="val.bookName">

                    </a-card-meta>
                    
                </a-card>
            
        </a-row>

  </div>
</template>

<script>
 import axios from 'axios';

 const fileDirPath = window.fileDirPath
const ipcRenderer  = window.ipcRenderer 
const path = window.path

export default {
    data(){
        return{
            books:[]
        }
    }
    ,

    methods:{
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