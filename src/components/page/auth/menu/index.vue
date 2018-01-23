<template>
	<div>
		<h2 class="page-title">菜单管理</h2>
		<card>
			<div slot="header" class="from-query">
				<el-form :inline="true" class="demo-form-inline">
					<el-form-item label="系统">
						<el-select v-model="queryData.sysId" size="small" :clearable="true" placeholder="全部">
							<el-option v-for="opt in sysTree" :label="opt.menuName" :value="opt.sysId || 0" :key="opt.sysId || 0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="URL">
						<el-input v-model="queryData.menuUrl" size="small" placeholder="URL地址"></el-input>
					</el-form-item>
					<el-form-item label="权限定位标识">
						<el-input v-model="queryData.menuUri" size="small" placeholder="权限定位标识"></el-input>
					</el-form-item>
					<el-form-item label="菜单名">
						<el-input v-model="queryData.menuName" size="small" placeholder="菜单名"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button size="small" type="primary" @click="resetQueryTable">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="sub-container clearfix">
					<span class="sub-container__gray fl">
						<el-breadcrumb separator="/">
						  <el-breadcrumb-item v-for="(item, index) in breadcrumb" @click.native="changeBreadcrumb(index)" :key="item.id">{{item.name}}</el-breadcrumb-item>
						</el-breadcrumb>
					</span>
				<el-button class="fr" slot="header" type="primary" icon="plus" size="small" @click="editMenu()">同级菜单</el-button>
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
								align="center"
								label="菜单名">
							<template scope="scope">
								<el-button type="text" size="small" @click="changeParentId(scope.row.id, scope.row.menuName)">{{scope.row.menuName}}</el-button>
							</template>
						</el-table-column>
						<el-table-column
								prop="parentName"
								align="center"
								label="父菜单">
						</el-table-column>
						<el-table-column
								prop="menuUri"
								align="center"
								label="权限定位标识">
						</el-table-column>
						<el-table-column
								prop="menuUrl"
								align="center"
								label="url地址">
						</el-table-column>
						<el-table-column
								align="center"
								label="显示">
							<template scope="scope">
								<i v-if="scope.row.isShow === 1" class="el-icon-fa-check"></i>
								<i v-else class="el-icon-fa-close"></i>
							</template>
						</el-table-column>
						<el-table-column
								prop="sort"
								align="center"
								label="排序">
						</el-table-column>
						<el-table-column
								align="center"
								label="操作">
							<template scope="scope">
								<el-button type="text" size="small" title="修改" icon="edit" @click="editMenu(scope.row)"></el-button>
								<el-button type="text" size="small" title="删除" icon="delete" @click="delMenu(scope.row.id)"></el-button>
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
			<el-form :model="dialogForm" :rules="fromRule" ref="dialogMenu" :label-width="'110px'" class="form-item__block">
				<el-form-item label="父菜单" >
					{{dialogForm.parentName}}
				</el-form-item>
				<el-form-item label="是否显示" prop="isShow">
					<el-select v-model.number="dialogForm.isShow" placeholder="请选择活动区域">
						<el-option label="显示" :value="1"></el-option>
						<el-option label="不显示" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="菜单名" prop="menuName">
					<el-input v-model="dialogForm.menuName"></el-input>
				</el-form-item>
				<el-form-item label="权限定位标识" prop="menuUri">
					<el-input v-model="dialogForm.menuUri"></el-input>
				</el-form-item>
				<el-form-item label="前端地址">
					<el-input v-model="dialogForm.menuUrl"></el-input>
				</el-form-item>
				<el-form-item label="菜单图标">
					<el-input v-model="dialogForm.menuIcon"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input v-model.number="dialogForm.sort"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeEditMenu">取 消</el-button>
				<el-button type="primary" @click="submitEditMenu">确 定</el-button>
			</div>
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
                dialogFormTitle: '添加菜单',
                dialogFormType: 'add',
			    dialogForm: {
                    id: '',
                    parentId: 0,
                    isShow: 1,
                    menuName: '',
                    menuUri: '',
                    menuUrl: '',
                    menuIcon: '',
                    sort: 0
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
                queryData: {
                    sysId: 0,
                    menuUrl: '',
                    menuUri: '',
                    menuName: '',
                    parentId: ''
				},
				sysTree: [],
                loading: false,
                paginationData:{
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                tableDataError: false,
                tableData: [],
                breadcrumb: [{
                    id: 0,
					name: 'ROOT'
				}]
			}
		},
        mounted(){
		    this.getSysMenu();
		    this.queryTable();
		},
		methods: {
            editMenu(data){
                this.dialogFormType = data ? 'edit' : 'add';
                this.dialogFormTitle = data ? '修改菜单' : '添加菜单';

                let currentBreadcrumb = this.breadcrumb[this.breadcrumb.length-1];
                let parentId = currentBreadcrumb.id, parentName = currentBreadcrumb.name;

                this.dialogForm = data ? {
                    id: data.id,
					parentId: data.parentId,
					parentName: data.parentName === '--' ? 'ROOT' : data.parentName,
					isShow: data.isShow,
					menuName: data.menuName,
					menuUri: data.menuUri,
					menuUrl: data.menuUrl,
					menuIcon: data.menuIcon,
					sort: data.sort
                } : {
                    id: '',
                    parentId: parentId,
					parentName: parentName,
                    isShow: 1,
                    menuName: '',
                    menuUri: '',
                    menuUrl: '',
                    menuIcon: '',
                    sort: 0
                };
                this.dialogFormVisible = true;
			},
			submitEditMenu(){
                let method = this.dialogForm.id ? 'put' : 'post';

                this.$refs.dialogMenu.validate((valid) => {
                    if (valid) {
                        ajax({
                            url: ajaxUrls.authority.menus,
                            method: method,
                            data: this.dialogForm
                        }).then((data) => {
                            this.closeEditMenu();
                            this.queryTable();
                        }).catch((err) => {
                            resStatus(err, this)
                        })
                    } else {
                        return false;
                    }
                })

			},
			closeEditMenu(){
                this.dialogFormVisible = false;
			},
			delMenu(id){
                this.$confirm('确认删除这个菜单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax({
                        url: ajaxUrls.authority.menus + '/' + id,
                        method: 'delete'
                    }).then((data) => {
                        this.queryTable();
                    }).catch((err) => {
                        resStatus(err, this)
                    })
                }).catch((err) => {
                });
			},
            changeBreadcrumb(index){
                let item = this.breadcrumb[index];
                this.queryData.parentId = item.id;
                this.queryData.sysId = '';
                this.paginationData.currentPage = 1;
                this.queryTable();
				this.breadcrumb.splice(index+1, this.breadcrumb.length);
			},
            changeParentId(parentId, name){
                this.breadcrumb.push({
					id: parentId,
					name: name
				});
                this.queryData.parentId = parentId;
                this.queryData.sysId = '';
                this.paginationData.currentPage = 1;
                this.queryTable();
			},
			resetQueryTable(){
                this.queryData.parentId = 0;
                this.paginationData.currentPage = 1;
                this.breadcrumb = [{
                    id: 0,
                    name: 'ROOT'
                }];
                this.queryTable();
			},
            queryTable(){
				ajax({
					url: ajaxUrls.authority.menus + '/'+this.paginationData.currentPage+'/'+this.paginationData.pageSize,
					method: 'get',
					data: this.queryData
				}).then((data) => {
				    data = data.data;
				    this.tableData = data.list;
				    this.paginationData.total = data.total;
				})
			},
			getSysMenu(){
                ajax({
                    url: ajaxUrls.authority.sysTree,
                    method: 'get'
                }).then((data) => {
                    this.sysTree = data.data;
				})
			},
            handleCurrentChange(page){
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
</style>