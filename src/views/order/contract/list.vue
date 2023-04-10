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
        <el-button
          v-if="authData.isPurchase"
          :loading="paymentLoading"
          :disabled="!contractData.id"
          type="warning"
          style="float: right;margin-left: 12px"
          icon="el-icon-document"
          @click="handleTablePurchaseAction"
        >
          生成采购单
        </el-button>
        <el-button
          v-if="authData.isPay"
          :loading="paymentLoading"
          :disabled="!contractData.id"
          type="warning"
          style="float: right;margin-left: 12px"
          icon="el-icon-document"
          @click="handleTablePaymentAction"
        >
          付款明细
        </el-button>
        <el-button v-if="authData.isAdd" type="primary" style="float: right" icon="el-icon-plus" @click="handleTableAddAction">新增</el-button>
      </div>
      <el-table
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="tableData"
        border
        highlight-current-row
        class="table-wrap"
        @current-change="handleTableCurrentChange"
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
          prop="sn"
          label="编号"
          center
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="name"
          label="客户名称"
          center
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="totalPrice"
          label="总价"
          center
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.totalPrice }}元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="transportPrice"
          label="运费"
          center
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.transportPrice }}元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remainMoney"
          label="未付金额"
          center
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.remainMoney }}元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          center
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ formatLabelShow(contractStatusTypeOptions, scope.row.status) }}</span>
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
          width="240"
        >
          <template slot-scope="scope">
            <el-button v-if="authData.isEdit" @click="handleTableEditAction(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="authData.isDelete" type="danger" @click="handleTableDeleteAction(scope.$index, scope.row)">删除</el-button>
            <el-button v-if="authData.isRelate" type="warning" @click="handleTableRelateAction(scope.$index, scope.row)">货品明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageData.index"
        :page-sizes="[10, 20, 30, 40]"
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
      <el-form ref="dialogForm" v-loading="loading" :model="dialogForm" :rules="dialogRules" @submit.native.prevent>
        <el-form-item label="选择客户：" :label-width="dialogFormWidth.label" prop="customerId">
          <el-select v-model="dialogForm.customerId" placeholder="请选择" @change="handleCustomerChangeAction">
            <el-option
              v-for="item in customerOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人：" :label-width="dialogFormWidth.label" prop="person">
          <el-input v-model="dialogForm.person" autocomplete="off" :style="{ width: dialogFormWidth.value }" />
        </el-form-item>
        <el-form-item label="联系方式：" :label-width="dialogFormWidth.label" prop="phone">
          <el-input v-model="dialogForm.phone" autocomplete="off" :style="{ width: dialogFormWidth.value }" />
        </el-form-item>
        <el-form-item label="联系地址：" :label-width="dialogFormWidth.label" prop="address">
          <el-input v-model="dialogForm.address" autocomplete="off" />
        </el-form-item>
        <el-form-item label="总 价：" :label-width="dialogFormWidth.label" prop="totalPrice">
          <PriceInput :price.sync="dialogForm.totalPrice" :width="dialogFormWidth.value" />
        </el-form-item>
        <el-form-item label="发货地址：" :label-width="dialogFormWidth.label" prop="sendAddress">
          <el-input v-model="dialogForm.sendAddress" autocomplete="off" />
        </el-form-item>
        <el-form-item label="收货地址：" :label-width="dialogFormWidth.label" prop="receiveAddress">
          <el-input v-model="dialogForm.receiveAddress" autocomplete="off" />
        </el-form-item>
        <el-form-item label="运 费：" :label-width="dialogFormWidth.label" prop="transportPrice">
          <PriceInput :price.sync="dialogForm.transportPrice" :width="dialogFormWidth.value" />
        </el-form-item>
        <el-form-item label="备 注：" :label-width="dialogFormWidth.label" prop="remark">
          <el-input v-model="dialogForm.remark" type="textarea" autocomplete="off" />
        </el-form-item>
        <el-form-item label="合 同：" :label-width="dialogFormWidth.label" prop="avatar">
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
import { mapGetters, mapActions } from 'vuex'
import { deleteFile } from '@/api/file'
import { contractPageList, addContract, deleteContract, updateContract } from '@/api/contract'
import PriceInput from '@/components/PriceInput'
import FileUpload from '@/components/FileUpload'
import { validatePhone, validatePrice } from '@/utils/validator'
import { customerList } from '@/api/customer'
import { contractStatusTypeOptions } from '@/utils/constant'

