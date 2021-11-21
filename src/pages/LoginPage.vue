<template>
  <a-form
    layout="inline"
    :model="formState"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
  >
    <a-form-item>
      <a-input v-model:value="formState.user" placeholder="Username">
        <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="formState.password" type="password" placeholder="Password">
        <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button
        type="primary"
        html-type="submit"
        :disabled="formState.user === '' || formState.password === ''"
      >
        Log in
      </a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

export default {
    inject: ['$axios','$electronStore','$serverHost'],
    components: {
        UserOutlined,
        LockOutlined,
    },
    data(){
        return{
            formState:{
                user: '',
                password: '',
                }
        }
    },
    methods: {

        handleFinish( values){
            
            this.$axios.post(
              this.$serverHost+'/login', 
              {username:this.formState.user,password:this.formState.password})
                .then(res=>{
                    if(res.data.code == 200){
                        message.success('登录成功');
                        const token = res.data.token
                        
                        // 获取个人信息
                        this.$axios.get(this.$serverHost+'/getInfo',
                          {
                              headers: {
                              'Authorization': token
                              }
                          })
                          .then(userInfo=>{
                    
                            this.$electronStore.set('token',token)
                            this.$electronStore.set('user',userInfo.data.user)
                            this.$router.push('/home')

                          })

                        
                    }else{
                        message.error(res.data.msg);
                    }
                })
        },

        handleFinishFailed(errors) {
            console.log(errors);
        }
    },




}
</script>