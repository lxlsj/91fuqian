<template>
	<div>
		<card>
			<h2 slot="header" class="card-title">{{pageTitle}}</h2>
			<div class="edit-wrapper">
				<el-form :model="data" :rules="dataRules" ref="formData" label-position="right" label-width="120px">
					<el-form-item prop="name" label="商户名称">
						<el-input v-model="data.name" auto-complete="off" placeholder="名称不超过15个字"></el-input>
					</el-form-item>
					<el-form-item prop="icon" label="商户图标">
						<el-upload
								class="avatar-uploader"
								:action="uploadUrl"
								:data="{splicingUrl: 'business'}"
								name="uploadImg"
								:show-file-list="false"
								:on-success="handleAvatarSuccess"
								:before-upload="beforeAvatarUpload">
							<img v-if="data.icon" :src="data.icon" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<span>(图片尺寸：130x130px，不超过20k)</span>
					</el-form-item>
					<el-form-item v-if="busId" label="授信额度">
						<span>{{data.creditLines}}元</span>
					</el-form-item>
					<el-form-item v-else prop="creditLines" label="授信额度">
						<el-input v-model.number="data.creditLines" auto-complete="off" placeholder="请输入商户授信额度">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item prop="direcor" label="商户负责人">
						<el-input v-model="data.direcor" auto-complete="off" placeholder="姓名至少2个字"></el-input>
					</el-form-item>
					<el-form-item prop="phone" label="负责人手机号">
						<el-input v-model="data.phone" auto-complete="off" placeholder="请输入负责人手机号"></el-input>
					</el-form-item>
					<el-form-item prop="companyName" label="企业名称">
						<el-input v-model="data.companyName" auto-complete="off" placeholder="企业名称不少于4个字"></el-input>
					</el-form-item>
					<el-form-item prop="legalPerson" label="法人姓名">
						<el-input v-model="data.legalPerson" auto-complete="off" placeholder="姓名至少2个字"></el-input>
					</el-form-item>
					<el-form-item prop="legalPersonId" label="法人身份证号">
						<el-input v-model="data.legalPersonId" auto-complete="off" placeholder="请输入法人身份证号"></el-input>
					</el-form-item>
					<template v-if="busId">
						<el-form-item label="支付宝账户">
							<span>{{data.alipayNum}}</span>
						</el-form-item>
						<el-form-item label="微信账户">
							<span>{{data.wechatNum}}</span>
						</el-form-item>
					</template>
					<template v-else>
						<el-form-item prop="alipayNum" label="支付宝账户">
							<el-input v-model="data.alipayNum" auto-complete="off" placeholder="请输入企业支付宝账号"></el-input>
						</el-form-item>
						<el-form-item prop="wechatNum" label="微信账户">
							<el-input v-model="data.wechatNum" auto-complete="off" placeholder="请输入企业微信账号"></el-input>
						</el-form-item>
					</template>
					<el-form-item prop="wechatMchId" label="微信商户号">
						<el-input v-model="data.wechatMchId" auto-complete="off" placeholder="请输入微信支付商户号"></el-input>
					</el-form-item>
					<el-form-item prop="channelId" label="关联渠道">
						<el-select v-model="data.channelId" placeholder="请选择借款渠道">
							<el-option v-for="item in channelOptions" :label="item.name" :value="item.channelId" :key="item.channelId"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="商户地址" required>
						<el-col :span="4">
							<el-form-item prop="province">
								<el-select v-model="data.province" placeholder="省" @change="provinceChange">
									<el-option v-for="item in provinceList" :label="item.name" :value="item.id" :key="item.id"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="1">&nbsp;</el-col>
						<el-col :span="4">
							<el-form-item prop="city">
								<el-select v-model="data.city" placeholder="市" @change="cityChange">
									<el-option v-for="item in cityList" :label="item.name" :value="item.id" :key="item.id"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="1">&nbsp;</el-col>
						<el-col :span="4">
							<el-form-item prop="area">
								<el-select v-model="data.area" placeholder="区">
									<el-option v-for="item in areaList" :label="item.name" :value="item.id" :key="item.id"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-form-item>
					<el-form-item prop="address" label="">
						<el-input v-model="data.address" auto-complete="off" type="textarea" placeholder="请输入详细地址"></el-input>
					</el-form-item>
					<el-form-item label="">
						<el-button type="primary" @click="submitData">提交</el-button>
						<el-button @click="goBack">返回</el-button>
					</el-form-item>
				</el-form>
			</div>
		</card>
	</div>
