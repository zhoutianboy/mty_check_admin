<template>
  <el-upload
    class="file-uploader"
    name="file"
    :data="{ dirName }"
    :headers="{ Authorization: 'Bearer ' + token }"
    :action="fileUploadUrl"
    :with-credentials="true"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-preview="handlePreview"
    :before-remove="beforeRemove"
    :on-remove="handleRemove"
    multiple
    :file-list="fileList"
  >
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只能上传doc/docx/xls/xlsx/pdf文件，且不超过50MB</div>
  </el-upload>
</template>

<script>
import { mapGetters } from 'vuex'
import { fileUploadUrl, deleteFile } from '@/api/file'
import { docSuffixList, excelSuffixList, pdfSuffixList } from '@/utils/constant'
import { openFile } from '@/utils'

export default {
  name: 'FileUpload',
  props: {
    dirName: {
      type: String,
      default: 'file'
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fileUploadUrl,
      fileList: []
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  watch: {
    list: {
      handler(newVal) {
        this.fileList = newVal
      },
      immediate: true
    }
  },
  methods: {
    fileValidate(file) {
      const isFile = [...docSuffixList, ...excelSuffixList, ...pdfSuffixList].some(item => file.type.toLowerCase().endsWith(item))
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isFile) {
        this.$message.error('上传文件只能是 DOC/DOCX/XLS/XLSX/PDF 格式!')
      }
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50MB!')
      }
      return isFile && isLt50M
    },
    beforeUpload(file) {
      return this.fileValidate(file)
    },
    handleSuccess(res, file) {
      // console.log(res, file, this.fileList)
      if (res.code === 200) {
        this.$message.success(res.msg)
        this.$emit('update:list', [...this.fileList, res.data])
      } else {
        this.$message.error(res.msg)
      }
    },
    handlePreview(file) {
      openFile(file.url)
    },
    beforeRemove(file, fileList) {
      if (!file.raw) {
        console.log(file, fileList)
      }
    },
    handleRemove(file, fileList) {
      if (!file.raw) {
        deleteFile(file.url)
        this.$emit('update:list', fileList.map(item => ({
          mine: item.mine,
          name: item.name,
          size: item.size,
          suffix: item.suffix,
          url: item.url
        })))
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
