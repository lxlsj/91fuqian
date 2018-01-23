<template>
	<div>
		<div slot="header" class="from-query">
			<el-form :inline="true" class="demo-form-inline">
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
						<el-option label="逾期" value="99"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" @click="getData(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="sub-container">
			<p class="sub-container__gray">
				商户数：{{totalData.businessNum}} &nbsp;&nbsp;
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
							prop="giveAccount"
							align="center"
							label="赠送金额(元)">
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
				</el-table>
				<div class="pagination-wrapper">
					<el-pagination
							@current-change="getData"
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
	</div>
</template>

<script>
    import tableDataFail from 'components/layout/tableDataFail.vue'
    import ajax from 'common/ajax.js'
    import ajaxUrls from 'common/ajaxUrls.js'
    import moment from 'moment'
    import {qryBusAll} from 'common/qryUnit.js'

    export default{
        data(){
            return{
                queryBorrowDateData: [],
                queryRepayDateData: [],
                queryData: {
                    channelId: '',
                    busId: '',
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
                    businessNum: 0,
                    borrowAccountTotal: 0,
                    overTopAccountTotal: 0,
                    overdueAccountTotal: 0,
                    repaymentAccountTotal: 0,
                    repaymentsAccountTotal: 0
                },
                busOptions: []
            }
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
        mounted(){
            this.queryData.channelId = this.$route.query.channelId;
            this.$on('merchantBRInit', this.getData);
            qryBusAll().then( data => {
                this.busOptions = data.data;
            })
        },
        methods: {
            getData(current){
                if(this.queryBorrowDateData[1]){
                    this.queryData.sBorrowTime = moment(this.queryBorrowDateData[0]).format('YYYY-MM-DD');
                    this.queryData.eBorrowTime = moment(this.queryBorrowDateData[1]).format('YYYY-MM-DD');
                }else{
                    this.queryData.sBorrowTime = '';
                    this.queryData.eBorrowTime = '';
                }
                if(this.queryRepayDateData[1]){
                    this.queryData.sRepayTime = moment(this.queryRepayDateData[0]).format('YYYY-MM-DD');
                    this.queryData.eRepayTime = moment(this.queryRepayDateData[1]).format('YYYY-MM-DD');
                }else{
                    this.queryData.sRepayTime = '';
                    this.queryData.eRepayTime = '';
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
            }
        },
        components:{
            tableDataFail
        }
    }
</script>

<style lang="scss">
</style>