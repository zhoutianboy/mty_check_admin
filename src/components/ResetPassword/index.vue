<template>
  <el-dialog
    title="重置密码"
    :visible.sync="dialogFormVisible"
    :width="dialogFormWidth.dialog"
    @close="handleDialogCloseAction('dialogForm')"
  >
    <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules">
      <el-form-item label="新密码：" :label-width="dialogFormWidth.label" prop="newPassword">
        <el-input v-model="dialogForm.newPassword" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码：" :label-width="dialogFormWidth.label" prop="surePassword">
        <el-input v-model="dialogForm.surePassword" type="password" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogCancelAction">取 消</el-button>
      <el-button :loading="dialogFormLoading" :disabled="dialogFormLoading" type="primary" @click="handleDialogSubmitAction('dialogForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ResetPassword',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    requestName: {
      type: Function,
      default() {}
    },
    adminId: {
      type: Number,
      default: null
    }
  },
  data() {
    const validateSurePassword = async(rule, value, callback) => {
      const { newPassword } = this.dialogForm
      if (value !== newPassword) {
        callback(new Error('确认密码必须和新密码相同'))
      }
      callback()
    }
    return {
      dialogFormVisible: false,
      dialogFormLoading: false,
      dialogForm: {
        newPassword: '',
        surePassword: ''
      },
      dialogRules: {
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        surePassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validateSurePassword, trigger: 'blur' }
        ]
      },
      dialogFormWidth: {
        dialog: '600px',
        label: '100px',
        value: '160px'
      }
    }
  },
  watch: {
    visible(newVal, oldVal) {
      this.dialogFormVisible = newVal
    }
  },
  methods: {
    handleDialogCancelAction() {
      this.dialogFormVisible = false
    },
    handleDialogSubmitAction(formName) {
      this.dialogFormLoading = true
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const { msg } = await this.requestName({ ...this.dialogForm, adminId: this.adminId })
            this.$message.success(msg)
            this.handleDialogCancelAction(formName)
          } catch (error) {
            this.dialogFormLoading = false
          }
        }
        this.dialogFormLoading = false
      })
    },
    handleDialogCloseAction(formName) {
      this.$emit('update:visible', false)
      this.dialogForm = {
        id: null,
        name: null,
        person: null,
        phone: null,
        gender: 1,
        address: null,
        avatar: null
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    }
  }
}
</script>

<style scoped>

</style>
