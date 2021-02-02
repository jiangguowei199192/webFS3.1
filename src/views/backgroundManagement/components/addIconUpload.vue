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
      ref="upload"
      :auto-upload="false"
      drag
      action="#"
      multiple
      :limit="10"
      :before-remove="beforeRemove"
      :on-remove="handleRemove"
      :on-change="handleChange"
      accept=".jpg,.png,.jpeg,.gif"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/jpeg/png/gif格式,每次最多上传十张图片，单张图片大小不能超过300kb</div>
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
    }
  },
  methods: {
    // 关闭弹框
    handleClose () {
      this.$emit('closeDialog')
      this.$refs.upload.clearFiles()
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove (file, fileList) {
      // console.log(file, fileList)
    },
    handleChange (file, fileList) {
      const isLt300k = file.size / 1024 <= 300
      if (!isLt300k) {
        this.$refs.upload.uploadFiles.splice(this.$refs.upload.uploadFiles.length - 1, 1)
        return this.$notify({ title: '提示', message: '图片大小不能超过 300kb!', type: 'error' })
      }
    },
    uploadImg () {
      if (this.$refs.upload.uploadFiles.length === 0) {
        return this.$notify({ title: '提示', message: '请先上传图片！', type: 'warning' })
      }
      const formData = new FormData()
      this.$refs.upload.uploadFiles.forEach(file => {
        formData.append('files', file.raw)
      })
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      this.$axios.post(iconLibaryApi.uploadImgFiles, formData, config).then(res => {
        if (res && res.data && res.data.code === 0) {
          this.$notify({ title: '提示', message: '上传图片成功!', type: 'success' })
          this.$emit('updatePic')
        }
        //  else {
        //   this.$notify.error('图片上传失败')
        // }
        this.$refs.upload.clearFiles()
      })
    },
    // 图片上传  先关闭弹框 再上传
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
      .el-upload-list__item:first-child{
        margin-top:5px;
      }
      }
    }
  }
}
</style>
