import request from '~/utils/request'
export default {

  getList(searchObj) {
    return request({
      url: '/api/edu/course/list',
      method: 'get',
      params: searchObj
    })
  },
  getById(id) {
    return request({
      url: `/api/edu/course/get/${id}`,
      method: 'get'
    })
  },
  getPlayAuth(vid) {
    return request({
      // baseURL: 'http://localhost:9110',
      url: `/api/vod/media/get-play-auth/${vid}`,
      method: 'get'
    })
  }
}
