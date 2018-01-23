<template>
    <el-dialog title="修改账户信息" :visible.sync="visible" @close="closeDialog()">
        <div class="account-checkout-tips">该账户涉及到商户账户结算，请不要随意更改</div>
        <el-form :model="formData" :rules="limitRules" ref="formCheckout" :label-width="'120px'" class="form-layout">
            <el-form-item label="支付宝账户" prop="alipayNum">
                <el-input v-model="formData.alipayNum" placeholder="请输入支付宝账号"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">关闭</el-button>
            <el-button type="primary" @click="submitDialog">确定提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import ajax from 'common/ajax.js'
    import ajaxUrls from 'common/ajaxUrls.js'
    export default{
        props: {
            shopNo: {
                required: true
            },
            success: {
                type: Function
            }
        },
        data(){
            return {
                visible: false,
                formData: {
                    alipayNum: ''
                },
                limitRules: {
                    alipayNum: [
                        {required: true, message: '请输入支付宝账号', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            submitDialog(){
                this.$refs.formCheckout.validate((valid) => {
                    if (valid) {
                        this.sendData();
                    } else {
                        return false;
                    }
                });
            },
            sendData(){
                return ajax({
                    method: 'post',
                    url: ajaxUrls.business.updateAlipayNum,
                    data: {
                        busId: this.shopNo,
                        alipayNum: this.formData.alipayNum
                    }
                }).then(data => {
                    this.$alert('修改成功', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.success(this.formData.alipayNum);
                            this.closeDialog();
                        }
                    });
                }).catch(e => {
                    this.$message.error(e.msg);
                })
            },
            openDialog(){
                this.visible = true;
            },
            closeDialog(){
                this.visible = false;
                this.$refs.formCheckout.resetFields();
            },
        }
    }
</script>
<style lang="scss">
    .account-checkout-tips{
        margin-bottom: 10px;
        .high{
            color: #ff5156;
        }
    }
</style>