</template>

<script>
	import sidebar from 'components/layout/sidebar.vue'
	import card from 'components/layout/card.vue'
	import ajax from 'common/ajax.js'
    import ajaxUrls from 'common/ajaxUrls.js'
    import {qryChannelAll} from 'common/qryUnit.js'
	import hostsUrl from 'common/hostsUrl.js'

	export default{
		data(){
            let validateCreditLines = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('总额度不能为空'));
                } else if( !/^[1-9]\d*$/.test(value) ){
                    callback(new Error('输入内容格式不正确'));
                }else{
                    callback();
                }
            };
            let validatePhone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('负责人手机号不能为空'));
                } else if( !/^1\d{10}$/.test(value) ){
                    callback(new Error('请输入正确的手机号'));
                }else{
                    callback();
                }
            };
            let validatePayNo = (rule, value, callback) => {
                if(value === '' ){
                    callback(new Error('账户不能为空'));
				}else if(/^1\d{10}$/.test(value) || /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/.test(value)){
                    callback();
                }else{
                    callback(new Error('账户格式不正确'));
                }
            };
            let validateWechatMchId = (rule, value, callback) => {
                if(value === '' ){
                    callback(new Error('微信商户号不能为空'));
                }else if(/^\d{10}$/.test(value)){
                    callback();
                }else{
                    callback(new Error('账户格式不正确'));
                }
            };

            let name = (rule, value, callback) => {
                if(/^([\u4e00-\u9fa5]|[a-zA-Z])+$/.test(value)){
                    callback();
                }else{
                    callback(new Error('只能输入汉字，英文'));
                }
            };
			return{
                busId: '',
			    pageTitle: '',
                imageUrl: '',
                uploadUrl: ajaxUrls.upload,
			    data: {
                    name: '',
                    icon: '',
                    creditLines: '',
                    direcor: '',
                    phone: '',
                    companyName: '',
                    legalPerson: '',
                    legalPersonId: '',
                    alipayNum: '',
                    wechatNum: '',
                    wechatMchId: '',
                    channelId: '',
                    province: '',
                    city: '',
                    area: '',
                    address: '',
				},
                provinceList: [],
                cityList: [],
				areaList: [],
                channelOptions: [],
				dataRules: {
                    name: [
                        {required: true, message: '商户名称不能为空', trigger: 'blur'},
                        {message: '商户名称为2-15个字', trigger: 'blur', min: 2, max: 15}
					],
                    icon: [],
                    creditLines: [
                        {required: true, validator: validateCreditLines, trigger: 'blur' }
                    ],
                    direcor: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'},
                        {message: '姓名为2-15个字', trigger: 'blur', min: 2, max: 15},
                        { validator: name, trigger: 'blur' }
                    ],
                    phone: [
                        {required: true, message: '负责人手机号不能为空', trigger: 'blur'},
                        { validator: validatePhone, trigger: 'blur' }
                    ],
                    companyName: [
                        {required: true, message: '企业名称不少于4个字', trigger: 'blur', min: 4}
                    ],
                    legalPerson: [
                        {required: true, message: '法人姓名不能为空', trigger: 'blur'},
                        {message: '法人姓名为2-15个字', trigger: 'blur', min: 2, max: 15},
                        { validator: name, trigger: 'blur' }
                    ],
                    legalPersonId: [
                        {required: true, message: '身份证号格式不正确', trigger: 'blur', min: 15, max: 18}
                    ],
                    alipayNum: [
                        {required: true, message: '支付宝账户不能为空', trigger: 'blur' }
                    ],
                    wechatNum: [
                        {required: true, message: '微信账户不能为空', trigger: 'blur' }
                    ],
                    wechatMchId: [
                        {required: true, validator: validateWechatMchId, trigger: 'blur' }
                    ],
                    channelId: [
                        {required: true, message: '借款渠道不能为空', trigger: 'change'}
                    ],
                    province: [
                        {type: 'number', required: true, message: '地址不能为空', trigger: 'change'}
                    ],
                    city: [
                        {type: 'number', required: true, message: '地址不能为空', trigger: 'change'}
                    ],
                    area: [
                        {type: 'number', required: true, message: '地址不能为空', trigger: 'change'}
                    ],
                    address: [
                        {required: true, message: '详细地址不能为空', trigger: 'blur'}
                    ],
				},
				url: '',
				isInit: false
			}
		},
		mounted(){
            this.busId = this.$route.query.busId;
            qryChannelAll().then(data => {
                this.channelOptions = data.data
            });
            this.getProvinceList(0);
		    if(this.busId){
		        this.isInit = true;
                this.pageTitle = '编辑商户信息';
				this.url = ajaxUrls.business.update;
				this.getData().then( data => {
                    this.getCityList(this.data.province);
                    this.getAreaList(this.data.area);
				});
			}else{
                this.pageTitle = '创建商户';
                this.url = ajaxUrls.business.add
			}
		},
		methods: {
            handleAvatarSuccess(res){
                if(res.code === 'success'){
                    this.data.icon = hostsUrl.ossHost + res.data;
				}
			},
            beforeAvatarUpload(file){
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isGIF = file.type === 'image/gif';
                const isLt20k = file.size / 1024  <= 20;

                let checkFileType = true;
                let checkDimension = true;

                if (!isJPG && !isPNG && !isGIF) {
                    checkFileType = false;
                    this.$message.error('上传头像图片只能是 JPG PNG GIF 格式!');
                }
                if (!isLt20k) {
                    this.$message.error('上传头像图片大小不能超过 20k!');
                }
                return new Promise((resolve, reject) => {
                    if (checkFileType && window.FileReader) {
                        let reader = new FileReader();
                        let _this = this;
                        reader.onload = function (e) {
                            let img = new Image();
                            img.onload = function () {
                                let _width = img.width,
                                    _height = img.height;
                                if (_width !== 130 || _height !== 130) {
                                    _this.$message.error('图片尺寸必须为 130 * 130!');
                                    checkDimension = false;
                                }
                                if(checkFileType && isLt20k && checkDimension){
                                    resolve(true)
								}else{
                                    reject(false)
								}
                            };
                            img.src = e.target.result;
                        };
                        reader.readAsDataURL(file)
                    }else{
                        if(checkFileType && isLt20k && checkDimension){
                            resolve(true)
                        }else{
                            reject(false)
                        }
					}
				});
			},
			checkImgDimension(file){

			},
            provinceChange(){
                if(!this.isInit){
                    this.data.city = '';
                    this.data.area = '';
                    this.cityList = [];
                    this.areaList = [];
				}
                this.getCityList(this.data.province);
			},
			cityChange(){
                if(!this.isInit){
                    this.data.area = '';
                    this.areaList = [];
                }
                this.getAreaList(this.data.city);
			},
			getArea(id){
                return ajax({
                    method: 'get',
                    url: ajaxUrls.business.listArea,
                    data: {id: id}
                })
			},
			getProvinceList(id){
                this.getArea(id).then( (data) => {
			        this.provinceList = data.data;
				})
			},
            getCityList(id){
                this.getArea(id).then( (data) => {
                    this.cityList = data.data;
                })
            },
            getAreaList(id){
                this.getArea(id).then( (data) => {
                    this.areaList = data.data;

                    this.isInit = false;
                })
            },
            getData(){
                return ajax({
                    method: 'get',
					url: ajaxUrls.business.get,
					data: {busId: this.busId}
				}).then(data => {
				    this.data = data.data;
				})
			},
            submitData(){
                this.$refs.formData.validate((valid) => {
                    if (valid) {
                        this.sendData();
                    } else {
                        return false;
                    }
                });

			},
			sendData(){
                let data = this.busId ? Object.assign({busId: this.busId}, this.data) : this.data;
                data.addressInfo = this.getAddressInfo();
                return ajax({
                    method: 'post',
                    url: this.url,
                    data: data
                }).then(data => {
                    this.goBack();
                }).catch(e => {
                    this.$message.error(e.msg);
                })
			},
			getAddressInfo(){
			    let addressInfo = '';
                this.provinceList.some(item => {
                    if(item.id === this.data.province){
						addressInfo += item.name;
						return true;
					}
				});
                this.cityList.some(item => {
                    if(item.id === this.data.city){
                        addressInfo += item.name;
                        return true;
                    }
                });
                this.areaList.some(item => {
                    if(item.id === this.data.area){
                        addressInfo += item.name;
                        return true;
                    }
                });
                addressInfo += this.data.address;
				return addressInfo;
			},
			goBack(){
                history.back();
			}
		},
		components:{
			sidebar,
			card
		}
	}
</script>

<style lang="scss">
	.edit-wrapper{
		padding: 0 20px;
	}
	.card-title{
		padding: 0 20px;
		line-height: 36px;
		font-size: 18px;
	}
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #20a0ff;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>