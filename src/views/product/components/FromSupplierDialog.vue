<template>
  <div>
    <el-dialog
      title="查看供应商"
      :visible.sync="dialogFormVisible"
      :width="dialogFormWidth.dialog"
      @close="handleDialogCloseAction"
    >
      <el-form :inline="true" :model="searchForm" class="dialog-search-form-inline" @submit.native.prevent>
        <el-form-item label="搜索内容：">
          <el-input v-model="searchForm.keyword" clearable placeholder="请输入搜索内容" />
        </el-form-item>
        <el-form-item label="价格排序：">
          <el-select v-model="searchForm.sort" placeholder="请选择">
            <el-option
              v-for="item in sortTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearchAction">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="table-page-wrap">
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
            label="供应商名称"
            center
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="person"
            label="联系人"
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDialogCancelAction">关 闭</el-button>
      </div>
    </el-dialog>

    <EditSupplierProduct
      :visible.sync="dialogPriceVisible"
      :supplier-data="supplierData"
      :product-data="productData"
      :price="productPrice"
      @submit="requestFormSupplierPageList"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { sortTypeOptions } from '@/utils/constant'
import { fromSupplierPageList } from '@/api/product'
import { deleteSupplierProduct } from '@/api/supplier'
import EditSupplierProduct from '@/components/EditSupplierProduct'

export default {
  name: 'FromSupplierDialog',
  components: {
    EditSupplierProduct
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    productData: {
      type: Object,
      default: () => ({
        id: null,
        name: null
      })
    }
  },
  data() {
    return {
      sortTypeOptions,
      searchForm: {
        keyword: null,
        sort: ''
      },
      pageData: {
        page: 1,
        size: 10,
        total: 0
      },
      tableLoading: true,
      tableData: [],
      dialogFormVisible: false,
      dialogFormWidth: {
        dialog: '1200px',
        label: '100px',
        value: '160px'
      },
      supplierData: {},
      productPrice: null,
      dialogPriceVisible: false,
      authData: {
        isEdit: 'product:from',
        isDelete: 'product:from'
      }
    }
  },
  watch: {
    visible(newVal, oldVal) {
      this.dialogFormVisible = newVal
      if (newVal) {
        this.requestFormSupplierPageList()
      }
    }
  },
  methods: {
    ...mapActions('user', [
      'checkActionList'
    ]),
    indexMethod(indexVal) {
      const { page, size } = this.pageData
      return (page - 1) * size + (indexVal + 1)
    },
    async requestFormSupplierPageList() {
      try {
        this.tableLoading = true
        const { data } = await fromSupplierPageList({
          id: this.productData.id,
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
      this.requestFormSupplierPageList()
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.requestFormSupplierPageList()
    },
    handleCurrentChange(value) {
      this.pageData.page = value
      this.requestFormSupplierPageList()
    },
    handleTableEditAction(index, item) {
      this.supplierData = {
        id: item.id,
        name: item.name
      }
      this.productPrice = item.price
      this.dialogPriceVisible = true
    },
    handleTableDeleteAction(index, item) {
      this.deleteCommonFn(item)
    },
    deleteCommonFn({ id, name }) {
      const { id: productId, name: productName } = this.productData
      this.$confirm('确认删除货品【' + productName + '】的供应商【' + name + '】吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteSupplierProduct({
          supplierId: id,
          productId
        })
        this.$message.success(msg)
        await this.requestFormSupplierPageList()
      })
    },
    handleDialogCancelAction() {
      this.dialogFormVisible = false
    },
    handleDialogCloseAction() {
      this.$emit('update:visible', false)
      this.searchForm = {
        keyword: null,
        sort: ''
      }
      this.pageData = {
        page: 1,
        size: 10,
        total: 0
      }
      this.tableLoading = true
      this.tableData = []
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
