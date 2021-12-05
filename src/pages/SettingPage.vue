<template>
    <div>
        <h3>系统设置</h3>
        <a-form  :label-col="{span: 4,}" :wrapper-col="{span: 14,}">

        <a-form-item label="书籍缓存路径">
            <a-input v-model:value="bookPath" />
        </a-form-item>
        <a-form-item label="服务器地址">
            <a-input v-model:value="serverHost" />
        </a-form-item>
        </a-form>
    </div>
</template>

<script>
export default {
    inject: ['$electronStore'],

    data(){
        return{
            bookPath:'',
            serverHost:'',
        }
    },
    methods:{
        initSettingData(){
            this.bookPath = this.$electronStore.get('bookPath')
            this.serverHost = this.$electronStore.get('serverHost')
        }
    },
    created(){
        this.initSettingData()
    }

}
</script>

