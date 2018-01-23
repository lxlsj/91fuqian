<template>
	<div>
		<h2 class="page-title">用户管理</h2>
		<card>
			<div slot="header" class="from-query">
				<el-form :inline="true" class="demo-form-inline">
					<el-form-item label="用户组">
						<el-select v-model="queryData.groupId" size="small" :clearable="true" placeholder="用户组">
							<el-option v-for="opt in groupDropList" :label="opt.groupName" :value="opt.id || 0" :key="opt.id || 0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="双重校验">
						<el-select v-model="queryData.needGaCheck" size="small" :clearable="true" placeholder="双重校验">
							<el-option label="全部" value=""></el-option>
							<el-option label="需要" :value="1"></el-option>
							<el-option label="不需要" :value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="锁定状态">
						<el-select v-model="queryData.isLocked" size="small" :clearable="true" placeholder="锁定状态">
							<el-option label="全部" value=""></el-option>
							<el-option label="正常" :value="0"></el-option>
							<el-option label="锁定" :value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="登录名">
						<el-input v-model="queryData.loginName" size="small" placeholder="登录名"></el-input>
					</el-form-item>
					<el-form-item label="真实姓名">
						<el-input v-model="queryData.realName" size="small" placeholder="真实姓名"></el-input>
					</el-form-item>
					<el-form-item label="邮箱">
						<el-input v-model="queryData.email" size="small" placeholder="邮箱"></el-input>
					</el-form-item>
					<el-form-item label="手机号">
						<el-input v-model="queryData.tel" size="small" placeholder="手机号"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button size="small" type="primary" @click="resetQueryTable">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="sub-container clearfix">
				<el-button slot="header" type="primary" icon="plus" size="small" @click="editUser()">添加</el-button>
				<el-button slot="header" type="primary" icon="plus" size="small" @click="queryTable()">刷新</el-button>
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
								prop="loginName"
								align="center"
								label="登录名">
						</el-table-column>
						<el-table-column
								prop="realName"
								align="center"
								label="真实姓名">
						</el-table-column>
						<el-table-column
								prop="email"
								align="center"
								label="邮箱">
						</el-table-column>
						<el-table-column
								prop="tel"
								align="center"
								label="手机号">
						</el-table-column>
						<el-table-column
								prop="groupNames"
								align="center"
								label="用户组">
						</el-table-column>
						<el-table-column
								align="center"
								label="双重校验">
							<template scope="scope">
								<el-switch
										v-model.number="scope.row.needGaCheck"
										@change="changeNeedGaCheck(scope.row.id, scope.$index, $event)"
										:on-value="1"
										:off-value="0">
								</el-switch>
							</template>
						</el-table-column>
						<el-table-column
								align="center"
								label="锁定状态">
							<template scope="scope">
								<el-switch
										v-model.number="scope.row.isLocked"
										@change="changeIsLocked(scope.row.id, scope.$index, $event)"
										:on-value="1"
										:off-value="0">
								</el-switch>
							</template>
						</el-table-column>
						<el-table-column
								align="center"
								label="操作">
							<template scope="scope">
								<el-button type="text" icon="fa-retweet" size="small" title="重置密码" @click="editPW(scope.row)"></el-button>
								<el-button type="text" icon="fa-qrcode" size="small" title="双重校验二维码" @click="showPic(scope.row.id)"></el-button>
								<el-button type="text" icon="edit" size="small" title="修改" @click="editUser(scope.row.id)"></el-button>
								<el-button type="text" icon="delete" size="small" title="删除" @click="delUser(scope.row.id)"></el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination-wrapper">
						<el-pagination
								@current-change="queryTable"
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
		<el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
			<el-form :model="dialogForm" :rules="fromRule" ref="dialogUser" :label-width="'110px'" class="form-item__block">
				<el-form-item label="用户组" prop="groupIds">
					<el-select v-model="dialogForm.groupIds" filterable multiple placeholder="请选择">
						<el-option v-for="opt in groupDropList" :label="opt.groupName" :value="opt.id" :key="opt.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="登录名" prop="loginName">
					<el-input v-model="dialogForm.loginName"></el-input>
				</el-form-item>
				<el-form-item label="真实姓名" prop="realName">
					<el-input v-model="dialogForm.realName"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="dialogForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="tel">
					<el-input v-model="dialogForm.tel"></el-input>
				</el-form-item>
				<el-form-item v-if="!dialogForm.id" label="密码" prop="password">
					<el-input v-model="dialogForm.password"></el-input>
				</el-form-item>
				<el-form-item label="双重校验" prop="needGaCheck">
					<el-switch
							v-model.number="dialogForm.needGaCheck"
							:on-value="1"
							:off-value="0">
					</el-switch>
				</el-form-item>
				<el-form-item label="锁定状态" prop="isLocked">
					<el-switch
							v-model.number="dialogForm.isLocked"
							:on-value="1"
							:off-value="0">
					</el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeEditUser">取 消</el-button>
				<el-button type="primary" @click="submitEditUser">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="修改密码" :visible.sync="resetPWVisible">
			<el-form :model="resetPWForm" :rules="fromRule" ref="dialogUser" :label-width="'110px'" class="form-item__block">
				<el-form-item label="登录名" prop="loginName">
					<span>{{resetPWForm.loginName}}</span>
				</el-form-item>
				<el-form-item label="新密码" prop="password">
					<el-input v-model="resetPWForm.password"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeEditPW">取 消</el-button>
				<el-button type="primary" @click="submitEditPW">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog
				title="双重校验二维码"
				:visible.sync="picVisible"
				size="tiny"
				class="dialog-center">
			<img class="user-qrcode" v-if="picSrc" :src="picSrc" alt="">
			<el-button type="text" @click="showQRCodeText">无法扫描? 获取文本密钥.</el-button>
		</el-dialog>
		<el-dialog
				title="双重校验文本"
				:visible.sync="QRCodeTextVisible"
				size="tiny">
			<el-form ref="dialogUser" :label-width="'110px'" class="form-item__block">
				<el-form-item label="账户" prop="loginName">
					<span>{{QRCodeTextForm.userName}}</span>
				</el-form-item>
				<el-form-item label="密钥" prop="password">
					<span>{{QRCodeTextForm.gaSecret}}</span>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import card from 'components/layout/card.vue'
    import tableDataFail from 'components/layout/tableDataFail.vue'
	import ajax from 'common/ajax.js'
	import ajaxUrls from 'common/ajaxUrls.js'
	import resStatus from 'common/resStatus.js'
	export default{
		data(){
			return{
                dialogFormVisible: false,
                dialogFormTitle: '添加用户',
                dialogFormType: 'add',
			    dialogForm: {
                    id: '',
                    groupIds: [],
                    loginName: '',
                    realName: '',
                    email: '',
                    tel: '',
                    password: '',
                    needGaCheck: 0,
                    isLocked: 0,
                },
                fromRule: {
                    isShow: [
                        {type: 'number', required: true, message: '请选择是否显示', trigger: 'change'}
					],
                    menuName: [
                        {required: true, message: '请填写菜单名', trigger: 'blur'}
					],
                    menuUri: [
                        {required: true, message: '请填写权限定位标识', trigger: 'blur'}
					],
                    sort: [
                        {type: 'number', required: true, message: '请填写排序', trigger: 'change'}
					]
                },

				resetPWVisible: false,
				resetPWForm: {
                    id: '',
                    loginName: '',
                    password: ''
				},

                picVisible: false,
				picSrc: '',
				QRCodeId: '',
                QRCodeTextVisible: false,
                QRCodeTextForm: {
                    gaSecret: '',
                    userName: ''
				},

                queryData: {
                    groupId: '',
                    needGaCheck: '',
                    isLocked: '',
                    loginName: '',
                    realName: '',
                    email: '',
                    tel: '',
				},
                groupDropList: [],
                loading: false,
                paginationData:{
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                tableDataError: false,
                tableData: []
			}
		},
        mounted(){
		    this.getGroupDropList();
		    this.queryTable();
		},
		methods: {
            showQRCodeText(){
                this.QRCodeTextForm =  {
                    gaSecret: '',
					userName: ''
                };
                ajax({
                    url: ajaxUrls.authority.user + '/qrbarcode/' + this.QRCodeId + '/text',
                    method: 'get'
                }).then((data) => {
                    data = data.data;
					this.QRCodeTextForm = {
                        gaSecret: data.gaSecret,
                        userName: data.userName
					};
                    this.QRCodeTextVisible = true;
                }).catch((err) => {
                    resStatus(err, this)
                });
			},
            showPic(id){
                this.QRCodeId = id;
                this.picSrc = ajaxUrls.authority.user + '/qrbarcode/' + id + '/pic';
                this.picVisible = true;
			},
			closePic(){
                this.picSrc = '';
                this.picVisible = false;
			},
            editPW(data){
                this.resetPWForm = {
                    id: data.id,
					loginName: data.loginName,
					password: ''
				};
                this.resetPWVisible = true;
			},
			submitEditPW(){
                ajax({
                    url: ajaxUrls.authority.user + '/resetpwd',
                    method: 'put',
                    data: this.resetPWForm
                }).then((data) => {
                    this.closeEditPW();
                    this.queryTable();
                }).catch((err) => {
                    resStatus(err, this)
                })
			},
			closeEditPW(){
                this.resetPWVisible = false;
			},

            getUserDetail(id){
                return ajax({
                    url: ajaxUrls.authority.user + '/' + id,
                    method: 'get'
                })
			},
            editUser(id){
                this.dialogFormType = id ? 'edit' : 'add';
                this.dialogFormTitle = id ? '修改用户' : '添加用户';
				if(id){
				    this.getUserDetail(id).then( data => {
				        data = data.data;
						let groupIds = data.groupList.map(item => {
                            return item.id
                        });
                        this.dialogForm = Object.assign({}, data, {groupIds: groupIds})
					})
				}else{
                    this.dialogForm = {
                        id: '',
                        groupIds: [],
                        loginName: '',
                        realName: '',
                        email: '',
                        tel: '',
                        password: '',
                        needGaCheck: 0,
                        isLocked: 0,
                    };
                }
                this.dialogFormVisible = true;
			},
			submitEditUser(){
                let method = this.dialogForm.id ? 'put' : 'post';

                this.$refs.dialogUser.validate((valid) => {
                    if (valid) {
                        ajax({
                            url: ajaxUrls.authority.user,
                            method: method,
                            data: Object.assign({}, this.dialogForm, {groupIds: this.dialogForm.groupIds.join()})
                        }).then((data) => {
                            this.closeEditUser();
                            this.queryTable();
                        }).catch((err) => {
                            resStatus(err, this)
                        })
                    } else {
                        return false;
                    }
                })

			},
			closeEditUser(){
                this.dialogFormVisible = false;
			},
			delUser(id){
                this.$confirm('确认删除这个菜单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax({
                        url: ajaxUrls.authority.user + '/' + id,
                        method: 'delete'
                    }).then((data) => {
                        this.queryTable();
                    }).catch((err) => {
                        resStatus(err, this)
                    })
                }).catch((err) => {
                });
			},
            changeNeedGaCheck(id, index, state){

                this.$confirm('确认要修改？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax({
                        url: ajaxUrls.authority.user + '/gacheck/' + id + '/' + state,
                        method: 'put'
                    }).then((data) => {
                        this.queryTable();
                    }).catch((err) => {
                        resStatus(err, this)
                    })
                }).catch(() => {
                    this.tableData[index].needGaCheck = state === 0 ? 1 : 0;
                });
			},
            changeIsLocked(id, index , state){
                this.$confirm('确认要修改？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax({
                        url: ajaxUrls.authority.user + '/lock/' + id + '/' + state,
                        method: 'put'
                    }).then((data) => {
                        this.queryTable();
                    }).catch((err) => {
                        resStatus(err, this)
                    })
                }).catch(() => {
                    this.tableData[index].isLocked = state === 0 ? 1 : 0;
                });
			},
			resetQueryTable(){
                this.paginationData.currentPage = 1;
                this.queryTable();
			},
            queryTable(){
				ajax({
					url: ajaxUrls.authority.user + '/'+this.paginationData.currentPage+'/'+this.paginationData.pageSize,
					method: 'get',
					data: this.queryData
				}).then((data) => {
				    data = data.data;
				    this.tableData = data.list;
				    this.paginationData.total = data.total;
				})
			},
			getGroupDropList(){
                ajax({
                    url: ajaxUrls.authority.groupDropList,
                    method: 'get'
                }).then((data) => {
                    this.groupDropList = data.data;
				})
			}
		},
		components:{
			card,
            tableDataFail
		}
	}
</script>

<style lang="scss">
	.sub-container__gray{
		padding: 10px 0;
	}
	.user-qrcode{
		display: block;
		width: 100%;
		margin: 0 auto;
	}
	.dialog-center{
		text-align: center;
	}
</style>