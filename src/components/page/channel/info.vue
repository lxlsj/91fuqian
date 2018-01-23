<template>
	<div class="channel-info">
		<el-form label-position="left" class="form-table" label-width="100px">
			<el-form-item label="渠道ID" :label-position="'right'">
				<span>{{ data.channelId }}</span>
			</el-form-item>
			<el-form-item label="渠道名称" :label-position="'right'">
				<span>{{ data.name }}</span>
			</el-form-item>
			<el-form-item label="渠道负责人" :label-position="'right'">
				<span>{{ data.direcor }}</span>
			</el-form-item>
			<el-form-item label="负责人手机号" :label-position="'right'">
				<span>{{ data.phone }}</span>
			</el-form-item>
			<el-form-item label="授信额度" :label-position="'right'">
				<span>{{ data.creditLines }}</span>
			</el-form-item>
			<el-form-item label="企业名称" :label-position="'right'">
				<span>{{ data.companyName }}</span>
			</el-form-item>
			<el-form-item label="法人姓名" :label-position="'right'">
				<span>{{ data.legalPerson }}</span>
			</el-form-item>
			<el-form-item label="法人身份证号" :label-position="'right'">
				<span>{{ data.legalPersonId }}</span>
			</el-form-item>
			<el-form-item label="支付宝账户" :label-position="'right'">
				<template v-if="data.alipayNum">
					<span>{{ data.alipayNum }}</span>
					<template v-if="data.alipayAuth !== 1">
						<!--未认证，点此认证-->
					</template>
				</template>
			</el-form-item>
			<el-form-item label="微信账户" :label-position="'right'">
				<template v-if="data.wechatNum">
					<span>{{ data.wechatNum }}</span>
					<template v-if="data.wechatAuth !== 1">
						<!--未认证，点此认证-->
					</template>
				</template>
			</el-form-item>

			<el-form-item label="" :label-position="'right'">
				<el-button type="primary" @click="$router.push({ name: 'channelEdit', query: { channelId: data.channelId }})">
					编辑
				</el-button>
				<backBtn></backBtn>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
    import ajax from 'common/ajax'
    import ajaxUrls from 'common/ajaxUrls'
    import backBtn from 'components/units/backBtn.vue'

	export default{
	    props: {
            setCreditLimit: Function
		},
		data(){
			return{
                data: {
                    channelId: '',
                    name: '',
                    direcor: '',
                    phone: '',
                    creditLines: '',
                    companyName: '',
                    legalPerson: '',
                    legalPersonId: '',
                    alipayAuth: '',
                    alipayNum: '',
                    wechatAuth: '',
                    wechatNum: '',
				}
			}
		},
		mounted(){
            this.channelId = this.$route.query.channelId;
		    this.$on('getChannelInfo', this.getData);
		},
		methods: {
		    getData(){
                ajax({
                    method: 'get',
                    url: ajaxUrls.channel.detail,
                    data: {
                        channelId: this.channelId
					}
                }).then(data => {
                    this.data = data.data;
                    this.setCreditLimit(this.data.creditLines);
                })
			}
		},
		components:{
            backBtn
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