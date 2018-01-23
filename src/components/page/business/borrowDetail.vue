<template>
	<div>
		<card>
			<div slot="header" class="from-query">
				商户借款详情
			</div>
			<div class="channel-info">
				<el-form label-position="left" class="form-table" label-width="100px">
					<el-form-item label="借款商户" :label-position="'right'">
						<span>{{ data.channelName }} {{ data.businessName }}</span>
					</el-form-item>
					<el-form-item label="合作方式" :label-position="'right'">
						<span>{{ data.cooperationWay }}</span>
					</el-form-item>
					<el-form-item label="借款金额" :label-position="'right'">
						<span>{{ data.borrowAccount }}元</span>
					</el-form-item>
					<el-form-item v-if="data.cooperationWay == 1" label="赠送金额" :label-position="'right'">
						<span>{{ data.giveAccount }}元</span>
					</el-form-item>
					<el-form-item label="商户折扣" :label-position="'right'">
						<span>{{ data.discount }}折</span>
					</el-form-item>
					<el-form-item label="实际应还金额" :label-position="'right'">
						<span>{{ data.repaymentAccount }}元</span>
					</el-form-item>
					<el-form-item label="借款期限" :label-position="'right'">
						<span>{{ data.borrowDays }}天</span>
					</el-form-item>
					<el-form-item label="借款日期" :label-position="'right'">
						<span>{{ data.borrowTime | moment('YYYY-MM-DD')}}</span>
					</el-form-item>
					<el-form-item label="消费者折扣" :label-position="'right'">
						<span>{{ data.consumerDiscount }}折</span>
					</el-form-item>
					<el-form-item label="最高优惠金额" :label-position="'right'">
						<span v-if="data.maxDiscount !== undefined">{{ data.maxDiscount }}元</span>
						<span v-else>--</span>
					</el-form-item>

					<el-form-item label="" :label-position="'right'">
						<el-button v-if="data.borrowStatus === 3" type="primary" @click="$router.push({ name: 'businessBorrowEdit', query: { id: data.id } })">
							编辑
						</el-button>
						<el-button type="default" @click="goBack">返回</el-button>
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
			return{
                data: {
                    id: '',
                    channelName: '',
                    businessName: '',
                    cooperationWay: '',
                    borrowAccount: '',
                    giveAccount: '',
                    discount: '',
                    repaymentAccount: '',
                    borrowDays: '',
                    borrowTime: '',
                    consumerDiscount: '',
                    maxDiscount: '',
				}
			}
		},
		mounted(){
            this.id = this.$route.query.id;
            this.getData();
		},
		methods: {
		    getData(){
                ajax({
                    method: 'get',
                    url: ajaxUrls.business.busBorrowGet,
                    data: {
                        id: this.id
					}
                }).then(data => {
                    this.data = data.data;
                })
			},
            goBack(){
		        history.back();
			}
		},
		components: {
            card
		}
	}
</script>

<style lang="scss">
	.form-table{
		padding: 0 20px;
		.el-form-item{
			margin-bottom: 0;
		}
	}
</style>