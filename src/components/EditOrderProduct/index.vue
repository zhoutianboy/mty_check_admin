<template>
  <el-dialog
    title="修改供应商货品"
    :visible.sync="dialogFormVisible"
    :width="dialogFormWidth.dialog"
    @close="handleDialogCloseAction('dialogForm')"
  >
    <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" @submit.native.prevent>
      <el-form-item label="订单编号：" :label-width="dialogFormWidth.label">
        <span>{{ orderData.sn }}</span>
      </el-form-item>
      <el-form-item label="货 品：" :label-width="dialogFormWidth.label">
        <span>{{ productData.name }}（{{ productData.sn }}）</span>
      </el-form-item>
      <el-form-item label="价 格：" :label-width="dialogFormWidth.label" prop="price">
        <PriceInput :price.sync="dialogForm.price" :width="dialogFormWidth.value" />
      </el-form-item>
      <el-form-item label="数 量：" :label-width="dialogFormWidth.label" prop="num">
        <el-input-number
          v-model="dialogForm.num"
          :step="1"
          autocomplete="off"
          :style="{ width: dialogFormWidth.value }"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogCancelAction">取 消</el-button>
      <el-button :loading="dialogFormLoading" :disabled="dialogFormLoading" type="primary" @click="handleDialogSubmitAction('dialogForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { validatePrice } from '@/utils/validator'
import PriceInput from '@/components/PriceInput'

export default {
  name: 'EditOrderProduct',
  components: {
    PriceInput
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderData: {
      type: Object,
      default: () => ({
        id: null,
        sn: null
      })
    },
    productData: {
      type: Object,
      default: () => ({
        id: null,
        name: null,
        price: null,
        num: null
      })
    },
    updateFn: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogFormLoading: false,
      dialogForm: {
        price: null,
        num: null
      },
      dialogRules: {
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { validator: validatePrice }
        ],
        num: [
          { required: true, message: '请输入数量', trigger: 'blur' }
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
      this.dialogForm.price = this.productData.price
      this.dialogForm.num = this.productData.num
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
            const { msg } = await this.updateFn({
              orderId: this.orderData.id,
              productId: this.productData.id,
              ...this.dialogForm
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
      this.dialogForm = {
        price: null,
        num: null
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
