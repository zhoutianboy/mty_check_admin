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
        <el-button type="text">当前供应商：{{ supplierData.name }}</el-button>
        <el-button v-if="authData.isAdd" type="primary" style="float: right" icon="el-icon-plus" @click="handleTableAddAction">新增货品</el-button>
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
          label="报价"
          center
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.price }}元</span>
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

    <ProvideProductDialog
      :visible.sync="dialogProductVisible"
      :supplier-id="supplierData.id"
      @submit="requestProvideProductPageList"
    />

    <EditSupplierProduct
      :visible.sync="dialogPriceVisible"
      :supplier-data="supplierData"
      :product-data="productData"
      :price="productPrice"
      @submit="requestProvideProductPageList"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { provideProductPageList, deleteSupplierProduct } from '@/api/supplier'
import ProvideProductDialog from '@/views/supplier/components/ProvideProductDialog'
import EditSupplierProduct from '@/components/EditSupplierProduct'

export default {
  name: 'SupplierProvide',
  components: {
    ProvideProductDialog,
    EditSupplierProduct
  },
  data() {
    return {
      supplierData: {},
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
      dialogProductVisible: false,
      dialogPriceVisible: false,
      productData: {},
      productPrice: null,
      authData: {
        isAdd: 'supplier:provide',
        isEdit: 'supplier:provide',
        isDelete: 'supplier:provide'
      }
    }
  },
  async created() {
    const { id, name } = this.$route.query
    if (!id) {
      return this.$message.warning('缺少供应商id参数')
    }
    this.supplierData = {
      id: parseInt(id.toString()),
      name
    }

    // 获取按钮权限
    this.authData = await this.checkActionList(this.authData)

    await this.requestProvideProductPageList()
  },
  methods: {
    ...mapActions('user', [
      'checkActionList'
    ]),
    indexMethod(indexVal) {
      const { page, size } = this.pageData
      return (page - 1) * size + (indexVal + 1)
    },
    async requestProvideProductPageList() {
      try {
        this.tableLoading = true
        const { data } = await provideProductPageList({
          id: this.supplierData.id,
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
      this.requestProvideProductPageList()
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.requestProvideProductPageList()
    },
    handleCurrentChange(value) {
      this.pageData.page = value
      this.requestProvideProductPageList()
    },
    handleTableAddAction() {
      this.dialogProductVisible = true
    },
    handleTableEditAction(index, item) {
      this.productData = { id: item.id, name: item.name, sn: item.sn }
      this.productPrice = item.price
      this.dialogPriceVisible = true
    },
    handleTableDeleteAction(index, item) {
      this.deleteCommonFn(item)
    },
    deleteCommonFn({ id, name }) {
      const { id: supplierId, name: supplierName } = this.supplierData
      this.$confirm('确认删除供应商【' + supplierName + '】的货品【' + name + '】吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteSupplierProduct({
          supplierId,
          productId: id
        })
        this.$message.success(msg)
        await this.requestProvideProductPageList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
