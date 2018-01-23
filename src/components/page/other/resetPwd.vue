<template>
	<div>
		<card>
			<h2 slot="header" class="card-title">商户APP登录密码重置</h2>
			<div class="edit-wrapper">
				<el-form :model="data" :rules="dataRules" ref="formData" label-position="right" label-width="120px">
					<el-form-item prop="phone" label="登录名">
						<el-input v-model="data.phone" auto-complete="off" placeholder="请输入要重置的商户负责人手机号"></el-input>
					</el-form-item>
					<el-form-item prop="password" label="新密码">
						<el-input v-model="data.password" type="password" auto-complete="off" placeholder="密码长度6-20个字符，区分大小写"></el-input>
					</el-form-item>
					<el-form-item label="">
						<el-button type="primary" @click="submitData">立即提交</el-button>
					</el-form-item>
				</el-form>
			</div>
		</card>
	</div>
</template>

<script>
	import sidebar from 'components/layout/sidebar.vue'
	import card from 'components/layout/card.vue'
	import ajax from 'common/ajax.js'
    import ajaxUrls from 'common/ajaxUrls.js'
    import encryptedPwd from 'common/encryptPwd.js'

	export default{
		data(){
            let validatePhone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('登录名不能为空'));
                } else if( !/^1\d{10}$/.test(value) ){
                    callback(new Error('请输入正确的手机号'));
                }else{
                    callback();
                }
            };
			return{
			    data: {
                    password: '',
                    phone: '',
				},
				dataRules: {
                    phone: [
                        {required: true, message: '登录名不能为空', trigger: 'blur'},
                        { validator: validatePhone, trigger: 'blur' }
                    ],
                    password: [
                        {required: true, message: '新密码不能为空', trigger: 'blur'},
                        {message: '密码长度6-20个字符，区分大小写', trigger: 'blur', min: 6, max: 20}
					],
				},
			}
		},
		mounted(){
		},
		methods: {

            submitData(){
                this.$refs.formData.validate((valid) => {
                    if (valid) {
                        this.sendData();
                    } else {
                        return false;
                    }
                });

			},
			sendData(){
                return ajax({
                    method: 'post',
                    url: ajaxUrls.other.resetPwd,
                    data: {
                        phone: encryptedPwd(this.data.phone),
                        password: encryptedPwd(this.data.password)
					}
                }).then(data => {
                    this.$alert('密码重置成功', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.data.phone = '';
                            this.data.password = '';
                        }
                    });
                }).catch(e => {
                    this.$message.error(e.msg);
				})
			}
		},
		components:{
			sidebar,
			card
		}
	}
</script>

<style lang="scss">
	.edit-wrapper{
		padding: 0 20px;
	}
	.card-title{
		padding: 0 20px;
		line-height: 36px;
		font-size: 18px;
	}
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #20a0ff;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>