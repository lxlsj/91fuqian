<template>
	<div>
		<card>
			<h2 slot="header" class="card-title">{{pageTitle}}</h2>
			<div class="edit-wrapper">
				<el-form :model="data" :rules="dataRules" ref="formData" label-position="right" label-width="120px">
					<el-form-item prop="name" label="渠道名称">
						<el-input v-model="data.name" auto-complete="off" placeholder="渠道名称不超过15个字"></el-input>
					</el-form-item>
					<el-form-item prop="direcor" label="渠道负责人">
						<el-input v-model="data.direcor" auto-complete="off" placeholder="姓名至少2个字"></el-input>
					</el-form-item>
					<el-form-item prop="phone" label="负责人手机号">
						<el-input v-model="data.phone" auto-complete="off" placeholder="请输入渠道负责人手机号"></el-input>
					</el-form-item>
					<el-form-item prop="creditLines" label="授信额度">
						<el-input v-model="data.creditLines" :disabled="!!channelId" auto-complete="off" placeholder="请输入渠道的借款额度">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item prop="companyName" label="企业名称">
						<el-input v-model="data.companyName" auto-complete="off" placeholder="企业名称不少于4个字"></el-input>
					</el-form-item>
					<el-form-item prop="legalPerson" label="法人姓名">
						<el-input v-model="data.legalPerson" auto-complete="off" placeholder="姓名至少2个字"></el-input>
					</el-form-item>
					<el-form-item prop="legalPersonId" label="法人身份证号">
						<el-input v-model="data.legalPersonId" auto-complete="off" placeholder="请输入法人身份证号"></el-input>
					</el-form-item>
					<el-form-item prop="alipayNum" label="支付宝账户">
						<el-input v-model="data.alipayNum" auto-complete="off" placeholder="请输入企业支付宝账号"></el-input>
					</el-form-item>
					<el-form-item prop="wechatNum" label="微信账户">
						<el-input v-model="data.wechatNum" auto-complete="off" placeholder="请输入企业微信账号"></el-input>
					</el-form-item>
					<el-form-item label="">
						<el-button type="primary" @click="submitData">提交</el-button>
						<el-button @click="goBack">返回</el-button>
					</el-form-item>
				</el-form>
			</div>
		</card>
	</div>
</template>

<script>
	import card from 'components/layout/card.vue'
	import ajax from 'common/ajax.js'
    import ajaxUrls from 'common/ajaxUrls.js'

	export default{
		data(){
            let validatePhone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('负责人手机号不能为空'));
                } else if( !/^1\d{10}$/.test(value) ){
                    callback(new Error('请输入正确的手机号'));
                }else{
                    callback();
				}
            };
            let validateCreditLines = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('总额度不能为空'));
                } else if( !/^[1-9]\d*$/.test(value) ){
                    callback(new Error('输入内容格式不正确'));
                }else{
                    callback();
                }
            };
            let validatePayNo = (rule, value, callback) => {
                if(value === '' || /^1\d{10}$/.test(value) || /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/.test(value)){
                    callback();
                }else{
                    callback(new Error('账户格式不正确'));
                }
            };

            let name = (rule, value, callback) => {
                if(/^([\u4e00-\u9fa5]|[a-zA-Z])+$/.test(value) || value === ''){
                    callback();
                }else{
                    callback(new Error('只能输入汉字，英文'));
                }
            };

			return{
                channelId: '',
			    pageTitle: '',
			    data: {
                    name: '',
                    direcor: '',
                    phone: '',
                    creditLines: '',
                    companyName: '',
                    legalPerson: '',
                    legalPersonId: '',
                    alipayNum: '',
                    wechatNum: ''
				},
				dataRules: {
					name: [
						{required: true, message: '渠道名称不能为空', trigger: 'blur'},
                        {message: '渠道名称为2-15个字', trigger: 'blur', min: 2, max: 15}
					],
                    direcor: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'},
                        {message: '姓名为2-15个字', trigger: 'blur', min: 2, max: 15},
                        { validator: name, trigger: 'blur' }
                    ],
                    phone: [
                        {required: true, message: '负责人手机号不能为空', trigger: 'blur'},
                        { validator: validatePhone, trigger: 'blur' }
                    ],
                    creditLines: [
                        {required: true, validator: validateCreditLines, trigger: 'blur' }
                    ],
                    companyName: [
                        {message: '企业名称不少于4个字', trigger: 'blur', min: 4}
                    ],
                    legalPerson: [
                        {message: '法人姓名为2-15个字', trigger: 'blur', min: 2, max: 15},
                        { validator: name, trigger: 'blur' }
                    ],
                    legalPersonId: [
                        {message: '身份证号格式不正确', trigger: 'blur', min: 15, max: 18}
                    ],
                    alipayNum: [
                        {validator: validatePayNo, trigger: 'blur' }
                    ],
                    wechatNum: [
                        {validator: validatePayNo, trigger: 'blur' }
                    ],
				},
				url: ''
			}
		},
		mounted(){
            this.channelId = this.$route.query.channelId;
		    if(this.channelId){
                this.pageTitle = '编辑渠道信息';
				this.url = ajaxUrls.channel.update;
				this.getData();
			}else{
                this.pageTitle = '创建渠道';
                this.url = ajaxUrls.channel.add
			}
		},
		methods: {
            getData(){
                return ajax({
                    method: 'get',
					url: ajaxUrls.channel.detail,
					data: {channelId: this.channelId}
				}).then(data => {
				    this.data = data.data;
				}).catch(e => {
                    this.$message.error(e.msg);
                })
			},
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
                let data = this.channelId ? Object.assign({channelId: this.channelId}, this.data) : this.data;
                return ajax({
                    method: 'post',
                    url: this.url,
                    data: data
                }).then(data => {
                    this.goBack();
                }).catch(e => {
                    this.$message.error(e.msg);
                })
			},
			goBack(){
                history.back();
			}
		},
		components:{
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
</style>