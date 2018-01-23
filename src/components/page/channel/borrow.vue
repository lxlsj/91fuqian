<template>
	<div>
		<h2 class="page-title">渠道借款管理</h2>
		<card>
			<div slot="header" class="from-query">
				<el-form :inline="true" class="demo-form-inline">
					<el-form-item label="借款渠道">
						<el-select v-model="queryData.channelId" size="small" placeholder="全部">
							<el-option label="全部" value=""></el-option>
							<el-option v-for="item in channelOptions" :label="item.name" :value="item.channelId" :key="item.channelId"></el-option>
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
								v-model="queryCreateDateData"
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
				<el-button slot="header" type="primary" size="small" @click="$router.push({ name: 'channelBorrowEdit' })">
					创建渠道借款
				</el-button>
				<p class="fr sub-container__gray">
					借款总金额：{{totalData.borrowAccountTotal}}元 &nbsp;&nbsp;
					应还利息：{{totalData.repaymentInteresTotal}}元 &nbsp;&nbsp;
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
								prop="channelName"
								align="center"
								label="借款渠道">
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
						<el-table-column
								align="center"
								label="操作">
							<template scope="scope">
								<el-button type="text" size="small" @click="$router.push({ name: 'channelBorrowEdit', query: { channelId: scope.row.channelId, id: scope.row.id }})">
									编辑
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
	import ajax from 'common/ajax.js'
    import ajaxUrls from 'common/ajaxUrls.js'
	import moment from 'moment'
	import {qryChannelAll} from 'common/qryUnit.js'
	export default{
		data(){
			return{
                queryBorrowDateData: ['', ''],
                queryRepayDateData: ['', ''],
                queryCreateDateData: ['', ''],
                queryData: {
                    borrowFrom: '',
                    channelId: '',
                    sBorrowTime: '',
                    eBorrowTime: '',
                    sRepaymentTime: '',
                    eRepaymentTime: '',
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
                    repaymentInteresTotal: 0
				},
				channelOptions: []
			}
		},
		mounted(){
		    this.queryTable();
            qryChannelAll().then( data => {
                this.channelOptions = data.data;
			})
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
                if(this.queryCreateDateData[1]){
                    this.queryData.sAddTime = moment(this.queryCreateDateData[0]).format('YYYY-MM-DD');
                    this.queryData.eAddTime = moment(this.queryCreateDateData[1]).format('YYYY-MM-DD');
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
			},
            handleCurrentChange(){
                this.queryTable()
			}
		},
		components:{
			card,
            tableDataFail
		}
	}
</script>

<style lang="scss">
</style>