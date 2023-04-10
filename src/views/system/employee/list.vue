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
              <el-form-item label="账 号：">
                <span>{{ props.row.username }}</span>
              </el-form-item>
              <el-form-item label="姓 名：">
                <span>{{ props.row.realName }}</span>
              </el-form-item>
              <el-form-item label="性 别：">
                <span>{{ formatLabelShow(genderTypeOptions, props.row.gender) }}</span>
              </el-form-item>
              <el-form-item label="手 机：">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="角 色：">
                <span>{{ formatLabelShow(roleTypeOptions, props.row.roleId, { label: 'name', value: 'id' }) }}</span>
              </el-form-item>
              <el-form-item label="状 态：">
                <span>{{ formatLabelShow(statusTypeOptions, props.row.status) }}</span>
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
          prop="username"
          label="账号"
          center
          align="center"
        />
        <el-table-column
          prop="realName"
          label="姓名"
          center
          align="center"
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
          prop="roleId"
          label="角色"
          center
          align="center"
        >
          <template slot-scope="scope">
            {{ formatLabelShow(roleTypeOptions, scope.row.roleId, { label: 'name', value: 'id' }) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          center
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              :value="statusComputed(scope.row.status)"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="(value) => handleTableStatusAction(scope.row.id, value)"
            />
          </template>
        </el-table-column>
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
          align="left"
          width="330"
        >
          <template slot-scope="scope">
            <el-button v-if="authData.isEdit" @click="handleTableEditAction(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="authData.isDelete" type="danger" @click="handleTableDeleteAction(scope.$index, scope.row)">删除</el-button>
            <el-button v-if="authData.isPassword" type="warning" @click="handleTablePasswordAction(scope.$index, scope.row)">修改密码</el-button>
            <el-button v-if="assignComputed(scope.row.roleId)" type="warning" @click="handleTableAssignAction(scope.$index, scope.row)">分配客户</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="!tableLoading"
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
            <el-form-item label="账 号：" :label-width="dialogFormWidth.label" prop="username">
              <el-input v-model="dialogForm.username" :disabled="Boolean(dialogForm.id)" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓 名：" :label-width="dialogFormWidth.label" prop="realName">
              <el-input v-model="dialogForm.realName" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="手 机：" :label-width="dialogFormWidth.label" prop="phone">
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
          <el-col :span="12">
            <el-form-item label="角 色：" :label-width="dialogFormWidth.label" prop="roleId">
              <el-select v-model="dialogForm.roleId" placeholder="请选择">
                <el-option
                  v-for="item in roleTypeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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

    <!-- 修改密码 -->
    <ResetPassword :visible.sync="passwordVisible" :admin-id="employeeId" :request-name="resetPwd" />

    <!-- 分配客户 -->
    <AssignCustomerDialog :visible.sync="assignVisible" :admin-id="employeeId" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { deleteFile } from '@/api/file'
import { genderTypeOptions, linkTypeData, statusTypeData, statusTypeOptions } from '@/utils/constant'
import { employeePageList, addEmployee, deleteEmployee, updateEmployee, resetPwd, changeStatus } from '@/api/employee'
import { roleList } from '@/api/role'
import ResetPassword from '@/components/ResetPassword'
import ImageUpload from '@/components/ImageUpload'
import AssignCustomerDialog from '@/views/system/employee/components/AssignCustomerDialog'
import { validatePhone } from '@/utils/validator'

export default {
  name: 'EmployeeList',
  components: {
    ResetPassword,
    ImageUpload,
    AssignCustomerDialog
  },
  data() {
    return {
      resetPwd,
      genderTypeOptions,
      statusTypeOptions,
      roleTypeOptions: [],
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
        username: null,
        realName: null,
        phone: null,
        gender: 1,
        roleId: null,
        avatar: null
      },
      dialogRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: validatePhone }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'blur' }
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
      passwordVisible: false,
      assignVisible: false,
      employeeId: null,
      authData: {
        isAdd: 'employee:add',
        isEdit: 'employee:edit',
        isDelete: 'employee:delete',
        isPassword: 'employee:password',
        isStatus: 'employee:status',
        isAssign: 'employee:assign'
      },
      tempFileUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]),

    initDialogTitle() {
      return !this.dialogForm.id ? '新增员工' : '编辑员工'
    },
    statusComputed() {
      return (status) => {
        if (status === statusTypeData.normal) return true
        if (status === statusTypeData.forbidden) return false
      }
    },
    assignComputed() {
      return (roleId) => {
        const role = this.roleTypeOptions.find(item => item.id === roleId)
        if (this.authData.isAssign && role) {
          const { linkType } = role
          return linkType && linkType.includes(linkTypeData.customer)
        }
        return false
      }
    }
  },
  async created() {
    // 获取按钮权限
    this.authData = await this.checkActionList(this.authData)

    await this.requestRoleList()
    await this.requestEmployeePageList()
  },
  methods: {
    ...mapActions('user', [
      'checkActionList'
    ]),
    indexMethod(indexVal) {
      const { page, size } = this.pageData
      return (page - 1) * size + (indexVal + 1)
    },
    async requestEmployeePageList() {
      try {
        this.tableLoading = true
        const { data } = await employeePageList({ ...this.pageData, ...this.searchForm })
        const { list, total } = data
        this.tableData = list
        this.pageData.total = total
      } finally {
        this.tableLoading = false
      }
    },
    async requestRoleList() {
      const { data } = await roleList()
      this.roleTypeOptions = data
    },
    handleSearchAction() {
      this.pageData.page = 1
      this.requestEmployeePageList()
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.requestEmployeePageList()
    },
    handleCurrentChange(value) {
      this.pageData.page = value
      this.requestEmployeePageList()
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
    handleTablePasswordAction(index, item) {
      this.employeeId = item.id
      this.passwordVisible = true
    },
    async handleTableAssignAction(index, item) {
      this.employeeId = item.id
      this.assignVisible = true
    },
    async handleTableStatusAction(id, value) {
      const { msg } = await changeStatus(id, value ? 1 : 2)
      this.$message.success(msg)
      await this.requestEmployeePageList()
    },
    deleteCommonFn({ id, realName }) {
      this.$confirm('确认删除员工【' + realName + '】吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { msg } = await deleteEmployee(id)
        this.$message.success(msg)
        await this.requestEmployeePageList()
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
          const requestName = !this.dialogForm.id ? addEmployee : updateEmployee
          try {
            const { msg } = await requestName(this.dialogForm)
            this.$message.success(msg)
            this.dialogFormSubmit = true
            this.handleDialogCancelAction()
            await this.requestEmployeePageList()
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
        username: null,
        realName: null,
        phone: null,
        gender: 1,
        roleId: null,
        avatar: null
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    }
  }
}
</script>
