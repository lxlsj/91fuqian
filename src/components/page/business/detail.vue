<template>
	<div>
		<h2 class="page-title">商户详情</h2>
		<card>
			<div slot="header" class="from-query">
				<el-form :inline="true">
					<el-form-item label="商户名称:">
						{{busName}}
					</el-form-item>
					<el-form-item label="授信额度:">
						{{creditLines}} 元
						<el-button size="small" type="primary" @click="openDialogLimit">调整</el-button>
						<el-button size="small" type="primary" @click="openDialogLimitRecord">查看</el-button>
					</el-form-item>
					<el-form-item label="在借额度">
						{{borrowAccount}} 元
					</el-form-item>
					<el-form-item label="已还额度">
						{{repaymentAccount}} 元
					</el-form-item>
					<el-form-item label="剩余可用额度">
						{{usableAccount}} 元
					</el-form-item>
				</el-form>
			</div>
			<el-tabs v-model="tabIndex" type="card" @tab-click="handleClick">
				<el-tab-pane label="基本信息" name="0">
					<info ref="info" :setCreditLimit="setCreditLimit"></info>
				</el-tab-pane>
				<el-tab-pane label="借款记录" name="1">
					<borrowRecord ref="borrowRecord"></borrowRecord>
				</el-tab-pane>
				<el-tab-pane label="订单记录" name="2">
					<orderRecord ref="orderRecord"></orderRecord>
				</el-tab-pane>
			</el-tabs>
		</card>
		<el-dialog title="调整额度" :visible.sync="dialogLimitVisible">
			<el-form :model="formLimitData" :rules="limitRules" ref="formLimit" :label-width="'120px'" class="form-layout">
				<el-form-item label="调整额度" required>
					<el-col :span="5">
						<el-form-item prop="adjustType">
							<el-select v-model="formLimitData.adjustType" placeholder="请选择增减">
								<el-option label="增加" value="1"></el-option>
								<el-option label="减少" value="-1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="line" :span="2">-</el-col>
					<el-col :span="17">
						<el-form-item prop="adjustCredit">
							<el-input v-model.number="formLimitData.adjustCredit" auto-complete="off" placeholder="请输入调整金额"></el-input>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item label="调整原因" prop="reason">
					<el-input type="textarea" v-model="formLimitData.reason"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialogLimit">关闭</el-button>
				<el-button type="primary" @click="submitDialogLimit">确定修改</el-button>
			</div>
		</el-dialog>
		<el-dialog title="查看额度记录" :visible.sync="dialogLimitRecordVisible">
			<div class="table-container">
				<template>
					<el-table
							:data="dialogLimitRecordData"
							stripe
							border
							style="width: 100%">
						<el-table-column
								type="index"
								align="center"
								label="序号">
						</el-table-column>
						<el-table-column
								align="center"
								label="调整时间">
							<template scope="scope">
								{{scope.row.createTime | moment('YYYY-MM-DD&nbsp;HH:mm:ss')}}
							</template>
						</el-table-column>
						<el-table-column
								align="center"
								label="调整额度(元)">
							<template scope="scope">
								{{(scope.row.adjustAfterCredit - scope.row.adjustBeforeCredit) | k2d}}
							</template>
						</el-table-column>
						<el-table-column
								prop="adjustAfterCredit"
								align="center"
								label="调整后授信额度(元)">
						</el-table-column>
						<el-table-column
								prop="reason"
								align="center"
								label="调整原因">
						</el-table-column>
					</el-table>
					<div class="pagination-wrapper">
						<el-pagination
								@current-change="getLimitRecordData"
								:current-page.sync="paginationData.currentPage"
								:page-size="paginationData.pageSize"
								layout="total, prev, pager, next, jumper"
								:total="paginationData.total">
						</el-pagination>
					</div>
				</template>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialogLimitRecord">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import card from 'components/layout/card.vue'
    import ajax from 'common/ajax.js'
    import ajaxUrls from 'common/ajaxUrls.js'
    import info from './info.vue'
    import borrowRecord from './borrowRecord.vue'
    import orderRecord from './orderRecord.vue'
    import tableDataFail from 'components/layout/tableDataFail.vue'
	export default{
		data(){
			return{
                busName: '',
                busId: '',
                creditLines: 0,
                borrowAccount: 0,
                repaymentAccount: 0,
                usableAccount: 0,
			    tabIndex: '0',
                visited: [false, false, false],

                dialogLimitVisible: false,
                formLimitData: {
                    adjustCredit: '',
                    adjustType: '1',
                    busId: '',
                    createId: '',
                    reason: ''
				},
				limitRules: {
                    adjustCredit: [
						{type: 'integer',required: true, message: '请输入大于0的整数', trigger: 'blur', min: 1}
					],
                    adjustType: [
                        {required: true, message: '请选择调整类型', trigger: 'change'}
					]
				},

                dialogLimitRecordVisible: false,
                dialogLimitRecordData: [],
                paginationData:{
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                }
            }
		},
		mounted(){
            this.busId = this.$route.query.busId;
            this.formLimitData.busId = this.$route.query.busId;
		    this.$refs.info.$emit('getBusInfo');
		    this.getLimitRecordData();
		},
		methods: {
		    openDialogLimitRecord(){
		        this.dialogLimitRecordVisible = true;
			},
            closeDialogLimitRecord(){
                this.dialogLimitRecordVisible = false;
			},
		    getLimitRecordData(){
                ajax({
                    method: 'get',
                    url: ajaxUrls.business.creditRecord,
                    data: Object.assign({
                        currentPage: this.paginationData.currentPage,
                        pernum: this.paginationData.pageSize,
                    }, {busId: this.busId})
                }).then(data => {
                    this.dialogLimitRecordData = data.data.list || [];
                    this.paginationData.total = data.data.total || 0;
                })
			},
		    openDialogLimit(){
		        this.dialogLimitVisible = true;
			},
            closeDialogLimit(){
                this.dialogLimitVisible = false;
                this.$refs.formLimit.resetFields();
            },
			submitDialogLimit(){
                this.$refs.formLimit.validate((valid) => {
                    if (valid) {
                        ajax({
                            method: 'post',
                            url: ajaxUrls.business.adjustCredit,
                            data: this.formLimitData
                        }).then(data => {

                            this.restInfo();
                            this.closeDialogLimit();
                        }).catch(e => {
                            this.$message.error(e.msg);
						})
                    } else {
                        return false;
                    }
                });
			},
			restInfo(){
                this.$refs.info.$emit('getBusInfo');
                this.getLimitRecordData();
			},
            handleClick(tab, event){
				let name = tab.name;
				if(name === '1' && !this.visited[name]){
                    this.$refs.borrowRecord.$emit('borrowInit');
				}else if(name === '2' && !this.visited[name]){
                    this.$refs.orderRecord.$emit('orderInit')
				}

                this.visited[name] = true;
			},
            setCreditLimit(data){
                this.busName = data.name;
				this.creditLines = data.creditLines;
				this.borrowAccount = data.borrowAccount;
				this.repaymentAccount = data.repaymentAccount;
				this.usableAccount = data.usableAccount;
			}
		},
		components:{
			card,
            info,
            borrowRecord,
            orderRecord,
            tableDataFail
		}
	}
</script>

<style lang="scss">
	.form-layout .line{
		text-align: center;
	}
</style>