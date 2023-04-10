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
        <el-button v-if="authData.isAdd" type="primary" style="float: right" icon="el-icon-plus" @click="handleTableAddAction">新增</el-button>
      </div>
      <el-table
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="tableData"
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
          prop="sn"
          label="编号"
          center
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="name"
          label="供应商名称"
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
        <el-form-item label="选择供应商：" :label-width="dialogFormWidth.label" prop="supplierId">
          <el-select v-model="dialogForm.supplierId" placeholder="请选择" @change="handleSupplierChangeAction">
            <el-option
              v-for="item in supplierOptions"
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
import { purchasePageList, addPurchase, deletePurchase, updatePurchase } from '@/api/purchase'
import PriceInput from '@/components/PriceInput'
import { validatePhone, validatePrice } from '@/utils/validator'
import { supplierList } from '@/api/supplier'

export default {
  name: 'PurchaseList',
  components: {
    PriceInput
  },
  data() {
    return {
      loading: true,
      supplierOptions: [],
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
      dialogFormVisible: false,
      dialogFormLoading: false,
      dialogForm: {
        id: null,
        supplierId: null,
        name: null,
        person: null,
        phone: null,
        address: null,
        totalPrice: '0.00',
        sendAddress: null,
        receiveAddress: null,
        transportPrice: '0.00',
        remark: null
      },
      dialogRules: {
        supplierId: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
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
        isAdd: 'purchase:add',
        isEdit: 'purchase:edit',
        isDelete: 'purchase:delete',
        isRelate: ['purchase:add', 'purchase:edit']
      }
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]),

    initDialogTitle() {
      return !this.dialogForm.id ? '新增采购单' : '编辑采购单'
    }
  },
  async created() {
    // 获取按钮权限
    this.authData = await this.checkActionList(this.authData)

    await this.requestPurchasePageList()
  },
  methods: {
    ...mapActions('user', [
      'checkActionList'
    ]),
    indexMethod(indexVal) {
      const { page, size } = this.pageData
      return (page - 1) * size + (indexVal + 1)
    },
    async requestPurchasePageList() {
      try {
        this.tableLoading = true
        const { data } = await purchasePageList({ ...this.pageData, ...this.searchForm })
        const { list, total } = data
        this.tableData = list
        this.pageData.total = total
      } finally {
        this.tableLoading = false
      }
    },
    async requestSupplierList() {
      try {
        this.loading = true
        const { data } = await supplierList()
        this.supplierOptions = data
      } finally {
        this.loading = false
      }
    },
    handleSearchAction() {
      this.pageData.page = 1
      this.requestPurchasePageList()
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.requestPurchasePageList()
    },
    handleCurrentChange(value) {
      this.pageData.page = value
      this.requestPurchasePageList()
    },
    handleTableAddAction() {
      this.dialogFormVisible = true
      this.requestSupplierList()
    },
    handleTableEditAction(index, item) {
      this.dialogForm = { ...item }
      this.dialogFormVisible = true
      this.requestSupplierList()
    },
    handleTableDeleteAction(index, item) {
      this.deleteCommonFn(item)
    },
    handleTableRelateAction(index, item) {
      this.$router.push('/order/purchaseRelate?id=' + item.id + '&sn=' + item.sn)
    },
    deleteCommonFn({ id, sn }) {
      this.$confirm('确认删除采购单【' + sn + '】吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { msg } = await deletePurchase(id)
        this.$message.success(msg)
        await this.requestPurchasePageList()
      })
    },
    handleSupplierChangeAction(value) {
      const { person, phone, address } = this.supplierOptions.find(item => item.id === value)
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
          const requestName = !this.dialogForm.id ? addPurchase : updatePurchase
          try {
            const { msg } = await requestName(this.dialogForm)
            this.$message.success(msg)
            this.handleDialogCancelAction(formName)
            await this.requestPurchasePageList()
          } catch (error) {
            this.dialogFormLoading = false
          }
        }
        this.dialogFormLoading = false
      })
    },
    handleDialogCloseAction(formName) {
      this.dialogForm = {
        id: null,
        supplierId: null,
        name: null,
        person: null,
        phone: null,
        address: null,
        totalPrice: '0.00',
        sendAddress: null,
        receiveAddress: null,
        transportPrice: '0.00',
        remark: null
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    }
  }
}
</script>
