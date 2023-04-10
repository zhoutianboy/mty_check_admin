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
          label="名称"
          center
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="model"
          label="型号"
          center
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="unit"
          label="单位"
          center
          align="center"
        />
        <el-table-column
          prop="price"
          label="价格"
          center
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.price }}元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stock"
          label="库存"
          center
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.stock === null ? '无限' : scope.row.stock }}</span>
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
          :width="250"
        >
          <template slot-scope="scope">
            <el-button v-if="authData.isEdit" @click="handleTableEditAction(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="authData.isDelete" type="danger" @click="handleTableDeleteAction(scope.$index, scope.row)">删除</el-button>
            <el-button v-if="authData.isFrom" type="warning" @click="handleTableFromAction(scope.$index, scope.row)">查看供应商</el-button>
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
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules">
        <el-form-item label="名 称：" :label-width="dialogFormWidth.label" prop="name">
          <el-input v-model="dialogForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="封 面：" :label-width="dialogFormWidth.label" prop="avatar">
          <ImageUpload :url="dialogForm.poster" @success="handleImageUploadSuccess" />
        </el-form-item>
        <el-form-item label="型 号：" :label-width="dialogFormWidth.label" prop="model">
          <el-input v-model="dialogForm.model" autocomplete="off" />
        </el-form-item>
        <el-form-item label="单 位：" :label-width="dialogFormWidth.label" prop="unit">
          <el-input v-model="dialogForm.unit" autocomplete="off" />
        </el-form-item>
        <el-form-item label="价 格：" :label-width="dialogFormWidth.label" prop="price">
          <PriceInput :price.sync="dialogForm.price" />
        </el-form-item>
        <!--        <el-form-item label="库 存：" :label-width="dialogFormWidth.label" prop="stock">-->
        <!--          <el-input v-model="dialogForm.stock" autocomplete="off" />-->
        <!--        </el-form-item>-->
        <el-form-item label="描 述：" :label-width="dialogFormWidth.label" prop="describe">
          <el-input v-model="dialogForm.describe" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCancelAction">取 消</el-button>
        <el-button :loading="dialogFormLoading" :disabled="dialogFormLoading" type="primary" @click="handleDialogSubmitAction('dialogForm')">确 定</el-button>
      </div>
    </el-dialog>

    <FromSupplierDialog :visible.sync="fromVisible" :product-data="productData" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { deleteFile } from '@/api/file'
import { genderTypeOptions } from '@/utils/constant'
import { productPageList, addProduct, deleteProduct, updateProduct } from '@/api/product'
import ImageUpload from '@/components/ImageUpload'
import PriceInput from '@/components/PriceInput'
import FromSupplierDialog from '@/views/product/components/FromSupplierDialog'
import { validatePrice } from '@/utils/validator'

export default {
  name: 'ProductList',
  components: {
    ImageUpload,
    PriceInput,
    FromSupplierDialog
  },
  data() {
    return {
      genderTypeOptions,
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
      dialogFormSubmit: false,
      dialogForm: {
        id: null,
        name: null,
        poster: null,
        model: null,
        unit: null,
        price: null,
        stock: null,
        describe: null
      },
      dialogRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        model: [
          { required: true, message: '请输入型号', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { validator: validatePrice }
        ]
        // avatar: [
        //   { required: true, message: '请上传头像', trigger: 'blur' }
        // ]
      },
      dialogFormWidth: {
        dialog: '600px',
        label: '100px',
        value: '160px'
      },
      fromVisible: false,
      productData: {},
      authData: {
        isAdd: 'product:add',
        isEdit: 'product:edit',
        isDelete: 'product:delete',
        isFrom: 'product:from'
      },
      tempFileUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]),

    initDialogTitle() {
      return !this.dialogForm.id ? '新增货品' : '编辑货品'
    }
  },
  async created() {
    // 获取按钮权限
    this.authData = await this.checkActionList(this.authData)

    await this.requestProductPageList()
  },
  methods: {
    ...mapActions('user', [
      'checkActionList'
    ]),
    indexMethod(indexVal) {
      const { page, size } = this.pageData
      return (page - 1) * size + (indexVal + 1)
    },
    async requestProductPageList() {
      try {
        this.tableLoading = true
        const { data } = await productPageList({ ...this.pageData, ...this.searchForm })
        const { list, total } = data
        this.tableData = list
        this.pageData.total = total
      } finally {
        this.tableLoading = false
      }
    },
    handleSearchAction() {
      this.pageData.page = 1
      this.requestProductPageList()
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.requestProductPageList()
    },
    handleCurrentChange(value) {
      this.pageData.page = value
      this.requestProductPageList()
    },
    handleTableAddAction() {
      this.tempFileUrl = ''
      this.dialogFormVisible = true
    },
    handleTableEditAction(index, item) {
      this.tempFileUrl = item.poster
      this.dialogForm = { ...item }
      this.dialogFormVisible = true
    },
    handleTableDeleteAction(index, item) {
      this.deleteCommonFn(item)
    },
    handleTableFromAction(index, item) {
      this.productData = { id: item.id, name: item.name, sn: item.sn }
      this.fromVisible = true
    },
    deleteCommonFn({ id, name }) {
      this.$confirm('确认删除货品【' + name + '】吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteProduct(id)
        this.$message.success(msg)
        await this.requestProductPageList()
      })
    },
    handleImageUploadSuccess(resultData) {
      this.dialogForm = {
        ...this.dialogForm,
        poster: resultData.url
      }
    },
    handleDialogCancelAction() {
      this.dialogFormVisible = false
    },
    handleDialogSubmitAction(formName) {
      this.dialogFormLoading = true
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const requestName = !this.dialogForm.id ? addProduct : updateProduct
          try {
            const { msg } = await requestName(this.dialogForm)
            this.$message.success(msg)
            this.dialogFormSubmit = true
            this.handleDialogCancelAction(formName)
            await this.requestProductPageList()
          } catch (error) {
            this.dialogFormLoading = false
          }
        }
        this.dialogFormLoading = false
      })
    },
    handleDialogCloseAction(formName) {
      const { avatar } = this.dialogForm
      if (avatar && avatar !== this.tempFileUrl) {
        if (this.dialogFormSubmit) {
          this.tempFileUrl && deleteFile(this.tempFileUrl)
        } else {
          deleteFile(avatar)
        }
      }
      this.dialogFormSubmit = false
      this.dialogForm = {
        id: null,
        name: null,
        poster: null,
        model: null,
        unit: null,
        price: null,
        stock: null,
        describe: null
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    }
  }
}
</script>
