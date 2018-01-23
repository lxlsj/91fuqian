<template>
	<div>
		<h2 class="page-title">商户管理</h2>
		<card>
			<div slot="header" class="from-query">
				<el-form :inline="true" class="demo-form-inline">
					<el-form-item label="商户名称">
						<el-select v-model="queryData.busId" size="small" placeholder="全部">
							<el-option label="全部" value=""></el-option>
							<el-option v-for="item in busOptions" :label="item.name" :value="item.busId" :key="item.busId"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="创建时间">
						<el-date-picker
								v-model="queryDateData"
								type="daterange"
								:editable="false"
								:clearable="true"
								size="small"
								placeholder="选择时间段">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button size="small" type="primary" @click="queryTable(1)">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="sub-container">
				<el-button slot="header" type="primary" size="small" @click="$router.push({ name: 'businessEdit' })">
					创建商户
				</el-button>
				<el-button slot="header" type="primary" size="small" @click="exportExl">导出数据</el-button>
				<p class="fr sub-container__gray">
					商户数：{{totalData.businessNum}} &nbsp;&nbsp;
					授信总额度：{{totalData.creditLinesTotal}}元 &nbsp;&nbsp;
					在借总额度：{{totalData.borrowAccountTotal}}元 &nbsp;&nbsp;
					已还总额度：{{totalData.repaymentAccountTotal}}元 &nbsp;&nbsp;
					剩余可借额度：{{totalData.usableAccountTotal}}元 &nbsp;&nbsp;
				</p>
			</div>
			<div class="table-container" v-loading.body="loading">
				<template v-if="tableDataError">
					<table-data-fail type="error"></table-data-fail>
				</template>
				<template v-else-if="tableData.length > 0">
					<el-table
							:data="tableData"
							stripe
							border
							style="width: 100%">
						<el-table-column
								prop="id"
								align="center"
								label="ID">
						</el-table-column>
						<el-table-column
								prop="busId"
								align="center"
								label="商户ID">
						</el-table-column>
						<el-table-column
								prop="name"
								align="center"
								label="商户名称">
						</el-table-column>
						<el-table-column
								prop="wechatMchId"
								align="center"
								label="商户号">
						</el-table-column>
						<el-table-column
								prop="creditLines"
								align="center"
								label="授信额度(元)">
						</el-table-column>
						<el-table-column
								prop="channelName"
								align="center"
								label="关联渠道">
						</el-table-column>
						<el-table-column
								prop="borrowAccount"
								align="center"
								label="在借额度(元)">
						</el-table-column>
						<el-table-column
								prop="repaymentAccount"
								align="center"
								label="已还额度(元)">
						</el-table-column>
						<el-table-column
								prop="usableAccount"
								align="center"
								label="剩余可用额度(元)">
						</el-table-column>
						<el-table-column
								align="center"
								label="创建时间">
							<template scope="scope">
								{{scope.row.createTime | moment('YYYY-MM-DD&nbsp;HH:mm:ss')}}
							</template>
						</el-table-column>
						<el-table-column
								align="center"
								label="操作">
							<template scope="scope">
								<el-button type="text" size="small" @click="$router.push({ name: 'businessDetail', query: { busId: scope.row.busId } })">
									查看
								</el-button>
								<el-button type="text" size="small" @click="downloadQRCode(scope.row.busId)">下载二维码</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination-wrapper">
						<el-pagination
								@current-change="handleCurrentChange"
								:current-page.sync="paginationData.currentPage"
								:page-size="paginationData.pageSize"
								layout="total, prev, pager, next, jumper"
								:total="paginationData.total">
						</el-pagination>
					</div>
				</template>
				<template v-else>
					<table-data-fail type="empty"></table-data-fail>
				</template>
			</div>
			<div class="hide-img">
				<img ref="QRCodeWrapperPic" :src="QRCodeWrapperPic" alt="">
			</div>
		</card>
	</div>
</template>

