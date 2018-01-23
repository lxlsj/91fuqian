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
				<el-form-item label="渠道负责人">
					<el-input v-model="queryData.busDirecor" size="small" placeholder="渠道负责人"></el-input>
				</el-form-item>
				<el-form-item label="负责人手机号">
					<el-input v-model="queryData.busPhone" size="small" placeholder="负责人手机号"></el-input>
				</el-form-item>
				<el-form-item label="商户地址">
					<el-input v-model="queryData.address" size="small" placeholder="商户地址"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" @click="getData(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="sub-container">
			<p class="sub-container__gray">
				商户数：{{totalData.businessNum}} &nbsp;&nbsp;
				授信总额度：{{totalData.creditLinesTotal}}元 &nbsp;&nbsp;
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
							type="index"
							align="center"
							label="序号">
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
							prop="creditLines"
							align="center"
							label="授信额度(元)">
					</el-table-column>
					<el-table-column
							prop="direcor"
							align="center"
							label="商户负责人">
					</el-table-column>
					<el-table-column
							prop="phone"
							align="center"
							label="负责人电话">
					</el-table-column>
					<el-table-column
							prop="addressInfo"
							align="center"
							label="商户地址">
					</el-table-column>
					<el-table-column
							align="center"
							label="关联时间">
						<template scope="scope">
							{{scope.row.relationTime | moment('YYYY-MM-DD&nbsp;HH:mm:ss')}}
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
    import {qryBusAll} from 'common/qryUnit.js'

	export default{
		data(){
			return{
                queryData: {
                    channelId: '',
                    busId: '',
                    busDirecor: '',
                    busPhone: '',
                    address: ''
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
                    creditLinesTotal: 0
                },
                busOptions: []
			}
		},
		mounted(){
            this.queryData.channelId = this.$route.query.channelId;
		    this.$on('merchantInit', this.getData);
            qryBusAll().then( data => {
                this.busOptions = data.data;
            })
		},
		methods: {
		    getData(current){
                this.paginationData.currentPage = current || this.paginationData.currentPage;
                ajax({
                    method: 'get',
                    url: ajaxUrls.channel.busList,
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