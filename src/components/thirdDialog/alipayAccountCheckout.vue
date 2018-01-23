<template>
    <el-dialog title="账户认证" :visible.sync="visible" @close="closeDialog()">
        <div class="account-checkout-tips">发送验证码后，杭州富阳谦瑞金融服务外包有限公司会向该账户转账0.1元，验证码在转账备注中。<span class="high">请确保账户信息无误的情况下发送验证码，每个账户仅可发送一次。</span></div>
        <el-form :model="formData" :rules="limitRules" ref="formCheckout" :label-width="'120px'" class="form-layout">
            <el-form-item label="支付宝账户">
                <span>{{account}}</span>
                <el-button type="primary" :disabled="!!btnState" @click="sendVerification">
                    <template v-if="!!btnState">验证码已发送</template>
                    <template v-else>发送验证码</template>
                </el-button>
            </el-form-item>
            <el-form-item label="验证码" prop="verificationCode">
                <el-input v-model="formData.verificationCode"></el-input>
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
            account: {
                required: true
            },
            btnState: {
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
                    verificationCode: ''
                },
                limitRules: {
                    verificationCode: [
                        {required: true, message: '请填写验证码', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            sendVerification(){
                this.$emit('update:btnState', true);
                ajax({
                    method: 'post',
                    url: ajaxUrls.business.sendAlipayVCode,
                    data: {
                        shopNo: this.shopNo
                    }
                }).then(data => {

                }).catch(e => {
                    this.$message.error(e.msg);
                })
            },
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
                    url: ajaxUrls.business.compareAlipayVCode,
                    data: {
                        shopNo: this.shopNo,
                        verificationCode: this.formData.verificationCode
                    }
                }).then(data => {
                    this.$alert('验证成功', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.closeDialog();
                            this.success()
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