<script>
	import card from 'components/layout/card.vue'
	import tableDataFail from 'components/layout/tableDataFail.vue'
	import ajax from 'common/ajax.js'
    import ajaxUrls from 'common/ajaxUrls.js'
	import moment from 'moment'
	import {qryBusAll} from 'common/qryUnit.js'
    import hostsUrl from 'common/hostsUrl.js'
	import qs from 'qs'
    import QRCode from 'qrcode'
	import QRCodeWrapperPic from 'image/code-wrapper.jpg'

	export default{
		data(){
			return{
                QRCodeWrapperPic: QRCodeWrapperPic,
			    queryDateData: ['', ''],
                queryData: {
                    busId: '',
                    sAddTime: '',
                    eAddTime: ''
				},
                loading: false,
                paginationData:{
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                tableDataError: false,
                tableData: [],
				totalData: {
                    borrowAccountTotal: 0,
                    businessNum: 0,
                    creditLinesTotal: 0,
                    repaymentAccountTotal: 0,
                    usableAccountTotal: 0
				},
                busOptions: [],

				canvasDom: null,
			}
		},
		mounted(){
		    this.queryTable();
            qryBusAll().then( data => {
                this.busOptions = data.data;
			});
            this.createQRCodeWrapper();
		},
		methods: {
            queryTable(current){
				if(this.queryDateData[1]){
                    this.queryData.sAddTime = moment(this.queryDateData[0]).format('YYYY-MM-DD');
                    this.queryData.eAddTime = moment(this.queryDateData[1]).format('YYYY-MM-DD');
				}else{
                    this.queryData.sAddTime = '';
                    this.queryData.eAddTime = '';
				}
                this.paginationData.currentPage = current || this.paginationData.currentPage;
                ajax({
                    method: 'get',
					url: ajaxUrls.business.list,
					data: Object.assign({
                        currentPage: this.paginationData.currentPage,
                        pernum: this.paginationData.pageSize,
					}, this.queryData)
				}).then(data => {
				    this.tableData = data.data.page.list || [];
				    this.totalData = data.data.total;
				    this.paginationData.total = data.data.page.total
				})
			},
            exportExl(){
                if(this.queryDateData[1]){
                    this.queryData.sAddTime = moment(this.queryDateData[0]).format('YYYY-MM-DD');
                    this.queryData.eAddTime = moment(this.queryDateData[1]).format('YYYY-MM-DD');
                }else{
                    this.queryData.sAddTime = '';
                    this.queryData.eAddTime = '';
                }
                let qry = qs.stringify(Object.assign({
                    currentPage: this.paginationData.currentPage,
                    pernum: this.paginationData.pageSize,
                }, this.queryData));
                location.href = ajaxUrls.business.export + '?'+qry;
			},
            handleCurrentChange(){
                this.queryTable()
			},
            downloadQRCode(busId){
                let that = this;

                QRCode.toCanvas(hostsUrl.paymentUrl + '?shopNo='+busId, {margin: 0, scale: 14}, function (error, canvas) {
                    if (error) console.error(error);

                    that.drawCode(canvas, busId);
					if(navigator.userAgent.indexOf('Trident') !== -1){
                        let blobObj = that.canvasDom.msToBlob();
                        navigator.msSaveBlob(blobObj, 'QRCode.png');
					}else{
                        let img = that.canvasDom.toDataURL('image/png');
                        img.replace( 'image/png', 'image/octet-stream');
                        let link = document.createElement('a');
                        link.download = 'QRCode.png';
                        link.href = img;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
					}
                })

			},
			createQRCodeWrapper(){
                this.canvasDom = document.createElement('canvas');
                this.canvasDom.style.width = '1063px';
                this.canvasDom.style.height = '1594px';
                this.canvasDom.width = 1063;
                this.canvasDom.height = 1594;

			},
			drawCode(cvs, busId){

                let ctx= this.canvasDom.getContext("2d");
                let img = this.$refs.QRCodeWrapperPic;

                ctx.clearRect(0, 0, 1063, 1594);

                ctx.drawImage(img, 0, 0);

                ctx.drawImage(cvs, 244, 558, 575, 575);

                ctx.font = "38px Arial";
                ctx.textAlign = "center";

                ctx.fillText("NO." + busId, 532, 1180);
			},
		},
		components:{
			card,
            tableDataFail
		}
	}
</script>

<style lang="scss">
	.hide-img{
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 0;
		overflow: hidden;
	}
</style>