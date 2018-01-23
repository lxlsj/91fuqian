<template>
	<div>
		<h2 class="page-title">商户借款管理</h2>
		<card>
			<div slot="header" class="from-query">
				<el-form :inline="true" class="demo-form-inline">
					<el-form-item label="渠道名称">
						<el-select v-model="queryData.channelId" size="small" placeholder="全部">
							<el-option label="全部" value=""></el-option>
							<el-option v-for="item in channelOptions" :label="item.name" :value="item.channelId" :key="item.channelId"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="商户名称">
						<el-select v-model="queryData.busId" size="small" placeholder="全部">
							<el-option label="全部" value=""></el-option>
							<el-option v-for="item in busOptions" :label="item.name" :value="item.busId" :key="item.busId"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="借款日期">
						<el-date-picker
								v-model="queryBorrowDateData"
								type="daterange"
								:editable="false"
								:clearable="true"
								size="small"
								placeholder="选择时间段">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="到期日期">
						<el-date-picker
								v-model="queryRepayDateData"
								type="daterange"
								:editable="false"
								:clearable="true"
								size="small"
								placeholder="选择时间段">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="queryData.borrowStatus" size="small" placeholder="全部">
							<el-option label="全部" value=""></el-option>
							<el-option label="失效" value="-1"></el-option>
							<el-option label="还款中" value="1"></el-option>
							<el-option label="已还款" value="2"></el-option>
							<el-option label="待还款" value="3"></el-option>
							<el-option label="逾期" value="99"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button size="small" type="primary" @click="queryTable(1)">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="sub-container">
				<el-button slot="header" type="primary" size="small" @click="$router.push({ name: 'businessBorrowEdit' })">
					创建借款
				</el-button>
				<el-button slot="header" type="primary" size="small" @click="exportExl">导出数据</el-button>
				<p class="fr sub-container__gray">
					借款总金额：{{totalData.borrowAccountTotal}}元 &nbsp;&nbsp;
					实际应还总金额：{{totalData.repaymentAccountTotal}}元 &nbsp;&nbsp;
					已还总金额：{{totalData.repaymentsAccountTotal}}元 &nbsp;&nbsp;
					未还总金额：{{totalData.overdueAccountTotal}}元 &nbsp;&nbsp;
					超出总金额：{{totalData.overTopAccountTotal}}元 &nbsp;&nbsp;
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
								prop="channelName"
								align="center"
								label="渠道名称">
						</el-table-column>
						<el-table-column
								prop="businessName"
								align="center"
								label="商户名称">
						</el-table-column>
						<el-table-column
								prop="borrowAccount"
								align="center"
								label="借款金额(元)">
						</el-table-column>
						<el-table-column
								align="center"
								label="赠送金额(元)">
							<template scope="scope">
								<template v-if="scope.row.cooperationWay === 1">{{scope.row.giveAccount}}</template>
								<template v-else>--</template>
							</template>
						</el-table-column>
						<el-table-column
								prop="borrowDays"
								align="center"
								label="借款期限(天)">
						</el-table-column>
						<el-table-column
								prop="discount"
								align="center"
								label="商户折扣(折)">
						</el-table-column>
						<el-table-column
								prop="repaymentAccount"
								align="center"
								label="实际应还金额(元)">
						</el-table-column>
						<el-table-column
								prop="consumerDiscount"
								align="center"
								label="消费者折扣(折)">
						</el-table-column>
						<el-table-column
								prop="maxDiscount"
								align="center"
								label="最高优惠金额(元)">
						</el-table-column>
						<el-table-column
								prop="paidAccount"
								align="center"
								label="已还金额(元)">
						</el-table-column>
						<el-table-column
								prop="overdueAccount"
								align="center"
								label="未还金额(元)">
						</el-table-column>
						<el-table-column
								prop="overTopAccount"
								align="center"
								label="超出金额(元)">
						</el-table-column>
						<el-table-column
								align="center"
								label="借款日期">
							<template scope="scope">
								{{scope.row.borrowTime | moment('YYYY-MM-DD')}}
							</template>
						</el-table-column>
						<el-table-column
								align="center"
								label="到期日期">
							<template scope="scope">
								{{scope.row.repaymentTime | moment('YYYY-MM-DD')}}
							</template>
						</el-table-column>
						<el-table-column
								align="center"
								label="状态">
							<template scope="scope">
								{{scope.row.borrowStatus | borrowStatus}}
							</template>
						</el-table-column>
						<el-table-column
								align="center"
								label="操作">
							<template scope="scope">
								<el-button type="text" size="small" @click="$router.push({ name: 'businessBorrowDetail', query: { id: scope.row.id } })">
									查看
								</el-button>
								<el-button v-if="scope.row.borrowStatus == 1 || scope.row.borrowStatus == 3" type="text" size="small" @click="invalid(scope.row.id)">
									失效
								</el-button>
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
	import {qryBusAll, qryChannelAll} from 'common/qryUnit'
	import qs from 'qs'
	export default{
		data(){
			return{
                queryBorrowDateData: [],
                queryRepayDateData: [],
                queryData: {
                    busId: '',
                    channelId: '',
                    borrowStatus: '',
                    sBorrowTime: '',
                    eBorrowTime: '',
                    sRepaymentTime: '',
                    eRepaymentTime: ''
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
                    repaymentAccountTotal: 0,
                    repaymentsAccountTotal: 0,
                    overdueAccountTotal: 0,
                    overTopAccountTotal: 0,
				},
                busOptions: [],
                channelOptions: [],
			}
		},
		mounted(){
		    this.queryTable();
            qryBusAll().then( data => {
                this.busOptions = data.data;
			});
            qryChannelAll().then( data => {
                this.channelOptions = data.data
			})
		},
        filters: {
            borrowStatus(status){
                //借款状态：1还款中 2已还款 -1已失效 99逾期
                let text = '';
                status = Number(status);
                switch(status){
                    case 1:
                        text = '还款中';
                        break;
                    case 2:
                        text = '已还款';
                        break;
                    case 3:
                        text = '待还款';
                        break;
                    case -1:
                        text = '已失效';
                        break;
                    case 99:
                        text = '逾期';
                        break;
                    default:
                        break;
                }
                return text;
            }
        },
		methods: {
            queryTable(current){
				if(this.queryBorrowDateData[1]){
                    this.queryData.sBorrowTime = moment(this.queryBorrowDateData[0]).format('YYYY-MM-DD');
                    this.queryData.eBorrowTime = moment(this.queryBorrowDateData[1]).format('YYYY-MM-DD');
				}else{
                    this.queryData.sBorrowTime = '';
                    this.queryData.eBorrowTime = '';
				}
                if(this.queryRepayDateData[1]){
                    this.queryData.sRepaymentTime = moment(this.queryRepayDateData[0]).format('YYYY-MM-DD');
                    this.queryData.eRepaymentTime = moment(this.queryRepayDateData[1]).format('YYYY-MM-DD');
                }else{
                    this.queryData.sRepaymentTime = '';
                    this.queryData.eRepaymentTime = '';
                }
                this.paginationData.currentPage = current || this.paginationData.currentPage;
                ajax({
                    method: 'get',
					url: ajaxUrls.business.busBorrowList,
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
            handleCurrentChange(){
                this.queryTable()
			},
            invalid(id){
                this.$confirm('失效后借款终止，不可再恢复\n确定要失效吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.submitInvalid(id).then( data => {
                        this.queryTable(1);
					})
                }).catch(() => {
                });
			},
			submitInvalid(id){
                return ajax({
                    method: 'post',
                    url: ajaxUrls.business.busBorrowInvalid,
                    data: {id: id}
                })
			},
            exportExl(){
                if(this.queryBorrowDateData[1]){
                    this.queryData.sBorrowTime = moment(this.queryBorrowDateData[0]).format('YYYY-MM-DD');
                    this.queryData.eBorrowTime = moment(this.queryBorrowDateData[1]).format('YYYY-MM-DD');
                }else{
                    this.queryData.sBorrowTime = '';
                    this.queryData.eBorrowTime = '';
                }
                if(this.queryRepayDateData[1]){
                    this.queryData.sRepaymentTime = moment(this.queryRepayDateData[0]).format('YYYY-MM-DD');
                    this.queryData.eRepaymentTime = moment(this.queryRepayDateData[1]).format('YYYY-MM-DD');
                }else{
                    this.queryData.sRepaymentTime = '';
                    this.queryData.eRepaymentTime = '';
                }
                let qry = qs.stringify(Object.assign({
                    currentPage: this.paginationData.currentPage,
                    pernum: this.paginationData.pageSize,
                }, this.queryData));
                location.href = ajaxUrls.business.busBorrowExport + '?'+qry
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