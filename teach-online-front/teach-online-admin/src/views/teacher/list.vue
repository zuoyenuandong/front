<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="讲师" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="头衔">
          <el-option value="1" label="高级讲师" />
          <el-option value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="searchObj.joinDateBegin"
          placeholder="开始时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="searchObj.joinDateEnd"
          placeholder="结束时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData()">
          查询
        </el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 10px">
      <el-button type="danger" size="mini" @click="batchRemove()">
        批量删除
      </el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column label="#" width="50">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="level" label="头衔" width="140">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1" type="success">高级讲师</el-tag>
          <el-tag v-if="scope.row.level === 2">首席讲师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="资历" width="400" />
      <el-table-column prop="sort" label="排序" width="120" />
      <el-table-column prop="joinDate" label="入驻时间" width="200" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">
              修改
            </el-button>
          </router-link>
          <el-button
            size="mini"
            type="danger"
            @click="removeById(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20]"
      style="padding: 30px 0px; text-align: center"
      layout="sizes,prev, pager, next,jumper,-> ,total"
      @current-change="changeCurrentPage"
      @size-change="changePageSize"
    />
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'

export default {
  data() {
    return {
      list: [], // 讲师列表
      total: 0,
      page: 1,
      limit: 5,
      searchObj: {},
      multipleSelection: []
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    // 调用api模块，加载讲师列表
    fetchData() {
      teacherApi
        .pageList(this.page, this.limit, this.searchObj)
        .then((response) => {
          this.list = response.data.rows
          this.total = response.data.total
        })
    },
    changeCurrentPage(page) {
      this.page = page
      this.fetchData()
    },
    changePageSize(size) {
      this.limit = size
      this.fetchData()
    },
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },
    removeById(id) {
      // 询问是否删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return teacherApi.removeById(id)
        })
        .then((response) => {
          // 刷新页面
          this.fetchData()
          // 弹出成功提示
          this.$message({
            message: response.message,
            type: 'success'
          })
        })
        .catch((err) => {
          if (err === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          }
        })
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    batchRemove() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择后再删除',
          type: 'warning'
        })
        return
      }
      // 询问是否删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const idList = []
          this.multipleSelection.forEach((element) => {
            idList.push(element.id)
          })
          return teacherApi.batchRemove(idList)
        })
        .then((response) => {
          // 刷新页面
          this.fetchData()
          // 弹出成功提示
          this.$message({
            message: response.message,
            type: 'success'
          })
        })
        .catch((err) => {
          if (err === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          }
        })
    }
  }
}
</script>
