<template>
	<div>
		<card>
			<h2 slot="header" class="card-title">{{pageTitle}}</h2>
			<div class="edit-wrapper form-item__block">
				<el-form :model="data" :rules="dataRules" ref="formData" label-position="right" label-width="120px">
					<el-form-item prop="borrowFrom" label="借款来源">
						<el-input v-model="data.borrowFrom" auto-complete="off" placeholder="请输入这笔借款的来源，如钱庄网"></el-input>
					</el-form-item>
					<el-form-item prop="channelId" label="借款渠道">
						<el-select v-model="data.channelId" placeholder="请选择借款渠道">
							<el-option v-for="item in channelOptions" :label="item.name" :value="item.channelId" :key="item.channelId"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="borrowAccount" label="借款金额">
						<el-input v-model.number="data.borrowAccount" auto-complete="off" placeholder="借款金额不大于2千万">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item prop="borrowTime" label="借款日期">
						<el-date-picker
								v-model="data.borrowTime"
								type="date"
								:editable="false"
								:clearable="true"
								placeholder="请选择借款日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item prop="borrowDays" label="借款期限">
						<el-input v-model.number="data.borrowDays" auto-complete="off" placeholder="最多360天">
							<template slot="append">天</template>
						</el-input>
					</el-form-item>
					<el-form-item prop="repaymentInterest" label="应还利息">
						<el-input v-model.number="data.repaymentInterest" auto-complete="off" placeholder="应还利息不大于2千万">
							<template slot="append">元</template>
						</el-input>
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
    import {qryChannelAll} from 'common/qryUnit.js'
    import moment from 'moment'

	export default{
		data(){
			return{
			    id: '',
				channelId: '',
                channelOptions: [],
			    pageTitle: '',
			    data: {
                    borrowFrom: '',
                    channelId: '',
                    borrowAccount: '',
                    borrowTime: '',
                    borrowDays: '',
                    repaymentInterest: '',
				},
				dataRules: {
                    borrowFrom: [
						{required: true, message: '借款来源不能为空'},
                        {message: '输入内容不少于3个字', trigger: 'blur', min: 3}
					],
                    channelId: [
                        {required: true, message: '借款渠道不能为空', trigger: 'change'}
                    ],
                    borrowAccount: [
                        {required: true, message: '借款金额不能为空',},
                        {type: 'number', message: '输入格式不正确', trigger: 'blur'},
                        {type: 'number', message: '借款金额需大于0且不大于2千万', trigger: 'blur', min:1, max: 20000000},
                    ],
                    borrowTime: [
                        {required: true, type: 'date', message: '借款日期不能为空', trigger: 'change'}
                    ],
                    borrowDays: [
                        {required: true, message: '借款期限不能为空',},
                        {type: 'number', message: '借款期限1-360天', trigger: 'blur', min:1, max: 360}
                    ],
                    repaymentInterest: [
                        {required: true, message: '应还利息不能为空',},
                        {message: '输入格式不正确', type: 'number', trigger: 'blur'},
                        {type: 'number', message: '应还利息需大于0且不大于2千万', trigger: 'blur', min:1, max: 20000000},
                    ],
				},
				url: ''
			}
		},
		mounted(){
            this.channelId = this.$route.query.channelId;
            this.id = this.$route.query.id;
            qryChannelAll().then( data => {
                this.channelOptions = data.data;
            });
		    if(this.channelId){
                this.pageTitle = '编辑渠道借款';
				this.url = ajaxUrls.channel.upDateChaBorrow;
				this.getData();
			}else{
                this.pageTitle = '创建渠道借款';
                this.url = ajaxUrls.channel.addChaBorrow
			}
		},
		methods: {
            getData(){
                return ajax({
                    method: 'get',
					url: ajaxUrls.channel.getChaBorrow,
					data: {id: this.id}
				}).then(data => {
				    let borrowTime = new Date(data.data.borrowTime);
				    this.data = Object.assign(data.data, {borrowTime: borrowTime});
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
                let data = this.channelId ? Object.assign({channelId: this.channelId, id: this.id}, this.data) : this.data;

                return ajax({
                    method: 'post',
                    url: this.url,
                    data: Object.assign(data, {borrowTime: moment(this.data.borrowTime).format('YYYY-MM-DD')})
                }).then(data => {
                    if(data.code === 'success'){
                        this.goBack();
					}
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