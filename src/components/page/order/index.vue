<template>
	<div>
		<h2 class="page-title">订单管理</h2>
		<card>
			<div slot="header" class="from-query">
				<el-form :inline="true" class="demo-form-inline">
					<el-form-item label="订单号">
						<el-input v-model="queryData.orderNo" size="small" placeholder="订单号"></el-input>
					</el-form-item>
					<el-form-item label="支付方式">
						<el-select v-model="queryData.payPlat" size="small" placeholder="支付方式">
							<el-option label="全部" value=""></el-option>
							<el-option label="支付宝" value="1"></el-option>
							<el-option label="微信" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="来源商户">
						<el-select v-model="queryData.shopNo" size="small" placeholder="来源商户">
							<el-option label="全部" value=""></el-option>
							<el-option v-for="item in busOptions" :label="item.name" :value="item.busId" :key="item.busId"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="收款方">
						<el-input v-model="queryData.receiptShopName" size="small" placeholder="收款商户"></el-input>
					</el-form-item>
					<el-form-item label="订单时间">
						<el-date-picker
								v-model="queryDateData"
								type="daterange"
								:editable="false"
								:clearable="true"
								size="small"
								placeholder="选择时间段">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="订单状态">
						<el-select v-model="queryData.orderStatus" size="small" placeholder="订单状态">
							<el-option label="全部" value=""></el-option>
							<el-option label="支付成功" value="2"></el-option>
							<el-option label="支付过期" value="3"></el-option>
							<el-option label="待支付" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button size="small" type="primary" @click="queryTable(1)">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="sub-container">
				<el-button slot="header" type="primary" size="small" @click="exportExl">导出数据</el-button>
				<p class="fr sub-container__gray">
					支付宝订单数：{{totalData.alipayCount}} &nbsp;&nbsp;
					微信订单数：{{totalData.wechatpayCount}} &nbsp;&nbsp;
					订单总金额：{{totalData.amountSum}}元 &nbsp;&nbsp;
					实际支付总金额：{{totalData.payAmountSum}}元 &nbsp;&nbsp;
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
								width="70"
								align="center"
								label="序号">
							<template scope="scope">
								{{paginationData.total - scope.$index - ((paginationData.currentPage-1) * 10)}}
							</template>
						</el-table-column>
						<el-table-column
								prop="orderNo"
								align="center"
								label="订单号">
						</el-table-column>
						<el-table-column
								prop="amount"
								align="center"
								label="订单金额(元)">
						</el-table-column>
						<el-table-column
								align="center"
								label="优惠金额(元)">
							<template scope="scope">
								{{(scope.row.amount - scope.row.payAmount) | k2d}}
							</template>
						</el-table-column>
						<el-table-column
								prop="payAmount"
								align="center"
								label="实际支付金额(元)">
						</el-table-column>
						<el-table-column
								prop="orderPlatName"
								align="center"
								label="支付方式">
						</el-table-column>
						<el-table-column
								prop="shopName"
								align="center"
								label="来源商户">
						</el-table-column>
						<el-table-column
								prop="receiptShopName"
								align="center"
								label="收款方">
						</el-table-column>
						<el-table-column
								align="center"
								label="订单时间">
							<template scope="scope">
								{{scope.row.orderTime | moment('YYYY-MM-DD&nbsp;HH:mm:ss')}}
							</template>
						</el-table-column>
						<el-table-column
								align="center"
								label="支付时间">
							<template scope="scope">
								<template v-if="scope.row.payTime">
									{{scope.row.payTime | moment('YYYY-MM-DD&nbsp;HH:mm:ss')}}
								</template>
							</template>
						</el-table-column>
						<el-table-column
								align="center"
								label="订单状态">
							<template scope="scope">
								{{scope.row.orderStatusDesc}}
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
		</card>
	</div>
</template>

<script>
	import card from 'components/layout/card.vue'
	import tableDataFail from 'components/layout/tableDataFail.vue'
	import ajax from 'common/ajax'
    import ajaxUrls from 'common/ajaxUrls'
	import moment from 'moment'
	import {qryBusAll} from 'common/qryUnit'
    import qs from 'qs'
	export default{
		data(){
			return{
			    queryDateData: ['', ''],
                queryData: {
                    shopNo: '',
                    orderNo: '',
                    payPlat: '',
                    receiptShopName: '',
                    orderStatus: '',
                    orderTimeStart: '',
                    orderTimeEnd: ''
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
                    alipayCount: 0,
                    wechatpayCount: 0,
                    amountSum: 0,
                    payAmountSum: 0,
                },
                busOptions: []
			}
		},
		mounted(){
		    this.queryTable();
            qryBusAll().then( data => {
                this.busOptions = data.data;
			})
		},
		methods: {
            queryTable(current){
                if(this.queryDateData[1]){
                    this.queryData.orderTimeStart = moment(this.queryDateData[0]).format('YYYY-MM-DD')+ ' 00:00:00';
                    this.queryData.orderTimeEnd = moment(this.queryDateData[1]).format('YYYY-MM-DD')+ ' 23:59:59';
                }else{
                    this.queryData.orderTimeStart = '';
                    this.queryData.orderTimeEnd = '';
                }
                this.paginationData.currentPage = current || this.paginationData.currentPage;
                ajax({
                    method: 'get',
                    url: ajaxUrls.order.list,
                    data: Object.assign({
                        currentPage: this.paginationData.currentPage,
                        pageSize: this.paginationData.pageSize,
                    }, this.queryData)
                }).then(data => {
                    this.tableData = data.data.pageData.list || [];
                    this.totalData.alipayCount = data.data.alipayCount;
                    this.totalData.wechatpayCount = data.data.wechatpayCount;
                    this.totalData.amountSum = data.data.amountSum;
                    this.totalData.payAmountSum = data.data.payAmountSum;
                    this.paginationData.total = data.data.pageData.total;
                })
			},
            handleCurrentChange(){
                this.queryTable()
			},
            exportExl(){
                if(this.queryDateData[1]){
                    this.queryData.orderTimeStart = moment(this.queryDateData[0]).format('YYYY-MM-DD');
                    this.queryData.orderTimeEnd = moment(this.queryDateData[1]).format('YYYY-MM-DD');
                }else{
                    this.queryData.orderTimeStart = '';
                    this.queryData.orderTimeEnd = '';
                }
                let qry = qs.stringify(Object.assign({
//                    currentPage: this.paginationData.currentPage,
//                    pernum: this.paginationData.pageSize,
                }, this.queryData));
                location.href = ajaxUrls.order.export + '?'+qry
            },
		},
		components:{
			card,
            tableDataFail
		}
	}
</script>

<style lang="scss">
</style>