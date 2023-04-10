<template>
  <el-dialog
    title="分配客户"
    :visible.sync="dialogFormVisible"
    :width="dialogFormWidth.dialog"
    @close="handleDialogCloseAction"
  >
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
        @select="handleSelect"
        @select-all="handleSelectAll"
      >
        <el-table-column
          type="selection"
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
          prop="name"
          label="名称"
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogCancelAction">取 消</el-button>
      <el-button :loading="dialogFormLoading" :disabled="dialogFormLoading" type="primary" @click="handleDialogSubmitAction('dialogForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { assignCustomer, existCustomerIds } from '@/api/employee'
import { customerPageList } from '@/api/customer'

export default {
  name: 'AssignCustomerDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    adminId: {
      type: Number,
      default: null
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
        size: 10,
        total: 0
      },
      tableLoading: true,
      tableData: [],
      dialogFormVisible: false,
      dialogFormLoading: false,
      dialogFormWidth: {
        dialog: '900px',
        label: '100px',
        value: '160px'
      }
    }
  },
  watch: {
    async visible(newVal, oldVal) {
      this.dialogFormVisible = newVal
      if (newVal) {
        const { data } = await existCustomerIds(this.adminId)
        this.multipleSelection = data
        await this.requestCustomerPageList()
      }
    }
  },
  methods: {
    indexMethod(indexVal) {
      const { page, size } = this.pageData
      return (page - 1) * size + (indexVal + 1)
    },
    async requestCustomerPageList() {
      try {
        this.tableLoading = true
        const { data } = await customerPageList({ ...this.pageData, ...this.searchForm })
        const { list, total } = data
        this.tableData = list
        this.pageData.total = total
        this.checkTableRowSelection()
      } finally {
        this.tableLoading = false
      }
    },
    checkTableRowSelection() {
      this.$nextTick(() => {
        this.tableData.forEach((row) => {
          if (this.multipleSelection.includes(row.id)) {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          }
        })
      })
    },
    handleSearchAction() {
      this.pageData.page = 1
      this.requestCustomerPageList()
    },
    handleSelect(value, row) {
      const status = value.some(item => item.id === row.id)
      if (status) {
        this.multipleSelection.push(row.id)
      } else {
        this.multipleSelection = this.multipleSelection.filter(item => item !== row.id)
      }
    },
    handleSelectAll(value) {
      if (value.length) {
        const includeIds = value.map(item => item.id)
        this.multipleSelection = [...new Set([...this.multipleSelection, ...includeIds])]
      } else {
        const excludeIds = this.tableData.map(item => item.id)
        this.multipleSelection = this.multipleSelection.filter(item => !excludeIds.includes(item))
      }
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.requestCustomerPageList()
    },
    handleCurrentChange(value) {
      this.pageData.page = value
      this.requestCustomerPageList()
    },
    handleDialogCancelAction() {
      this.dialogFormVisible = false
    },
    async handleDialogSubmitAction(formName) {
      this.dialogFormLoading = true
      try {
        const { msg } = await assignCustomer({
          adminId: this.adminId,
          customerIds: this.multipleSelection
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
