<template>
  <div class="link-list">
    <h1 class="link-list-h1">
      <a class="link-list-h1-a" :href="href || 'javascript:void(0)'" target="_blank">{{title}}</a>
    </h1>
    <div class="link-list-info">
      特别推荐：
      <span v-for="(rec, rindex) of recommend" :key="rindex">{{rec}}</span>
    </div>
    <ul class="link-list-ul" ref="list" v-if="items">
      <li class="link-list-li"><a v-if="href" :href="href" target="_blank">查看全部项目</a></li>
      <link-item v-for="(item, index) of thisItems" :item="item" :total="total" :index="start+index" :key="index" :href="href"/>
    </ul>
  </div>
</template>

<script>
import utils from '../../utils/utils.js'
import thumb from './thumb'
import bookinner from './bookinner'
import linkItem from './linkItem'
export default {
  name: 'link-list',
  props: ['items', 'title', 'apart', 'href'],
  components: {bookinner, thumb, linkItem},
  data () {
    let len, recommend, thisItems, start, end
    recommend = []
    thisItems = []
    len = this.items.length
    if (this.apart === 'left') {
      start = 0
      end = Math.round(len / 2)
    } else {
      start = Math.round(len / 2)
      end = len
    }
    if (this.items) {
      this.items.forEach((item, index) => {
        if (index >= start && index < end) thisItems.push(item)
        if (item.level === 1) recommend.push(index + 1)
      })
    }
    if (recommend.length < 1) {
      recommend.push('无')
    }
    return {
      recommend,
      total: len,
      thisItems,
      start,
      end
    }
  },
  filters: {
    datemat (date) {
      if (!date) return ''
      let str = date.toString()
      return str.slice(0, 4) + '-' + str.slice(4, 6) + '-' + str.slice(6)
    }
  },
  mounted () {
    utils.scroll(this.$refs.list)
  },
  methods: {
    getFavicon: utils.favicon,
    hrefFilter (href, index) {
      return  /^https?:\/\//.test(href) ? href : href + '&' + index
    },
    giveHref (href) {
      return !href ? [this.href] : href
    }
  }
}
</script>

<style>
  .link-list{
    cursor: auto;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  .link-list-h1{
    font-size: 22px;
    text-align: center;
  }
  a.link-list-h1-a{
    color: #553a37;
  }
  .link-list-info{
    font-size: 14px;
    text-align: left;
    margin: 0 3em;
  }
  .link-list-info span{
    display: inline-block;
    vertical-align: top;
    margin: 0 2px;
    background: #308846;
    color: #fff;
    padding: .2em;
    line-height: 1;
    border-radius: .2em;
    min-width: 1em;
    text-align: center;
  }

  .link-list-ul{
    list-style: none;
    text-align: left;
    margin: 1.5em 2em;
    padding: 0;
    height: calc(100% - 150px);
    overflow: hidden;
    box-sizing: border-box;
  }
  @media (max-width: 767px) {
    .link-list-h1{
      font-size: 20px;
    }
  }
</style>
