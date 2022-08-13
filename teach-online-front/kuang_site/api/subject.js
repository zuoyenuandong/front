import request from '~/utils/request'
export default {

  getSubjectNestedList() {
    return request({
      url: '/api/edu/subject/nested-list',
      method: 'get'
    })
  }
}
