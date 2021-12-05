<template>
    <div>
        <h3>个人资料</h3>
        <a-form  :label-col="{span: 4,}" :wrapper-col="{span: 14,}">

        <a-form-item label="用户名">
            <a-input v-model:value="user.username" />
        </a-form-item>
        <a-form-item label="昵称">
            <a-input v-model:value="user.nickname" />
        </a-form-item>
        </a-form>
    </div>
</template>

<script>
export default {
    inject: ['$electronStore'],

    data(){
        return{
            user:{
                username:'',
                nickname:''
            }
        }
    },
    methods:{
        initUserData(){
            this.user = this.$electronStore.get('user')
        }
    },
    created(){
        this.initUserData()
    }

}
</script>

