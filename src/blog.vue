<template>
  <section class="blog">
    <header-bar active="blog"/>
    <div class="blog-main">
      <ul class="art-list">
        <li class="art-item" v-for="(art, index) of arts" :key="index" :title="art.title" @click="loadArt(art.time, $event)">
          <span class="art-date">[{{art.time | timemat}}]</span>
          {{art.title}}
        </li>
      </ul>
      <div class="art-content" v-html="content"></div>
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
        return b.time - a.time
      })
      res.forEach((item, i) => {
        this.$set(this.arts, i, item)
      })
      this.loadArt(res[0].time)
    }, err => {
      console.error(err)
    })
    return {
      arts,
      content: ''
    }
  },
  filters: {
    timemat (time) {
      let date = new Date()
      date.setTime(time)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    }
  },
  mounted () {
    let _this = this;
    _this.$watch('content', (newval, oldval) => {
      if(newval !== oldval){
        try{
          let codes = _this.$el.querySelectorAll('code');
          for(let i=0, len=codes.length; i<len; i++){
            hljs.highlightBlock(codes[i]);
          }
        }catch(err){}
      }
    });
  },
  methods: {
    loadArt (id) {
      let _this = this;
      utils.ajax({
        url: store.dataApi + '?blog_art_content=' + id
      }).then(res => {
        _this.content = marked(res.content || '')
      }, err => {
        console.error(err)
      });
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
    overflow: hidden;
    background: #fff;
  }
  .art-list{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    width: 25%;
    height: 100%;
    overflow: auto;
    background-color: #f9f6ff;
    border-right: 1px solid #ddd;
    float: left;
  }
  .art-item{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: .5em;
    box-sizing: border-box;
    transition: background-color .5s;
    cursor: pointer;
  }
  .art-item:hover,
  .art-item.active{
    background-color: #d0e0f9;
  }
  .art-date{
    color: #555;
  }
  .art-content{
    width: calc(75% - .5em);
    height: 100%;
    overflow: auto;
    float: right;
  }
  @media (min-width: 1400px) {
    .art-list{
      width: 350px;
    }
    .art-content {
      width: calc(100% - 360px);
    }
  }
</style>
