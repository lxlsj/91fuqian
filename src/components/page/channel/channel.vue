<template>
	<div>
		<h2 class="page-title">渠道管理</h2>
		<card>
			<div slot="header" class="from-query">
				<el-form :inline="true" class="demo-form-inline">
					<el-form-item label="渠道名称">
						<el-select v-model="queryData.channelId" size="small" placeholder="全部">
							<el-option label="全部" value=""></el-option>
							<el-option v-for="item in channelOptions" :label="item.name" :value="item.channelId" :key="item.channelId"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="渠道负责人">
						<el-input v-model="queryData.direcor" size="small" placeholder="渠道负责人"></el-input>
					</el-form-item>
					<el-form-item label="负责人手机号">
						<el-input v-model="queryData.phone" size="small" placeholder="负责人手机号"></el-input>
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
				<el-button slot="header" type="primary" size="small" @click="$router.push({ name: 'channelEdit' })">
					创建渠道
				</el-button>
				<p class="fr sub-container__gray">
					渠道总数：{{totalData.channelTotal}} &nbsp;&nbsp;
					渠道授信总额度：{{totalData.creditLinesTotal}}元 &nbsp;&nbsp;
					关联商户总数：{{totalData.businessTotal}} &nbsp;&nbsp;
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
								prop="channelId"
								align="center"
								label="渠道ID">
						</el-table-column>
						<el-table-column
								prop="name"
								align="center"
								label="渠道名称">
						</el-table-column>
						<el-table-column
								prop="direcor"
								align="center"
								label="渠道负责人">
						</el-table-column>
						<el-table-column
								prop="phone"
								align="center"
								label="负责人手机号">
						</el-table-column>
						<el-table-column
								prop="creditLines"
								align="center"
								label="授信额度(元)">
						</el-table-column>
						<el-table-column
								prop="businessNum"
								align="center"
								label="关联商户数">
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
								<el-button type="text" size="small" @click="$router.push({ name: 'channelDetail', query: { channelId: scope.row.channelId, channelName: scope.row.name }})">
									查看
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
	import sidebar from 'components/layout/sidebar.vue'
	import card from 'components/layout/card.vue'
	import tableDataFail from 'components/layout/tableDataFail.vue'
	import ajax from 'common/ajax.js'
    import ajaxUrls from 'common/ajaxUrls.js'
	import moment from 'moment'
	import {qryChannelAll} from 'common/qryUnit.js'
	export default{
		data(){
			return{
			    queryDateData: ['', ''],
                queryData: {
                    channelId: '',
                    name: '',
                    phone: '',
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
                    businessTotal: 0,
                    channelTotal: 0,
                    creditLinesTotal: 0
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
					url: ajaxUrls.channel.channelList,
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
			sidebar,
			card,
            tableDataFail
		}
	}
</script>

<style lang="scss">
</style>