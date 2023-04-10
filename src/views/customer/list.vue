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
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="名 称：">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="联系人：">
                <span>{{ props.row.person }}</span>
              </el-form-item>
              <el-form-item label="性 别：">
                <span>{{ formatLabelShow(genderTypeOptions, props.row.gender) }}</span>
              </el-form-item>
              <el-form-item label="手 机：">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="地 址：">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="创建时间：">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="更新时间：">
                <span>{{ props.row.updateTime }}</span>
              </el-form-item>
              <el-form-item label="头 像：">
                <el-avatar v-if="props.row.avatar" shape="square" size="large" :src="props.row.avatar | completeUrl" />
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
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
          prop="gender"
          label="性别"
          center
          align="center"
        >
          <template slot-scope="scope">
            {{ formatLabelShow(genderTypeOptions, scope.row.gender) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系方式"
          center
          align="center"
          width="100"
        />
        <el-table-column
          prop="address"
          label="地址"
          center
          align="center"
          width="240"
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
          :width="authData.isDelete ? 240 : 80"
        >
          <template slot-scope="scope">
            <el-button v-if="authData.isEdit" @click="handleTableEditAction(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="authData.isDelete" type="danger" @click="handleTableDeleteAction(scope.$index, scope.row)">删除</el-button>
            <el-button v-if="authData.isAssign" type="warning" @click="handleTableAssignAction(scope.$index, scope.row)">指派员工</el-button>
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
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="名 称：" :label-width="dialogFormWidth.label" prop="name">
              <el-input v-model="dialogForm.name" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人：" :label-width="dialogFormWidth.label" prop="person">
              <el-input v-model="dialogForm.person" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="联系方式：" :label-width="dialogFormWidth.label" prop="phone">
              <el-input v-model="dialogForm.phone" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性 别：" :label-width="dialogFormWidth.label" prop="gender">
              <el-radio-group v-model="dialogForm.gender">
                <el-radio v-for="item in genderTypeOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="地 址：" :label-width="dialogFormWidth.label" prop="address">
              <el-input v-model="dialogForm.address" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="头 像：" :label-width="dialogFormWidth.label" prop="avatar">
              <ImageUpload :url="dialogForm.avatar" @success="handleImageUploadSuccess" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCancelAction">取 消</el-button>
        <el-button :loading="dialogFormLoading" :disabled="dialogFormLoading" type="primary" @click="handleDialogSubmitAction('dialogForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 指派员工 -->
    <AssignEmployeeDialog :visible.sync="assignVisible" :customer-id="customerId" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { deleteFile } from '@/api/file'
import { genderTypeOptions } from '@/utils/constant'
import { customerPageList, addCustomer, deleteCustomer, updateCustomer } from '@/api/customer'
import ImageUpload from '@/components/ImageUpload'
import AssignEmployeeDialog from '@/views/customer/components/AssignEmployeeDialog'
import { validatePhone } from '@/utils/validator'

export default {
  name: 'CustomerList',
  components: {
    ImageUpload,
    AssignEmployeeDialog
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
        person: null,
        phone: null,
        gender: 1,
        address: null,
        avatar: null
      },
      dialogRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        person: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: validatePhone }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
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
      assignVisible: false,
      customerId: null,
      authData: {
        isAdd: 'customer:add',
        isEdit: 'customer:edit',
        isDelete: 'customer:delete',
        isAssign: 'customer:assign'
      },
      tempFileUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'role'
    ]),

    initDialogTitle() {
      return !this.dialogForm.id ? '新增客户' : '编辑客户'
    }
  },
  async created() {
    // 获取按钮权限
    this.authData = await this.checkActionList(this.authData)

    await this.requestCustomerPageList()
  },
  methods: {
    ...mapActions('user', [
      'checkActionList'
    ]),
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
      } finally {
        this.tableLoading = false
      }
    },
    handleSearchAction() {
      this.pageData.page = 1
      this.requestCustomerPageList()
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.requestCustomerPageList()
    },
    handleCurrentChange(value) {
      this.pageData.page = value
      this.requestCustomerPageList()
    },
    handleTableAddAction() {
      this.tempFileUrl = ''
      this.dialogFormVisible = true
    },
    handleTableEditAction(index, item) {
      this.tempFileUrl = item.avatar
      this.dialogForm = { ...item }
      this.dialogFormVisible = true
    },
    handleTableDeleteAction(index, item) {
      this.deleteCommonFn(item)
    },
    async handleTableAssignAction(index, item) {
      this.customerId = item.id
      this.assignVisible = true
    },
    deleteCommonFn({ id, name }) {
      this.$confirm('确认删除客户【' + name + '】吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteCustomer(id)
        this.$message.success(msg)
        await this.requestCustomerPageList()
      })
    },
    handleImageUploadSuccess(resultData) {
      this.dialogForm = {
        ...this.dialogForm,
        avatar: resultData.url
      }
    },
    handleDialogCancelAction() {
      this.dialogFormVisible = false
    },
    handleDialogSubmitAction(formName) {
      this.dialogFormLoading = true
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const requestName = !this.dialogForm.id ? addCustomer : updateCustomer
          try {
            const { msg } = await requestName(this.dialogForm)
            this.$message.success(msg)
            this.dialogFormSubmit = true
            this.handleDialogCancelAction()
            await this.requestCustomerPageList()
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
        person: null,
        phone: null,
        gender: 1,
        address: null,
        avatar: null
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    }
  }
}
</script>
