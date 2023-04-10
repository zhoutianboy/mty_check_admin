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
        <el-button type="text">当前报价单编号：{{ offerData.sn }}</el-button>
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
          prop="productSn"
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
          label="单价"
          center
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.price }}元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="数量"
          center
          align="center"
        />
        <el-table-column
          prop="totalPrice"
          label="总价"
          center
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.totalPrice }}元</span>
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

    <RelateOrderProduct
      :visible.sync="dialogProductVisible"
      :order-id="offerData.id"
      :page-fn="assignProductPageList"
      :assign-fn="assignOfferProduct"
      @submit="requestRelateProductPageList"
    />

    <EditOrderProduct
      :visible.sync="dialogPriceVisible"
      :order-data="offerData"
      :product-data="productData"
      :update-fn="updateOfferProduct"
      @submit="requestRelateProductPageList"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { assignProductPageList, relateProductPageList, assignOfferProduct, updateOfferProduct, deleteOfferProduct } from '@/api/offer'
import RelateOrderProduct from '@/components/RelateOrderProduct'
import EditOrderProduct from '@/components/EditOrderProduct'

export default {
  name: 'OfferRelate',
  components: {
    RelateOrderProduct,
    EditOrderProduct
  },
  data() {
    return {
      assignProductPageList,
      assignOfferProduct,
      updateOfferProduct,
      offerData: {},
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
      authData: {
        isAdd: ['offer:add', 'offer:edit'],
        isEdit: ['offer:add', 'offer:edit'],
        isDelete: ['offer:add', 'offer:edit']
      }
    }
  },
  async created() {
    const { id, sn } = this.$route.query
    if (!id) {
      return this.$message.warning('缺少报价单id参数')
    }
    this.offerData = {
      id: parseInt(id.toString()),
      sn
    }

    // 获取按钮权限
    this.authData = await this.checkActionList(this.authData)

    await this.requestRelateProductPageList()
  },
  methods: {
    ...mapActions('user', [
      'checkActionList'
    ]),
    indexMethod(indexVal) {
      const { page, size } = this.pageData
      return (page - 1) * size + (indexVal + 1)
    },
    async requestRelateProductPageList() {
      try {
        this.tableLoading = true
        const { data } = await relateProductPageList({
          id: this.offerData.id,
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
      this.requestRelateProductPageList()
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.requestRelateProductPageList()
    },
    handleCurrentChange(value) {
      this.pageData.page = value
      this.requestRelateProductPageList()
    },
    handleTableAddAction() {
      this.dialogProductVisible = true
    },
    handleTableEditAction(index, item) {
      const { productId, productSn, name, price, num } = item
      this.productData = { id: productId, sn: productSn, name, price, num }
      this.dialogPriceVisible = true
    },
    handleTableDeleteAction(index, item) {
      this.deleteCommonFn(item)
    },
    deleteCommonFn({ productId, name }) {
      const { id: offerId, sn: offerSn } = this.offerData
      this.$confirm('确认删除报价单【' + offerSn + '】的货品【' + name + '】吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteOfferProduct({
          offerId,
          productId: productId
        })
        this.$message.success(msg)
        await this.requestRelateProductPageList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
