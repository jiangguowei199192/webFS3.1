<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    class="iconDialog"
    :before-close="handleClose"
  >
    <el-upload
      class="upload-demo"
      :auto-upload="false"
      drag
      action="#"
      multiple
      :limit="10"
      :before-remove="beforeRemove"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      accept=".JPG, .PNG, .JPEG,.jpg, .png, .jpeg,.gif"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/jpeg/png/gif文件,每次最多上传十张图片，且单张图片大小不能超过300kb</div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmAjax">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { iconLibaryApi } from '@/api/iconLibary'
export default {
  name: 'addIconUpload',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fileList: [], // 文件列表的数组
      uploadList: [] // 文件流
    }
  },
  methods: {
    // 关闭弹框
    handleClose () {
      this.fileList = []
      this.uploadList = []
      this.$emit('closeDialog')
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      this.uploadList = fileList
    },
    handleChange (file, fileList) {
      console.log(fileList)
      const isLt300k = file.size / 1024 <= 300
      if (!isLt300k) {
        return this.$notify.error('上传图片大小不能超过 300kb!')
      }
      // console.log(file, fileList)
      this.uploadList = fileList
    },
    uploadImg () {
      console.log('上传时的数据', this.uploadList)
      const formData = new FormData()
      this.uploadList.forEach(file => {
        // 因为要上传多个文件，所以需要遍历
        formData.append('file', file.raw)
      })
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      this.$axios.post(iconLibaryApi.uploadImgFiles, formData, config).then(res => {
        if (res && res.data && res.data.code === 0) {
          this.$notify.success('图片上传成功')
        } else {
          this.$notify.error('图片上传失败')
        }
        this.fileList = []
        this.uploadList = []
      })
    },
    confirmAjax () {
      this.$emit('closeDialog')
      this.uploadImg()
    }
  }
}
</script>
<style lang="less" scoped>
.iconDialog {
  /deep/ .el-dialog {
    background: #101b34;
    .el-dialog__title,
    .el-upload__tip,
    .el-dialog__close {
      color: #fff;
    }
    .el-dialog__body {
      .upload-demo {
        ul.el-upload-list {
          display: flex;
          flex-wrap: wrap;
          li {
            width: 33%;
          }
        }
      }
    }
  }
}
</style>
