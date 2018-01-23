<template>
	<div class="channel-info">
		<el-form label-position="left" class="form-table" label-width="100px">
			<el-form-item label="商户ID" :label-position="'right'">
				<span>{{ data.busId }}</span>
			</el-form-item>
			<el-form-item label="商户名称" :label-position="'right'">
				<span>{{ data.name }}</span>
			</el-form-item>
			<el-form-item label="商户图标" :label-position="'right'">
				<img v-if="data.icon" :src="data.icon" alt="">
			</el-form-item>
			<el-form-item label="授信额度" :label-position="'right'">
				<span>{{ data.creditLines }}元</span>
			</el-form-item>
			<el-form-item label="商户负责人" :label-position="'right'">
				<span>{{ data.direcor }}</span>
			</el-form-item>
			<el-form-item label="负责人手机号" :label-position="'right'">
				<span>{{ data.phone }}</span>
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
				<span>{{ data.alipayNum }}</span>
				<template v-if="data.alipayAuth !== 1">
					<el-button type="primary" size="small" @click="openCheckoutAlipay">
						请先认证
					</el-button>
					<el-button type="text" size="small" @click="openChangeAlipay">
						修改账户
					</el-button>
				</template>
				<template v-else> 【已认证】</template>
			</el-form-item>
			<el-form-item v-if="data.alipayAuth === 1" label="支付宝授权码" :label-position="'right'">
				<canvas ref="alipayCanvas" class="qrcode-wrapper"></canvas>
				<p>请用上面认证的支付宝账户扫一扫授权码，授权成功后商户才可成功收款</p>
			</el-form-item>
			<el-form-item label="微信账户" :label-position="'right'">
				<span>{{ data.wechatNum }}</span>
			</el-form-item>
			<el-form-item label="微信商户号" :label-position="'right'">
				<span>{{ data.wechatMchId }}</span>
			</el-form-item>
			<el-form-item label="关联渠道" :label-position="'right'">
				<span>{{ data.channelName }}</span>
			</el-form-item>
			<el-form-item label="商户地址" :label-position="'right'">
				<span>{{ data.addressInfo }}</span>
			</el-form-item>
			<el-form-item label="商户二维码" :label-position="'right'">
				<canvas ref="canvas" class="qrcode-wrapper"></canvas>
			</el-form-item>

			<el-form-item label="" :label-position="'right'">
				<el-button type="primary" @click="$router.push({ name: 'businessEdit', query: { busId: data.busId } })">
					编辑
				</el-button>
				<backBtn></backBtn>
			</el-form-item>
		</el-form>
		<alipayAccountCheckout ref="alipayCheckout" :shopNo="data.busId" :account="data.alipayNum" :btnState.sync="data.alipayAccountVcode" :success="changeAlipayCheckout"></alipayAccountCheckout>
		<alipayAccountChange ref="alipayChange" :shopNo="data.busId" :success="changeAlipayAccount"></alipayAccountChange>
	</div>
</template>

<script>
    import ajax from 'common/ajax'
    import ajaxUrls from 'common/ajaxUrls'
	import QRCode from 'qrcode';
    import hostsUrl from 'common/hostsUrl'
	import alipayAccountCheckout from 'components/thirdDialog/alipayAccountCheckout.vue'
    import alipayAccountChange from 'components/thirdDialog/alipayAccountChange.vue'
    import backBtn from 'components/units/backBtn.vue'
	import storeDefaultPic from 'image/store-default.png'

    export default{
	    props: {
            setCreditLimit: Function
		},
		data(){
			return{
                data: {
                    busId: '',
                    name: '',
                    icon: '',
                    creditLines: '',
                    direcor: '',
                    phone: '',
                    companyName: '',
                    legalPerson: '',
                    legalPersonId: '',
                    alipayAuth: '',
                    alipayNum: '',
                    wechatAuth: '',
                    wechatNum: '',
                    channelName: '',
                    addressInfo: '',
                    alipayAccountVcode: ''
				}
			}
		},
		mounted(){
            this.busId = this.$route.query.busId;
		    this.$on('getBusInfo', this.getData);
		},
		methods: {
		    openCheckoutAlipay(){
		        this.$refs.alipayCheckout.openDialog();
			},
			changeAlipayCheckout(){
		        this.data.alipayAuth = 1;
			},
            openChangeAlipay(){
                this.$refs.alipayChange.openDialog();
			},
            changeAlipayAccount(account){
				this.data.alipayNum = account;
			},
		    getData(){
                ajax({
                    method: 'get',
                    url: ajaxUrls.business.get,
                    data: {
                        busId: this.busId
					}
                }).then(data => {
                    data = data.data;
                    data.icon = data.icon || storeDefaultPic;

                    this.data = data;
                    this.setCreditLimit(this.data);

                    QRCode.toCanvas(this.$refs.canvas, hostsUrl.paymentUrl + '?shopNo='+this.busId, {margin: 1, scale: 6}, function (error) {
                        if (error) console.error(error)
                    });
                    if(this.data.alipayAuth === 1){
                        this.$nextTick(() => {
                            QRCode.toCanvas(this.$refs.alipayCanvas, hostsUrl.paymentUrl + '?shopNo='+this.busId+'&isAuth=true', {margin: 1, scale: 5}, function (error) {
                                if (error) console.error(error)
                            });
						})
					}

                })
			}
		},
		components: {
            alipayAccountCheckout,
            alipayAccountChange,
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
		.qrcode-wrapper{
			width: 300px;
			height: 300px;
		}
	}
</style>