export default {
  name: 'ContractList',
  components: {
    PriceInput,
    FileUpload
  },
  data() {
    return {
      loading: true,
      contractStatusTypeOptions,
      customerOptions: [],
      searchForm: {
        keyword: null
      },
      pageData: {
        page: 1,
        size: 10,
        total: 0
      },
      tableLoading: true,
      paymentLoading: false,
      tableData: [],
      contractData: {},
      dialogFormVisible: false,
      dialogFormLoading: false,
      dialogFormSubmit: false,
      dialogForm: {
        id: null,
        customerId: null,
        name: null,
        person: null,
        phone: null,
        address: null,
        totalPrice: '0.00',
        sendAddress: null,
        receiveAddress: null,
        transportPrice: '0.00',
        remark: null,
        files: []
      },
      dialogRules: {
        customerId: [
          { required: true, message: '请选择客户', trigger: 'blur' }
        ],
        person: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: validatePhone }
        ],
        address: [
          { required: true, message: '请输入联系地址', trigger: 'blur' }
        ],
        // totalPrice: [
        //   { required: true, message: '请输入总价', trigger: 'blur' },
        //   { validator: validatePrice }
        // ],
        sendAddress: [
          { required: true, message: '请输入发货地址', trigger: 'blur' }
        ],
        receiveAddress: [
          { required: true, message: '请输入收货地址', trigger: 'blur' }
        ],
        transportPrice: [
          { required: true, message: '请输入运费', trigger: 'blur' },
          { validator: validatePrice }
        ]
      },
      dialogFormWidth: {
        dialog: '600px',
        label: '120px',
        value: '180px'
      },
      authData: {
        isAdd: 'contract:add',
        isEdit: 'contract:edit',
        isDelete: 'contract:delete',
        isRelate: ['contract:add', 'contract:edit'],
        isPay: 'contract:pay',
        isPurchase: 'contract:purchase'
      },
      tempFileList: []
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]),

    initDialogTitle() {
      return !this.dialogForm.id ? '新增合同单' : '编辑合同单'
    }
  },
  async created() {
    // 获取按钮权限
    this.authData = await this.checkActionList(this.authData)

    await this.requestContractPageList()
  },
  methods: {
    ...mapActions('user', [
      'checkActionList'
    ]),
    indexMethod(indexVal) {
      const { page, size } = this.pageData
      return (page - 1) * size + (indexVal + 1)
    },
    async requestContractPageList() {
      try {
        this.tableLoading = true
        const { data } = await contractPageList({ ...this.pageData, ...this.searchForm })
        const { list, total } = data
        this.tableData = list
        this.pageData.total = total
      } finally {
        this.tableLoading = false
      }
    },
    async requestCustomerList() {
      try {
        this.loading = true
        const { data } = await customerList()
        this.customerOptions = data
      } finally {
        this.loading = false
      }
    },
    handleSearchAction() {
      this.pageData.page = 1
      this.requestContractPageList()
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.requestContractPageList()
    },
    handleCurrentChange(value) {
      this.pageData.page = value
      this.requestContractPageList()
    },
    handleTableCurrentChange(currentRow, oldCurrentRow) {
      this.contractData = { ...currentRow }
    },
    handleTablePurchaseAction() {
      const { id, sn } = this.contractData
      this.$router.push('/order/contractPurchase?id=' + id + '&sn=' + sn)
    },
    handleTablePaymentAction() {
      const { id, sn } = this.contractData
      this.$router.push('/order/contractPay?id=' + id + '&sn=' + sn)
    },
    handleTableAddAction() {
      this.tempFileList = []
      this.dialogFormVisible = true
      this.requestCustomerList()
    },
    handleTableEditAction(index, item) {
      this.tempFileList = item.files
      this.dialogForm = { ...item, files: item.files || [] }
      this.dialogFormVisible = true
      this.requestCustomerList()
    },
    handleTableDeleteAction(index, item) {
      this.deleteCommonFn(item)
    },
    handleTableRelateAction(index, item) {
      this.$router.push('/order/contractRelate?id=' + item.id + '&sn=' + item.sn)
    },
    deleteCommonFn({ id, sn }) {
      this.$confirm('确认删除合同单【' + sn + '】吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteContract(id)
        this.$message.success(msg)
        await this.requestContractPageList()
      })
    },
    handleCustomerChangeAction(value) {
      const { person, phone, address } = this.customerOptions.find(item => item.id === value)
      Object.assign(this.dialogForm, {
        person,
        phone,
        address,
        receiveAddress: address
      })
    },
    handleDialogCancelAction() {
      this.dialogFormVisible = false
    },
    handleDialogSubmitAction(formName) {
      this.dialogFormLoading = true
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const requestName = !this.dialogForm.id ? addContract : updateContract
          try {
            const files = this.dialogForm.files.map(({ status, uid, ...other }) => other)
            const { msg } = await requestName({ ...this.dialogForm, files })
            this.$message.success(msg)
            this.dialogFormSubmit = true
            this.handleDialogCancelAction(formName)
            await this.requestContractPageList()
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
        customerId: null,
        name: null,
        person: null,
        phone: null,
        address: null,
        totalPrice: '0.00',
        sendAddress: null,
        receiveAddress: null,
        transportPrice: '0.00',
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
