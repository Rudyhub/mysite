<template>
  <div class="works-detail">
    <works-header :title="title" :active="active" @activeChange="activeFn"/>
    <section ref="body" class="works-detail-body">
      <article class="works-detail-art" v-for="(work, index) of items" :key="'w'+index">
        <header class="works-detail-art-header">
          <h2 class="works-detail-h2 fs14">{{(index+1)+'. '+work.title}}</h2>
          <p class="works-detail-date fs12">{{work.date | datemat}}</p>
        </header>
        <img-list :items="work.items" :times="active"/>
      </article>
    </section>
  </div>
</template>

<script>
import utils from '../utils/utils.js'
import worksHeader from './components/worksHeader'
import imgList from './components/imgList'
export default {
  name: 'works-detail',
  components: {worksHeader, imgList},
  props: ['workName', 'progIndex'],
  data () {
    let data, title, items
    data = window.localStorage.getItem('RudyData')
    try {
      data = JSON.parse(data)
      title = data.works[this.workName].title
      items = data.works[this.workName].items
      if (typeof this.progIndex !== 'undefined' && items[this.progIndex]) {
        items = [items[this.progIndex]]
      }
    } catch (e) {
      title = '无数据'
      items = []
    }
    return {
      title,
      items,
      active: 2
    }
  },
  mounted () {
    utils.scroll(this.$refs.body)
  },
  methods: {
    activeFn (index) {
      this.active = index
    }
  },
  filters: {
    datemat (date) {
      date = date.toString()
      return date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6)
    }
  }
}
</script>

<style>
.works-detail{
  height: 100%;
  background: #fff;
  overflow: hidden;
}
.works-detail-body{
  margin-top: .05rem;
  height: calc(100% - 1rem);
  overflow: hidden;
  position: relative;
}
.works-detail-art{
  margin: 0 auto 25px;
  box-sizing: border-box;
}
.works-detail-h2{
  background: #333;
  color: #fff;
  display: inline-block;
  padding: .5em;
  margin: 0;
  border-radius: 0 .2em .2em 0;
}
.works-detail-date{
  color: #888;
  margin: 0;
  padding-left: 1em;
}
</style>
