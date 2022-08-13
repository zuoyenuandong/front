<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
    <el-tree
      ref="tree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
    />
  </div>
</template>

<script>
import subjectApi from '@/api/subject'
export default {
  data() {
    return {
      filterText: '',
      subjectList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.fetchNodeList()
  },

  methods: {
    fetchNodeList() {
      subjectApi.getNestedTreeList().then((response) => {
        this.subjectList = response.data.items
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
}
</script>

