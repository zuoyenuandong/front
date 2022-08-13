<template>
  <div class="app-container">
    <!-- 标题 -->
    <h2 style="text-align: center">发布新课程</h2>
    <!-- 步骤导航 -->
    <el-steps
      :active="active"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="发布课程" />
    </el-steps>
    <!-- 步骤内容 -->
    <!-- 步骤1 components info.vue -->
    <Info v-if="active === 0" />
    <!-- 步骤2 components chapter index.vue-->
    <Chapter v-if="active === 1" />
    <!-- 步骤3 components publish.vue-->
    <Publist v-if="active === 2 || active === 3" />
  </div>
</template>
<script>
import Info from '@/views/course/components/Info'
import Chapter from '@/views/course/components/Chapter' // 找Chapter.vue或者Chapter/Index.vue
import Publist from '@/views/course/components/Publish'
export default {
  components: { Info, Chapter, Publist },
  data() {
    return {
      active: 0,
      courseId: null
    }
  },
  created() {
    if (this.$route.name === 'CourseInfoEdit') {
      this.courseId = this.$route.params.id
      this.active = 0
    } else if (this.$route.name === 'CourseChapterEdit') {
      this.active = 1
      this.courseId = this.$route.params.id
    }
  }
}
</script>
<style>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.cover-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cover-uploader .el-upload:hover {
  border-color: #409EFF;
}
.cover-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 640px;
  height: 357px;
  line-height: 357px;
  text-align: center;
}
.cover-uploader img {
  width: 640px;
  height: 357px;
  display: block;
}
</style>
