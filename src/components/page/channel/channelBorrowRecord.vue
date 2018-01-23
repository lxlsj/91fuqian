<template>
	<div>
		<div slot="header" class="from-query">
			<el-form :inline="true" class="demo-form-inline">
				<el-form-item label="借款来源">
					<el-input v-model="queryData.borrowFrom" auto-complete="off" size="small" placeholder="借款来源"></el-input>
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
				<el-form-item label="还款日期">
					<el-date-picker
							v-model="queryRepayDateData"
							type="daterange"
							:editable="false"
							:clearable="true"
							size="small"
							placeholder="选择时间段">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="创建时间">
					<el-date-picker
							v-model="queryAddDateData"
							type="daterange"
							:editable="false"
							:clearable="true"
							size="small"
							placeholder="选择时间段">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" @click="getData(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="sub-container">
			<p class="sub-container__gray">
				借款总金额：{{totalData.borrowAccountTotal}} &nbsp;&nbsp;
				还款总金额：{{totalData.repaymentInteresTotal}}元 &nbsp;&nbsp;
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
							prop="borrowFrom"
							align="center"
							label="借款来源">
					</el-table-column>
					<el-table-column
							prop="borrowAccount"
							align="center"
							label="借款金额(元)">
					</el-table-column>
					<el-table-column
							align="center"
							label="借款日期">
						<template scope="scope">
							{{scope.row.borrowTime | moment('YYYY-MM-DD')}}
						</template>
					</el-table-column>
					<el-table-column
							prop="borrowDays"
							align="center"
							label="借款期限(天)">
					</el-table-column>
					<el-table-column
							prop="borrowAccount"
							align="center"
							label="应还本金(元)">
					</el-table-column>
					<el-table-column
							prop="repaymentInterest"
							align="center"
							label="应还利息(元)">
					</el-table-column>
					<el-table-column
							align="center"
							label="还款日期">
						<template scope="scope">
							{{scope.row.repaymentTime | moment('YYYY-MM-DD')}}
						</template>
					</el-table-column>
					<el-table-column
							align="center"
							label="创建时间">
						<template scope="scope">
							{{scope.row.createTime | moment('YYYY-MM-DD&nbsp;HH:mm:ss')}}
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

    export default{
        data(){
            return{
                queryBorrowDateData: [],
                queryRepayDateData: [],
                queryAddDateData: [],
                queryData: {
                    channelId: '',
					borrowFrom: '',
                    sAddTime: '',
                    eAddTime: '',
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
                    repaymentInteresTotal: 0
                }
            }
        },
        mounted(){
            this.queryData.channelId = this.$route.query.channelId;
            this.$on('channelBRInit', this.getData);
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
                if(this.queryAddDateData[1]){
                    this.queryData.sAddTime = moment(this.queryAddDateData[0]).format('YYYY-MM-DD');
                    this.queryData.eAddTime = moment(this.queryAddDateData[1]).format('YYYY-MM-DD');
                }else{
                    this.queryData.sAddTime = '';
                    this.queryData.eAddTime = '';
                }
                this.paginationData.currentPage = current || this.paginationData.currentPage;
                ajax({
                    method: 'get',
                    url: ajaxUrls.channel.chaBorrow,
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