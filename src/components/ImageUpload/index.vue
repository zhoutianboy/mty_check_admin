<template>
  <el-upload
    class="image-uploader"
    name="file"
    :data="{ dirName }"
    :headers="{ Authorization: 'Bearer ' + token }"
    :action="fileUploadUrl"
    :with-credentials="true"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :on-success="handleAvatarSuccess"
  >
    <img v-if="imgUrl" :src="imgUrl | completeUrl" class="avatar" alt="">
    <i v-else class="el-icon-plus image-uploader-icon" />
  </el-upload>
</template>

<script>
import { mapGetters } from 'vuex'
import { fileUploadUrl } from '@/api/file'
import { imageSuffixList } from '@/utils/constant'

export default {
  name: 'ImageUpload',
  props: {
    dirName: {
      type: String,
      default: 'avatar'
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileUploadUrl,
      imgUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  watch: {
    url: {
      handler(newVal) {
        this.imgUrl = newVal
      },
      immediate: true
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      // console.log(file)
      const isImage = imageSuffixList.some(item => file.type.toLowerCase().endsWith(item))
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isImage) {
        this.$message.error('上传头像图片只能是 JPEG/JPG/PNG 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isImage && isLt10M
    },
    handleAvatarSuccess(res, file) {
      // console.log(res, file)
      if (res.code === 200) {
        this.$message.success(res.msg)
        this.$emit('success', res.data)
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
