<template>
  <el-dialog
    title="选择货品"
    :visible.sync="dialogFormVisible"
    :width="dialogFormWidth.dialog"
    @close="handleDialogCloseAction"
  >
    <div v-show="!stepIndex">
      <el-form :inline="true" :model="searchForm" class="dialog-search-form-inline" @submit.native.prevent>
        <el-form-item label="搜索内容：">
          <el-input v-model="searchForm.keyword" clearable placeholder="请输入搜索内容" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearchAction">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="table-page-wrap">
        <el-table
          ref="multipleTable"
          v-loading="tableLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          :data="tableData"
          row-key="id"
          border
          class="table-wrap"
          @selection-change="handleSelectionChange"
        >
          <!--          @select="handleSelect"-->
          <!--          @select-all="handleSelectAll"-->
          <el-table-column
            type="selection"
            :reserve-selection="true"
            width="50"
          />
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
          />
          <el-table-column
            prop="createTime"
            label="创建时间"
            center
            align="center"
            width="140"
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            center
            align="center"
            width="140"
          />
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
    </div>
    <div v-show="stepIndex" class="table-page-wrap">
      <div class="title">已选货品：</div>
      <div class="list">
        <el-table
          ref="table"
          :data="multipleSelection"
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
            label="价格"
            center
            align="center"
            width="180"
          >
            <template slot-scope="scope">
              <PriceInput :price.sync="multipleSelection[scope.$index].price" :width="dialogFormWidth.value" />
            </template>
          </el-table-column>
          <el-table-column
            prop="num"
            label="数量"
            center
            align="center"
            width="180"
          >
            <template slot-scope="scope">
              <el-input-number
                v-model="multipleSelection[scope.$index].num"
                :step="1"
                autocomplete="off"
                :style="{ width: dialogFormWidth.value }"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogCancelAction">取 消</el-button>
      <el-button v-if="!stepIndex" type="warning" @click="handleDialogNextAction">下一步</el-button>
      <template v-else>
        <el-button type="warning" @click="handleDialogPrevAction">上一步</el-button>
        <el-button :loading="dialogFormLoading" :disabled="dialogFormLoading" type="primary" @click="handleDialogSubmitAction('dialogForm')">确 定</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import PriceInput from '@/components/PriceInput'

export default {
  name: 'RelateOrderDialog',
  components: {
    PriceInput
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: Number,
      default: null
    },
    pageFn: {
      type: Function,
      default: () => {}
    },
    assignFn: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      searchForm: {
        keyword: null
      },
      multipleSelection: [],
      pageData: {
        page: 1,
        size: 5,
        total: 0
      },
      tableLoading: true,
      tableData: [],
      dialogFormVisible: false,
      dialogFormLoading: false,
      dialogFormWidth: {
        dialog: '900px',
        label: '100px',
        value: '140px'
      },
      stepIndex: 0
    }
  },
  watch: {
    visible(newVal, oldVal) {
      this.dialogFormVisible = newVal
      if (newVal) {
        this.requestProductPageList()
      }
    }
  },
  methods: {
    indexMethod(indexVal) {
      const { page, size } = this.pageData
      return (page - 1) * size + (indexVal + 1)
    },
    async requestProductPageList() {
      try {
        this.tableLoading = true
        const { data } = await this.pageFn({
          id: this.orderId,
          ...this.pageData,
          ...this.searchForm
        })
        const { list, total } = data
        this.tableData = list.map(item => ({ ...item, num: 1 }))
        this.pageData.total = total
      } finally {
        this.tableLoading = false
      }
    },
    handleSearchAction() {
      this.pageData.page = 1
      this.requestProductPageList()
    },
    // handleSelect(value, row) {
    //   const status = value.some(item => item.id === row.id)
    //   if (status) {
    //     this.multipleSelection.push(row)
    //   } else {
    //     this.multipleSelection = this.multipleSelection.filter(item => item.id !== row.id)
    //   }
    // },
    // handleSelectAll(value) {
    //   if (value.length) {
    //     const existIds = this.multipleSelection.map(item => item.id)
    //     const filterList = value.filter(item => !existIds.includes(item.id))
    //     this.multipleSelection.push(...filterList)
    //   } else {
    //     const excludeIds = this.tableData.map(item => item.id)
    //     this.multipleSelection = this.multipleSelection.filter(item => !excludeIds.includes(item.id))
    //   }
    // },
    handleSelectionChange(value) {
      this.multipleSelection = [...value]
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.requestProductPageList()
    },
    handleCurrentChange(value) {
      this.pageData.page = value
      this.requestProductPageList()
    },
    handleDialogCancelAction() {
      this.dialogFormVisible = false
    },
    handleDialogPrevAction() {
      this.stepIndex = 0
    },
    handleDialogNextAction() {
      if (!this.multipleSelection.length) {
        return this.$message.warning('请选择货品')
      }
      this.stepIndex = 1
    },
    async handleDialogSubmitAction(formName) {
      this.dialogFormLoading = true
      try {
        const productList = this.multipleSelection.map(item => ({ id: item.id, price: item.price, num: item.num }))
        const { msg } = await this.assignFn({
          orderId: this.orderId,
          productList
        })
        this.$message.success(msg)
        this.handleDialogCancelAction(formName)
        this.$emit('submit')
      } finally {
        this.dialogFormLoading = false
      }
    },
    handleDialogCloseAction() {
      this.$emit('update:visible', false)
      this.searchForm = {
        keyword: null
      }
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
      this.pageData = {
        page: 1,
        size: 10,
        total: 0
      }
      this.tableLoading = true
      this.tableData = []
      this.stepIndex = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  margin-bottom: 12px;
}
</style>
