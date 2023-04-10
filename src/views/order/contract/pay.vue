<template>
  <div class="page-container">
    <el-form :inline="true" :model="searchForm" class="search-form-inline" @submit.native.prevent>
      <el-form-item label="搜索内容：">
        <el-input v-model="searchForm.keyword" clearable placeholder="请输入搜索内容" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearchAction">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-page-wrap">
      <div class="table-action clearfix">
        <el-button type="text">当前合同单编号：{{ contractData.sn }}</el-button>
        <el-button v-if="authData.isAdd" type="primary" style="float: right" icon="el-icon-plus" @click="handleTableAddAction">新增记录</el-button>
      </div>
      <el-table
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="tableData"
        row-key="id"
        border
        class="table-wrap"
      >
        <el-table-column
          :index="indexMethod"
          type="index"
          label="序号"
          width="50"
          center
          align="center"
        />
        <el-table-column
          prop="name"
          label="客户名称"
          center
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="person"
          label="汇款人"
          center
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="phone"
          label="联系方式"
          center
          align="center"
          width="100"
        />
        <el-table-column
          prop="money"
          label="回款金额"
          center
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.money }}元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remainMoney"
          label="剩余金额"
          center
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.remainMoney }}元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createName"
          label="创建人"
          center
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          center
          align="center"
          width="140"
        />
        <el-table-column
          prop="updateName"
          label="更新人"
          center
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
          center
          align="center"
          width="140"
        />
        <el-table-column
          label="操作"
          center
          align="center"
          :width="150"
        >
          <template slot-scope="scope">
            <el-button v-if="authData.isEdit" @click="handleTableEditAction(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="authData.isDelete" type="danger" @click="handleTableDeleteAction(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="!tableLoading"
        :current-page="pageData.index"
        :page-sizes="[1, 2, 5, 10, 20, 30, 40]"
        :page-size="pageData.size"
        :total="pageData.total"
        layout="total, sizes, prev, pager, next, jumper"
        class="page-wrap"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      :title="initDialogTitle"
      :visible.sync="dialogFormVisible"
      :width="dialogFormWidth.dialog"
      @close="handleDialogCloseAction('dialogForm')"
    >
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" @submit.native.prevent>
        <el-form-item label="汇款人：" :label-width="dialogFormWidth.label" prop="person">
          <el-input v-model="dialogForm.person" autocomplete="off" :style="{ width: dialogFormWidth.value }" />
        </el-form-item>
        <el-form-item label="联系方式：" :label-width="dialogFormWidth.label" prop="phone">
          <el-input v-model="dialogForm.phone" autocomplete="off" :style="{ width: dialogFormWidth.value }" />
        </el-form-item>
        <el-form-item label="回款金额：" :label-width="dialogFormWidth.label" prop="money">
          <PriceInput :price.sync="dialogForm.money" :width="dialogFormWidth.value" />
        </el-form-item>
        <el-form-item label="备 注：" :label-width="dialogFormWidth.label" prop="remark">
          <el-input v-model="dialogForm.remark" type="textarea" autocomplete="off" />
        </el-form-item>
        <el-form-item label="附 件：" :label-width="dialogFormWidth.label" prop="avatar">
          <FileUpload :list.sync="dialogForm.files" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCancelAction">取 消</el-button>
        <el-button :loading="dialogFormLoading" :disabled="dialogFormLoading" type="primary" @click="handleDialogSubmitAction('dialogForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { paymentPageList, deletePayment, addPayment, updatePayment } from '@/api/contract'
import PriceInput from '@/components/PriceInput'
import FileUpload from '@/components/FileUpload'
import { validatePhone, validatePrice } from '@/utils/validator'
import { deleteFile } from '@/api/file'

export default {
  name: 'ContractPay',
  components: {
    PriceInput,
    FileUpload
  },
  data() {
    return {
      contractData: {},
      searchForm: {
        keyword: null
      },
      pageData: {
        page: 1,
        size: 10,
        total: 0
      },
      tableLoading: true,
      tableData: [],
      paymentData: {},
      dialogFormVisible: false,
      dialogFormLoading: false,
      dialogFormSubmit: false,
      dialogForm: {
        id: null,
        person: null,
        phone: null,
        money: '0.00',
        remark: null,
        files: []
      },
      dialogRules: {
        person: [
          { required: true, message: '请输入汇款人', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: validatePhone }
        ],
        money: [
          { required: true, message: '请输入总价', trigger: 'blur' },
          { validator: validatePrice }
        ]
      },
      dialogFormWidth: {
        dialog: '600px',
        label: '120px',
        value: '180px'
      },
      authData: {
        isAdd: 'contract:pay',
        isEdit: 'contract:pay',
        isDelete: 'contract:pay'
      }
    }
  },
  computed: {
    initDialogTitle() {
      return !this.dialogForm.id ? '新增记录' : '编辑记录'
    }
  },
  async created() {
    const { id, sn } = this.$route.query
    if (!id) {
      return this.$message.warning('缺少合同单id参数')
    }
    this.contractData = {
      id: parseInt(id.toString()),
      sn
    }

    // 获取按钮权限
    this.authData = await this.checkActionList(this.authData)

    await this.requestPaymentPageList()
  },
  methods: {
    ...mapActions('user', [
      'checkActionList'
    ]),
    indexMethod(indexVal) {
      const { page, size } = this.pageData
      return (page - 1) * size + (indexVal + 1)
    },
    async requestPaymentPageList() {
      try {
        this.tableLoading = true
        const { data } = await paymentPageList({
          id: this.contractData.id,
          ...this.pageData,
          ...this.searchForm
        })
        const { list, total } = data
        this.tableData = list
        this.pageData.total = total
      } finally {
        this.tableLoading = false
      }
    },
    handleSearchAction() {
      this.pageData.page = 1
      this.requestPaymentPageList()
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.requestPaymentPageList()
    },
    handleCurrentChange(value) {
      this.pageData.page = value
      this.requestPaymentPageList()
    },
    handleTableAddAction() {
      this.dialogFormVisible = true
    },
    handleTableEditAction(index, item) {
      this.dialogForm = { ...item }
      this.dialogFormVisible = true
    },
    handleTableDeleteAction(index, item) {
      this.deleteCommonFn(item)
    },
    deleteCommonFn({ id }) {
      this.$confirm('确认删除该付款记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { msg } = await deletePayment(id)
        this.$message.success(msg)
        await this.requestPaymentPageList()
      })
    },
    handleDialogCancelAction() {
      this.dialogFormVisible = false
    },
    handleDialogSubmitAction(formName) {
      this.dialogFormLoading = true
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const requestName = !this.dialogForm.id ? addPayment : updatePayment
          try {
            const files = this.dialogForm.files.map(({ status, uid, ...other }) => other)
            const { msg } = await requestName({
              ...this.dialogForm,
              files,
              contractId: this.contractData.id
            })
            this.$message.success(msg)
            this.dialogFormSubmit = true
            this.handleDialogCancelAction(formName)
            await this.requestPaymentPageList()
          } catch (error) {
            this.dialogFormLoading = false
          }
        }
        this.dialogFormLoading = false
      })
    },
    handleDialogCloseAction(formName) {
      const { files } = this.dialogForm
      if (files && JSON.stringify(files) !== JSON.stringify(this.tempFileList)) {
        if (this.dialogFormSubmit) {
          if (this.tempFileList) {
            this.tempFileList.forEach(item => {
              deleteFile(item.url)
            })
          }
        } else {
          files.forEach(item => {
            deleteFile(item.url)
          })
        }
      }
      this.dialogFormSubmit = false
      this.dialogForm = {
        id: null,
        person: null,
        phone: null,
        money: '0.00',
        remark: null,
        files: []
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
