<template>
	<div>
		<card>
			<h2 slot="header" class="card-title">{{pageTitle}}</h2>
			<div class="edit-wrapper">
				<el-form :model="data" :rules="dataRules" ref="formData" label-position="right" label-width="120px">
					<el-form-item label="借款商户" required>
						<el-col :span="5">
							<el-form-item prop="channelId">
								<el-select v-model="data.channelId" placeholder="请选择渠道" @change="changeChannel">
									<el-option v-for="item in channelOptions" :label="item.name" :value="item.channelId" :key="item.channelId"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="1">&nbsp;</el-col>
						<el-col :span="5">
							<el-form-item prop="busId">
								<el-select v-model="data.busId" placeholder="请选择商户">
									<el-option v-for="item in busOptions" :label="item.name" :value="item.busId" :key="item.busId"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-form-item>
					<el-form-item label="合作方式" required>
						<el-radio-group v-model.number="data.cooperationWay" @change="watchCompute">
							<el-radio :label="1">方式一</el-radio>
							<el-radio :label="2">方式二</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item prop="borrowAccount" label="借款金额">
						<el-input v-model.number="data.borrowAccount" auto-complete="off" @keyup.native="watchCompute" placeholder="请输入商户借款金额">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item v-if="data.cooperationWay === 1" prop="giveAccount" label="赠送金额">
						<el-input v-model.number="data.giveAccount" auto-complete="off" @keyup.native="watchCompute" placeholder="请输入商户赠送金额">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item prop="discount" label="商户折扣" v-if="data.cooperationWay === 1">
						<el-input v-model.number="data.discount" disabled auto-complete="off" placeholder="系统自动算，不用填">
							<template slot="append">折</template>
						</el-input>
					</el-form-item>
					<el-form-item prop="discount" label="商户折扣" v-else>
						<el-input v-model.number="data.discount" auto-complete="off" @keyup.native="computeRepaymentAccount" placeholder="请输入1-10数字">
							<template slot="append">折</template>
						</el-input>
					</el-form-item>
					<el-form-item prop="repaymentAccount" label="实际应还金额">
						<el-input v-model="data.repaymentAccount" disabled auto-complete="off" placeholder="系统自动算，不用填">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item prop="borrowTime" label="借款日期">
						<el-date-picker
								v-model="data.borrowTime"
								type="date"
								:editable="false"
								:clearable="true"
								placeholder="选择日期"
								:picker-options="pickerOptions0">
						</el-date-picker>
					</el-form-item>
					<el-form-item prop="borrowDays" label="借款期限">
						<el-input v-model.number="data.borrowDays" auto-complete="off" placeholder="最多360天">
							<template slot="append">天</template>
						</el-input>
					</el-form-item>
					<el-form-item prop="consumerDiscount" label="消费者折扣">
						<el-input v-model.number="data.consumerDiscount" auto-complete="off" @keyup.native="computeRepaymentAccount" placeholder="请输入1-10数字">
							<template slot="append">折</template>
						</el-input>
					</el-form-item>
					<el-form-item prop="maxDiscount" label="最高优惠金额">
						<el-input v-model.number="data.maxDiscount" auto-complete="off" placeholder="请输入每笔订单的最高优惠金额">
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
	import moment from 'moment'
	import card from 'components/layout/card.vue'
	import ajax from 'common/ajax.js'
    import ajaxUrls from 'common/ajaxUrls.js'
    import {qryChannelAll, qryBusAll} from 'common/qryUnit.js'

	export default{
		data(){
		    let validateConsumerDiscount = (rule, value, callback) => {
                if (value < this.data.discount) {
                    callback(new Error('消费者折扣不能小于商户折扣!'));
                } else {
                    callback();
                }
			};
		    let integer = (rule, value, callback) => {
		        if (/^\d*$/.test(value) && value !== 0) {
                    callback();
                } else {
                    callback(new Error('请填写大于零的正整数!'));
                }
            };
		    let validateBorrowAccount = (rule, value, callback) => {
		        value = value.toString();
                if (/^(?:[1-9]\d*|0\.\d{1,2}|[1-9]\d*\.\d{1,2})$/.test(value)) {
                    if(this.data.borrowAccount !== '' && this.data.cooperationWay === 1){
                        this.$refs.formData.validateField('giveAccount');
					}

                    callback();
                } else {
                    callback(new Error('请填写大于零的数,且最多保持两位小数!'));
                }
            };
            let validateGiveAccount = (rule, value, callback) => {
                value = value.toString();
                if (/^(?:[1-9]\d*|0\.\d{1,2}|[1-9]\d*\.\d{1,2}|0)$/.test(value)) {
                    if(value < this.data.borrowAccount){
                        callback();
					}else{
                        callback(new Error('赠送金额应小于借款金额!'));
					}
                } else {
                    callback(new Error('请填写大于或等于零的数,且最多保持两位小数!'));
                }
            };
			return{
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                id: '',
			    pageTitle: '',
			    data: {
                    channelId: '',
                    busId: '',
                    cooperationWay: 1,
                    borrowAccount: '',
                    giveAccount: '',
                    discount: '',
                    repaymentAccount: '',
                    borrowDays: '',
                    borrowTime: '',
                    consumerDiscount: '',
                    maxDiscount: '',
				},
				dataRules: {
                    channelId: [
						{required: true, message: '借款渠道不能为空', trigger: 'change'}
					],
                    busId: [
						{required: true, message: '借款商户不能为空', trigger: 'change'}
					],
                    borrowAccount: [
                        {required: true, message: '借款金额不能为空'},
                        {validator: validateBorrowAccount, trigger: 'blur' }
					],
                    giveAccount: [
                        {required: true, message: '赠送金额不能为空'},
                        {validator: validateGiveAccount, trigger: 'blur' }
                    ],
                    discount: [
                        {type: 'number', required: true, message: '商户折扣不能为空', trigger: 'blur'},
                        {type: 'number', message: '只能输入1-10之间的数字', min: 1, max: 10, trigger: 'blur'},
					],
                    repaymentAccount: [
                        {required: true, message: '实际应还金额不能为空', trigger: 'blur'}
					],
                    borrowDays: [
                        {required: true, type: 'number', message: '借款期限不能为空', trigger: 'blur'},
                        {type: 'number', message: '最少1天,最多360天', trigger: 'blur', min:1, max: 360}
					],
                    borrowTime: [
                        {required: true, type: 'date', message: '借款日期不能为空', trigger: 'change'}
                    ],
                    consumerDiscount: [
                        {required: true, type: 'number',message: '消费折扣不能为空', trigger: 'blur'},
                        {type: 'number', message: '只能输入1-10之间的数字', min: 1, max: 10, trigger: 'blur'},
                        {validator: validateConsumerDiscount, trigger: 'blur' }
					],
                    maxDiscount: [
                        {validator: integer, trigger: 'blur'}
					],
				},
				url: '',
                busOptions: [],
                channelOptions: [],
				editInit: false,
				editWatch: false
			}
		},
		mounted(){
            this.id = this.$route.query.id;
            qryChannelAll().then( data => {
                this.channelOptions = data.data
            });
//            qryBusAll().then( data => {
//                this.busOptions = data.data;
//            });
		    if(this.id){
                this.pageTitle = '编辑商户借款';
				this.url = ajaxUrls.business.busBorrowUpdate;
				this.editInit = true;
				this.editWatch = true;
				this.getData()
			}else{
                this.pageTitle = '创建商户借款';
                this.url = ajaxUrls.business.busBorrowAdd
			}

		},
		methods: {
            changeChannel(){
                if(this.editInit){
                    this.editInit = false;
				}else{
                    this.data.busId = '';
				}
                qryBusAll(this.data.channelId).then( data => {
                    this.busOptions = data.data;
                });
			},
		    checkType(num){
		        num = String(num);
		        return (/^\d+\.?\d*$/g.test(num))
			},
			watchCompute(){
		        if(this.editWatch){
		            this.editWatch = false;
		            return false;
		        }
		        this.computeDiscount();
		        this.computeRepaymentAccount();
			},
            computeDiscount(){
                if(this.data.cooperationWay === 1){
					let borrowAccount = this.data.borrowAccount,
                        giveAccount = this.data.giveAccount;
                    if(borrowAccount && borrowAccount!==0 &&
                        this.checkType(borrowAccount) && this.checkType(giveAccount)){
                        this.data.discount = (borrowAccount/(borrowAccount + giveAccount) * 10).toFixed(1)*1;
                    }else{
                        this.data.discount = '';
                    }
				}else{
                    this.data.discount = '';
				}
			},
			computeRepaymentAccount(){
                let borrowAccount = this.data.borrowAccount,
                    giveAccount = this.data.giveAccount,
                    discount = this.data.discount,
					consumerDiscount = this.data.consumerDiscount;
                if(consumerDiscount && consumerDiscount!==0 && this.checkType(consumerDiscount)){
                    if(this.data.cooperationWay === 1){
                        this.data.repaymentAccount = ((borrowAccount+giveAccount)*consumerDiscount*0.1).toFixed(2)
					}else{
                        if(discount<=10 && discount>=1){
                            this.data.repaymentAccount = ((borrowAccount/discount)*consumerDiscount).toFixed(2)
						}else{
                            this.data.repaymentAccount = ''
                        }
					}
				}else{
                    this.data.repaymentAccount = '';
				}
			},
            getData(){
                return ajax({
                    method: 'get',
					url: ajaxUrls.business.busBorrowGet,
					data: {id: this.id}
				}).then(data => {
				    data = data.data;
				    data.borrowTime = new Date(data.borrowTime);
				    data.repaymentAccount = data.repaymentAccount.toFixed(2);
				    data.maxDiscount = data.maxDiscount || '';
				    this.data = data;
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
                let borrowTime = moment(this.data.borrowTime).format('YYYY-MM-DD');
                let data = this.id ? Object.assign({id: this.id}, this.data) : Object.assign({}, this.data);
                data = Object.assign(data, {borrowTime: borrowTime});
                this.send(data)
			},
			send(data){
                ajax({
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