<template>
	<div>
		<h2 class="page-title">用户组管理</h2>
		<card>
			<div slot="header" class="from-query">
				<el-form :inline="true" class="demo-form-inline">
					<el-form-item label="组名称">
						<el-input v-model="queryData.groupName" size="small" placeholder="组名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button size="small" type="primary" @click="resetQueryTable">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="sub-container clearfix">
				<el-button slot="header" type="primary" icon="plus" size="small" @click="editGroup()">添加</el-button>
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
								prop="groupName"
								align="center"
								label="组名称">
						</el-table-column>
						<el-table-column
								prop="memberNum"
								align="center"
								label="组内人数">
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
								<el-button type="text" icon="fa-sitemap" size="small" title="权限分配" @click="openDialogRelation(scope.row.id)"></el-button>
								<el-button type="text" icon="fa-user" size="small" title="管理成员" @click="openDialogGroup(scope.row.id, scope.row.groupName)"></el-button>
								<el-button type="text" icon="edit" size="small" title="修改" @click="editGroup(scope.row)"></el-button>
								<el-button type="text" icon="delete" size="small" title="删除" @click="delGroup(scope.row.id)"></el-button>
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
			<el-form :model="dialogForm" :rules="fromRule" ref="dialogForm" :label-width="'110px'" class="form-item__block">
				<el-form-item label="组名称" prop="">
					<el-input v-model="dialogForm.groupName"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="">
					<el-input v-model="dialogForm.sort"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeEditGroup">取 消</el-button>
				<el-button type="primary" @click="submitEditGroup">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="成员管理" :visible.sync="dialogGroupVisible">
			<p>组名称:{{groupFromData.groupName}}</p>
			<div class="transfer-wrapper">
				<el-row>
					<el-input class="ipt-width" placeholder="请输入内容" v-model="dialogGroupSourceIpt">
						<el-select v-model="dialogGroupSourceSelect" slot="prepend" placeholder="请选择">
							<el-option label="真实姓名" value="realName"></el-option>
							<el-option label="登录名" value="loginName"></el-option>
							<el-option label="邮箱" value="email"></el-option>
							<el-option label="已删除" value="delete"></el-option>
						</el-select>
						<el-button slot="append" icon="search" @click="searchGroup"></el-button>
					</el-input>
					<!--<el-input class="ipt-width fr" placeholder="filter" v-model="dialogGroupSourceIpt">-->
					<!--</el-input>-->
				</el-row>
				<el-transfer v-model="groupFromData.userIds" :data="dialogGroupSource"></el-transfer>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialogGroup">取 消</el-button>
				<el-button type="primary" @click="submitDialogGroup">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="权限分配" :visible.sync="dialogRelationVisible">
			<el-tree
					:data="treeData"
					show-checkbox
					node-key="id"
					highlight-current
					ref="tree"
					:props="{children: 'children',label: 'name'}"
					:default-checked-keys="checkedTree">
			</el-tree>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialogRelation">取 消</el-button>
				<el-button type="primary" @click="submitDialogRelation">确 定</el-button>
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
                dialogFormTitle: '添加用户组',
                dialogFormType: 'add',
			    dialogForm: {
                    id: '',
                    groupName: '',
                    sort: 0,
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

                dialogGroupVisible: false,
                dialogGroupSourceOrigin: [],
                dialogGroupSource: [],
                dialogGroupSourceSelect: 'realName',
                dialogGroupSourceIpt: '',
                groupFromData: {
                    id: '',
                    groupId: '',
					groupName: '',
                    userIds: []
				},

                queryData: {
                    groupName: ''
				},
                loading: false,
                paginationData:{
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                tableDataError: false,
                tableData: [],

                dialogRelationVisible: false,
				treeGroupId: '',
                treeData: [],
                checkedTree: [],
				originTree: [],
			}
		},
        mounted(){
		    this.queryTable();
		},
		methods: {
            getFullTree(groupId){
                return ajax({
                    url: ajaxUrls.authority.menus + '/fulltree/' + groupId,
                    method: 'get'
                })
			},
            format(arr, groupObj){
                arr.forEach(item => {
                    let pidKey = 'pid_'+item.id;
                    let group = groupObj[pidKey];
                    if(group){
                        if(item.children){
                            item.children.push(group);
                        }else{
                            item.children = group;
                        }
                        this.format(group, groupObj);
                    }
                })
            },
			formatChecked(disChecked, parentsObj, checked){
                let dis = [];
                disChecked.forEach(item => {
                    let _id = item;
                    let pid = parentsObj['id_'+_id];
                    do{
                        dis.push(_id);
                        _id = pid;
                        pid = parentsObj['id_'+_id];
					}while(pid !== undefined);
				});

                return checked.filter(item => {
                    return dis.indexOf(item) === -1
				});
			},
            openDialogRelation(id){
                this.treeGroupId = id;
                this.getFullTree(id).then( data => {
                    this.originTree = data.data;
                    let arr = data.data;
                    let distArr = [];
                    let groupObj = {};
                    let checked = [];
                    let parentsObj = {};
                    let disChecked = [];

                    arr.forEach( item => {
                        if(item.checked === 1){
                            checked.push(item.id)
						}else{
                            disChecked.push(item.id)
						}
                        if(item.pId === 0){
                            distArr.push(item);
                        }else{
                            let key = 'pid_'+item.pId;
                            let objKey = groupObj[key];
                            if(objKey){
                                objKey.push(item)
                            }else{
                                groupObj[key] = [item]
                            }
                        }

                        let idKey = 'id_'+item.id,
							idPid = item.pId;
                        parentsObj[idKey] = idPid;
                    });
                    this.format(distArr, groupObj);
                    this.treeData = distArr;
					this.checkedTree = this.formatChecked(disChecked, parentsObj, checked);
				});
                this.dialogRelationVisible = true;
			},

            closeDialogRelation(){
                this.dialogRelationVisible = false;
			},
			getPid(id){
                let pId = '';
                this.originTree.some(item => {
					if(id === item.id){
					    pId = item.pId;
                        return true;
					}
                });
                return pId;
			},
			getPids(id){
			    let pids = [];
			    let pid = this.getPid(id);
			    do{
                    if(pid === 0){
                        pid = '';
					}else{
                        pids.push(pid);
                        pid = this.getPid(pid);
					}
				}while (pid);
				return pids;
			},
            replenish(currentKeys){
                let checkedArr = [];
                currentKeys.forEach(item => {
                    let pIds = this.getPids(item);
                    checkedArr = checkedArr.concat(pIds)
				});
				let _arr = [];
				let checkedItem = {};
				checkedArr.forEach(item => {
				    // 该项是否检查过（有重复ID未去重）
				    if(checkedItem['id'+item]){
				        return;
					}else{
                        checkedItem['id'+item] = true;
					}
					// 原始数据中没有该id 则加入待加入组
				    if(currentKeys.indexOf(item) === -1){
                        _arr.push(item)
					}
				});
                return currentKeys.concat(_arr);
			},
            submitDialogRelation(){
                let currentKeys = this.$refs.tree.getCheckedKeys();
				let keys = this.replenish(currentKeys).join(',');
                ajax({
                    url: ajaxUrls.authority.groups + '/relation/menus',
                    method: 'post',
					data: {
                        groupId: this.treeGroupId,
                        menuIds: keys
					}
                }).then( data => {
                    this.closeDialogRelation();
                    this.queryTable();
				}).catch((err) => {
                    resStatus(err, this)
                })
			},
            getGroupRelation(groupId){
                return ajax({
                    url: ajaxUrls.authority.groups + '/relation/users/' + groupId,
                    method: 'get'
                })
			},
            openDialogGroup(groupId, groupName){
                this.dialogGroupSource = [];
                this.dialogGroupSourceSelect = 'realName';
                this.dialogGroupSourceIpt = '';
                this.groupFromData = {
                    groupId: groupId,
                    groupName: groupName,
					userIds: []
                };
                this.getGroupRelation(groupId).then( data => {
                    this.dialogGroupSource = this.dialogGroupSourceOrigin = data.data.map(item => {
                        return {
                            key: item.id,
                            label: `${ item.loginName } / ${ item.realName } / ${ item.email }`
                        }
					});
                    this.groupFromData.userIds = data.data.map(item => {
                        return item.id
                    });
				});
                this.dialogGroupVisible = true;
			},
            submitDialogGroup(){
                ajax({
                    url: ajaxUrls.authority.groups + '/relation/users',
                    method: 'post',
                    data: {
                        groupId: this.groupFromData.groupId,
                        userIds: this.groupFromData.userIds.join(',')
                    }
                }).then((data) => {
                    this.closeDialogGroup();
                    this.queryTable();
                }).catch((err) => {
                    resStatus(err, this)
                })
			},
            closeDialogGroup(){
                this.dialogGroupVisible = false;
			},
            searchGroup(){
                let data = {};
                data[this.dialogGroupSourceSelect] = this.dialogGroupSourceIpt;
                data.exceptIds = this.groupFromData.userIds.join(',');
                ajax({
                    url: ajaxUrls.authority.groups + '/unrelation/users/' +this.groupFromData.groupId,
                    method: 'get',
                    data: data
                }).then((data) => {
                    this.dialogGroupSourceOrigin = this.dialogGroupSource.filter(item => {
                        return this.groupFromData.userIds.some( id => {
                            return id === item.key;
                        });
					});
                    let dataList = data.data.length > 0 ? data.data.map(item => {
                        return {
                            key: item.id,
                            label: `${ item.loginName } / ${ item.realName } / ${ item.email }`
                        }
                    }) : [];
                    this.dialogGroupSource = dataList.concat(this.dialogGroupSourceOrigin);
                }).catch((err) => {
                    resStatus(err, this)
                })
			},
            editGroup(data){
                this.dialogFormType = data ? 'edit' : 'add';
                this.dialogFormTitle = data ? '修改用户组' : '添加用户组';
				if(data){
                    this.dialogForm = {
                        id: data.id,
                        groupName: data.groupName,
                        sort: data.sort,
                    };
				}else{
                    this.dialogForm = {
                        id: '',
                        groupName: '',
                        sort: 0,
                    };
                }
                this.dialogFormVisible = true;
			},
			submitEditGroup(){
                let method = this.dialogForm.id ? 'put' : 'post';

                this.$refs.dialogForm.validate((valid) => {
                    if (valid) {
                        ajax({
                            url: ajaxUrls.authority.groups,
                            method: method,
                            data: this.dialogForm
                        }).then((data) => {
                            this.closeEditGroup();
                            this.queryTable();
                        }).catch((err) => {
                            resStatus(err, this)
                        })
                    } else {
                        return false;
                    }
                })

			},
			closeEditGroup(){
                this.dialogFormVisible = false;
			},
			delGroup(id){
                this.$confirm('确认删除这个菜单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax({
                        url: ajaxUrls.authority.groups + '/' + id,
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
					url: ajaxUrls.authority.groups + '/'+this.paginationData.currentPage+'/'+this.paginationData.pageSize,
					method: 'get',
					data: this.queryData
				}).then((data) => {
				    data = data.data;
				    this.tableData = data.list;
				    this.paginationData.total = data.total;
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
	.transfer-wrapper{
		width: 658px;
		margin: 0 auto;
		.el-transfer-panel{
			width: 300px;
		}
		.el-input-group__prepend .el-select{
			width: 110px;
		}
	}
	.ipt-width{
		width: 300px;
	}
</style>