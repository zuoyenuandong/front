<template>
  <div>
    hello world
  </div>
</template>
<script>
import teacherApi from '~/api/teacher'

export default({
  asyncData() {
    return teacherApi.getList().then(response => {
      return {
        items: response.data.items
      }
    })
  }
})
</script>
