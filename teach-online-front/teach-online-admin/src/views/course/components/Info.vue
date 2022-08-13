<template>
  <div class="app-container">
    <!-- 课程信息表单 -->
    <!-- 课程信息表单 -->
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :value="teacher.id"
            :label="teacher.name"
          />
        </el-select>
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="课程分类">
        <!-- 一级分类 -->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectChanged"
        >
          <el-option
            v-for="subject in subjectList"
            :key="subject.id"
            :value="subject.id"
            :label="subject.title"
          />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subjectLevelTwoList"
            :key="subject.id"
            :value="subject.id"
            :label="subject.title"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :on-error="handleCoverError"
          :action="BASE_API+'/admin/oss/file/upload?module=cover'"
          class="cover-uploader"
        >
          <img v-if="courseInfo.cover" :src="courseInfo.cover" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>
    </el-form>
    <div style="text-align:center">
      <el-button :disable="saveBtnDisabled" type="primary" @click="saveAndNext()">
        保存下一步
      </el-button>
    </div>

  </div>
</template>
<script>
import courseApi from '@/api/course'
import teacherApi from '@/api/teacher'
import subjectApi from '@/api/subject'

import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false, // 按钮是否禁用
      courseInfo: {
        // 表单数据
        title: '',
        price: 0,
        lessonNum: 0,
        teacherId: '',
        subjectId: '',
        subjectParentId: '',
        cover: '',
        description: ''
      },
      teacherList: [],
      subjectList: [], // 一级分类
      subjectLevelTwoList: [], // 二级分类
      BASE_API: process.env.BASE_API
    }
  },
  created() {
    // if (this.$route.name === 'CourseInfoEdit') {
    //   this.$parent.courseId = this.$route.params.id
    // }
    if (this.$parent.courseId) {
      this.fetchCourseInfoById(this.$parent.courseId)
    } else {
      this.initSubjectList()
    }
    this.initTeacherList()
  },
  methods: {
    initTeacherList() {
      teacherApi.list().then((respones) => {
        this.teacherList = respones.data.items
      })
    },
    // 获取课程分类列表
    initSubjectList() {
      subjectApi.getNestedTreeList().then((response) => {
        this.subjectList = response.data.items
      })
    },
    fetchCourseInfoById(id) {
      courseApi.getCourseInfoById(id).then(response => {
        this.courseInfo = response.data.courseInfo
        subjectApi.getNestedTreeList().then((response) => {
          this.subjectList = response.data.items
          this.subjectList.forEach((subject) => {
            // 判断当前选中的一级类别是否和当前遍历的一级类别的id一致
            if (subject.id === this.courseInfo.subjectParentId) {
              // 清空当前值
              // 如果一致，则将当前遍历的一级类别的子类别绑定在页面的二级类别列表中
              this.subjectLevelTwoList = subject.children
            }
          })
        })
      })
    },
    subjectChanged(value) {
      // 遍历一级类别列表
      this.subjectList.forEach((subject) => {
        // 判断当前选中的一级类别是否和当前遍历的一级类别的id一致
        if (subject.id === value) {
          // 清空当前值
          this.courseInfo.subjectId = ''
          // 如果一致，则将当前遍历的一级类别的子类别绑定在页面的二级类别列表中
          this.subjectLevelTwoList = subject.children
        }
      })
    },
    saveAndNext() {
      this.saveBtnDisabled = true
      if (this.$parent.courseId) {
        this.updateData()
      } else {
        this.saveData()
      }
    },
    // 保存课程信息
    saveData() {
      courseApi.saveCourseInfo(this.courseInfo).then((response) => {
        this.$message.success(response.message)
        this.$parent.courseId = response.data.courseId // 获取courseId
        this.$parent.active = 1 // 下一步 访问父组件的成员 $parent
      })
    },
    updateData() {
      courseApi.updateCourseInfo(this.courseInfo).then((response) => {
        this.$message.success(response.message)
        this.$parent.courseId = response.data.courseId // 获取courseId
        this.$parent.active = 1 // 下一步 访问父组件的成员 $parent
      })
    },
    // 上传成功回调
    handleCoverSuccess(res, file) {
      if (res.success) {
        // console.log(res)
        this.courseInfo.cover = res.data.url
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败1（非20000）')
      }
    },

    // 上传校验
    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 错误处理
    handleCoverError() {
      console.log('error')
      this.$message.error('上传失败（http错误）')
    }
  }
}
</script>
