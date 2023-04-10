<template>
  <el-dialog
    title="指派员工"
    :visible.sync="dialogFormVisible"
    :width="dialogFormWidth.dialog"
    @close="handleDialogCloseAction('dialogForm')"
  >
    <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" @submit.native.prevent>
      <el-form-item label="选择员工：" :label-width="dialogFormWidth.label" prop="adminIds">
        <el-select v-model="dialogForm.adminIds" :loading="loading" :style="{ width: dialogFormWidth.value }" multiple placeholder="请选择">
          <el-option
            v-for="item in employeeOptions"
            :key="item.id"
            :label="item.realName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogCancelAction">取 消</el-button>
      <el-button :loading="dialogFormLoading" :disabled="dialogFormLoading" type="primary" @click="handleDialogSubmitAction('dialogForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { assignEmployee, existEmployeeIds } from '@/api/customer'
import { employeeList } from '@/api/employee'
import { linkTypeData } from '@/utils/constant'

export default {
  name: 'AssignEmployeeDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    customerId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: true,
      employeeOptions: [],
      dialogFormVisible: false,
      dialogFormLoading: false,
      dialogForm: {
        adminIds: []
      },
      dialogRules: {
        // adminIds: [
        //   { required: true, message: '请选择员工', trigger: 'blur' }
        // ]
      },
      dialogFormWidth: {
        dialog: '600px',
        label: '100px',
        value: '440px'
      }
    }
  },
  watch: {
    async visible(newVal, oldVal) {
      this.dialogFormVisible = newVal
      if (newVal) {
        try {
          await this.requestEmployeeList()
          const { data } = await existEmployeeIds(this.customerId)
          this.dialogForm.adminIds = data
        } finally {
          this.loading = false
        }
      }
    }
  },
  methods: {
    async requestEmployeeList() {
      try {
        this.tableLoading = true
        const { data } = await employeeList(linkTypeData.customer)
        this.employeeOptions = data
      } finally {
        this.tableLoading = false
      }
    },
    handleDialogCancelAction() {
      this.dialogFormVisible = false
    },
    handleDialogSubmitAction(formName) {
      this.dialogFormLoading = true
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const { msg } = await assignEmployee({
              ...this.dialogForm,
              customerId: this.customerId
            })
            this.$message.success(msg)
            this.handleDialogCancelAction(formName)
            this.$emit('submit')
          } catch (error) {
            this.dialogFormLoading = false
          }
        }
        this.dialogFormLoading = false
      })
    },
    handleDialogCloseAction(formName) {
      this.$emit('update:visible', false)
      this.loading = true
      this.dialogForm = {
        adminIds: []
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
