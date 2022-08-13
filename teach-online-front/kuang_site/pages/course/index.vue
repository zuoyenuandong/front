<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- 课程列表 开始 -->
    <section class="container">
      <header class="comm-title">
        <h2 class="fl tac">
          <span class="c-333">全部课程</span>
        </h2>
      </header>
      <section class="c-sort-box">
        <section class="c-s-dl">
          <dl>
            <dt>
              <span class="c-999 fsize14">课程类别</span>
            </dt>
            <dd class="c-s-dl-li">
              <!-- 一级类别 开始-->
              <ul class="clearfix">
                <li :class="{current:!$route.query.subjectParentId}">
                  <a
                    title="全部"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelOne()">全部</a>
                </li>
                <li v-for="(subject,index) in subjectNestedList" :key="index" :class="{current:$route.query.subjectParentId===subject.id}">
                  <a
                    :title="subject.title"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelOne(subject.id)">{{ subject.title }}</a>
                </li>
              </ul>
              <!-- /一级类别 结束-->
            </dd>
          </dl>
          <dl>
            <dt>
              <span class="c-999 fsize14"/>
            </dt>
            <dd class="c-s-dl-li">
              <!-- 二级类别 开始-->
              <ul v-if="$route.query.subjectParentId" class="clearfix">
                <li :class="{current:!$route.query.subjectId}">
                  <a
                    title="全部"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelTwo()">全部</a>
                </li>
                <li v-for="(subSubject,index) in subSubjectList" :key="index" :class="{current:$route.query.subjectId===subSubject.id}">
                  <a
                    :title="subSubject.title"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelTwo(subSubject.id)">{{ subSubject.title }}</a>
                </li>
              </ul>
              <!-- /二级类别 结束-->
            </dd>
          </dl>
          <div class="clear"/>
        </section>
        <div class="js-wrap">
          <section class="fr">
            <span class="c-ccc">
              <i class="c-master f-fM">1</i>/
              <i class="c-666 f-fM">1</i>
            </span>
          </section>
          <section class="fl">
            <!-- 排序 开始-->
            <ol class="js-tap clearfix">
              <li :class="{'current bg-green':searchObj.buyCountSort}">
                <a title="销量" href="javascript:void(0);" @click="SearchByBuyCountSort()">销量
                  <i>↓</i>
                </a>
              </li>
              <li :class="{'current bg-green':searchObj.gmtCreateSort}">
                <a title="最新" href="javascript:void(0);" @click="SearchByGmtCreateSort()">最新
                </a>
              </li>
              <li :class="{'current bg-green':searchObj.priceSort}">
                <a title="价格" href="javascript:void(0);" @click="SearchByPriceSort()">价格
                </a>
              </li>
            </ol>
            <!-- /排序 结束-->
          </section>
        </div>
        <div class="mt40">
          <!-- /无数据提示 开始-->
          <section v-if="courseList.length === 0" class="no-data-wrap">
            <em class="icon30 no-data-ico">&nbsp;</em>
            <span class="c-666 fsize14 ml10 vam">没有相关数据，小编正在努力整理中...</span>
          </section>
          <!-- /无数据提示 结束-->

          <!-- 数据列表 开始-->
          <article v-if="courseList.length > 0" class="comm-course-list">
            <ul id="bna" class="of">
              <li v-for="(course,index) in courseList" :key="index">
                <div class="cc-l-wrap">
                  <section class="course-img">
                    <img :alt="course.title" :src="course.cover" class="img-responsive">
                    <div class="cc-mask">
                      <a :href="'/course/'+course.id" :title="course.title" class="comm-btn c-btn-1">开始学习</a>
                    </div>
                  </section>
                  <h3 class="hLh30 txtOf mt10">
                    <a :href="'/course/'+course.id" :title="course.title" class="course-title fsize18 c-333">{{ course.title }}</a>
                  </h3>
                  <section class="mt10 hLh20 of">
                    <span v-if="Number(course.price)===0" class="fr jgTag bg-green">
                      <i class="c-fff fsize12 f-fA">免费</i>
                    </span>
                    <span v-if="Number(course.price)>0" class="fr jgTag ">
                      <i class="c-orange fsize12 f-fA"> ￥{{ course.price }}</i>
                    </span>
                    <span class="fl jgAttr c-ccc f-fA">
                      <i class="c-999 f-fA">{{ course.viewCount }}人学习</i>
                      |
                      <i class="c-999 f-fA">{{ course.buyCount }}人购买</i>
                    </span>
                  </section>
                </div>
              </li>
            </ul>
            <div class="clear"/>
          </article>
          <!-- /数据列表 结束-->
        </div>
      </section>
    </section>
    <!-- /课程列表 结束 -->
  </div>
</template>
<script>
import courseApi from '~/api/course'
import subjectApi from '~/api/subject'
import querystring from 'querystring'

export default {

  async asyncData(page) {
    // 组装查询参数
    const searchObj = {}

    const query = page.route.query
    searchObj.subjectParentId = query.subjectParentId || ''
    searchObj.subjectId = query.subjectId || ''
    searchObj.buyCountSort = query.buyCountSort || ''
    searchObj.gmtCreateSort = query.gmtCreateSort || ''
    searchObj.priceSort = query.priceSort || ''

    // 课程列表
    const courseListResponse = await courseApi.getList(searchObj)
    const courseList = courseListResponse.data.courseList

    const subjectNestedListResponse = await subjectApi.getSubjectNestedList()
    const subjectNestedList = subjectNestedListResponse.data.items

    let subSubjectList = []
    // 遍历一级分类
    for (let i = 0; i < subjectNestedList.length; i++) {
      // 如果查询参数中的一级分类id和当前一级分类id一致
      if (subjectNestedList[i].id === searchObj.subjectParentId) {
        // 则获取二级分类列表
        subSubjectList = subjectNestedList[i].children
      }
    }

    return {
      courseList, // 课程列表
      subjectNestedList,
      subSubjectList,
      searchObj
    }
  },
  methods: {
    searchSubjectLevelOne(subjectParentId) {
      if (subjectParentId) {
        window.location = 'course?subjectParentId=' + subjectParentId
      } else {
        window.location = 'course'
      }
    },
    searchSubjectLevelTwo(subjectId) {
      if (subjectId) {
        const queryObj = {
          subjectId: subjectId,
          subjectParentId: this.searchObj.subjectParentId
        }
        const querys = querystring.stringify(queryObj)
        window.location = 'course?' + querys
      } else {
        window.location = 'course?subjectParentId=' + this.searchObj.subjectParentId
      }
    },
    SearchByBuyCountSort() {
      window.location = 'course?subjectId=' + this.searchObj.subjectId + '&subjectParentId=' + this.searchObj.subjectParentId + '&buyCountSort=1'
    },
    SearchByGmtCreateSort() {
      const queryObj = {
        subjectId: this.searchObj.subjectId,
        subjectParentId: this.searchObj.subjectParentId,
        gmtCreateSort: 1
      }
      const querys = querystring.stringify(queryObj)
      window.location = 'course?' + querys
    },
    SearchByPriceSort() {
      const queryObj = {
        subjectId: this.searchObj.subjectId,
        subjectParentId: this.searchObj.subjectParentId,
        priceSort: 1
      }
      const querys = querystring.stringify(queryObj)
      window.location = 'course?' + querys
    }
  }
}
</script>
