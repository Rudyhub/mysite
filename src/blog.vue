<template>
  <section class="blog">
    <header-bar active="blog"/>
    <div class="blog-main">
      <article class="blog-art" v-for="(art, index) of arts" :key="index">
        <h2>{{art.title}}</h2>
        <div class="art-date">{{art.date | datemat}}</div>
        <div v-html="art.content"></div>
      </article>
    </div>
  </section>
</template>

<script>
import headerBar from './components/headerBar'
import utils from '../utils/utils.js'
import store from '../utils/store.js'
export default {
  name: 'blog',
  components: {headerBar},
  data () {
    let arts = []
    utils.ajax({
      url: store.dataApi + '?name=blog'
    }).then(res => {
      res.sort((a, b) => {
        return b.date - a.date
      })
      res.forEach((item, i) => {
        this.$set(this.arts, i, item)
      })
    }, err => {
      console.error(err)
    })
    return {
      arts
    }
  },
  filters: {
    datemat (date) {
      date = date + ''
      return date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6)
    }
  }
}
</script>
<style>
  .blog{
    background: #fff;
    height: 100%;
    overflow: hidden;
  }
  .blog-main{
    height: calc(100% - 66px);
    overflow: auto;
    background: #fff;
  }
  .blog-art{
    padding: 10px;
  }
  .art-date{
    color: #555;
  }
</style>
