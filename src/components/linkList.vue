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
      <li class="link-list-li" v-for="(item, index) of thisItems" :key="index">
        <div class="link-list-num">{{start+index+1}} / {{total}}</div>
        <thumb class="link-list-thumb" v-if="item.thumb" :src="item.thumb"/>
        <h2 class="link-list-h2">{{item.title}}
          <sup class="link-list-sup link-list-not-online" v-if="item.online === 0">未上线</sup>
          <sup class="link-list-sup link-list-recommend" v-if="item.level === 1">推荐</sup>
        </h2>
        <div class="link-list-list">
          <time class="link-list-time">{{item.date | datemat}} </time>
          <a class="link-list-item link-list-href" v-for="(href, hIndex) of giveHref(item.href)" :key="'href'+hIndex" :href="hrefFilter(href, start + index)" target="_blank">
            <span class="link-list-favhd">体验</span><img class="link-list-favicon" :src="getFavicon(href)"/>
          </a>
          <a class="link-list-item link-list-source" v-if="item.source" v-for="(source, sIndex) of item.source" :key="'source'+sIndex" :href="hrefFilter(source, start + index)" target="_blank">
            <span class="link-list-favhd">源码</span><img class="link-list-favicon" :src="getFavicon(source)"/>
          </a>
          <a class="link-list-item link-list-docs" v-if="item.docs" v-for="(doc, dIndex) of item.docs" :key="'docs'+dIndex" :href="hrefFilter(doc, start + index)" target="_blank">
            <span class="link-list-favhd">文档</span><img class="link-list-favicon" :src="getFavicon(doc)"/>
          </a>
        </div>
        <div class="link-list-desc" v-if="item.desc" v-html="item.desc"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import utils from '../../utils/utils.js'
import thumb from './thumb'
import bookinner from './bookinner'
export default {
  name: 'link-list',
  props: ['items', 'title', 'apart', 'href'],
  components: {bookinner, thumb},
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
  .link-list-h2{
    font-size: 16px;
    margin-top: 0;
    margin-bottom: 1em;
    font-weight: normal;
    white-space: nowrap;
    position: relative;
  }
  .link-list-sup{
    border-radius: 1em;
    line-height: 1;
    padding: .1em .5em;
    color: #fff;
    font-weight: normal;
    font-size: 12px;
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
  .link-list-not-online{
    background: #787677;
  }
  .link-list-recommend{
    background: #308846;
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
  .link-list-li{
    font-size: 15px;
    padding: 1em .5em;
    position: relative;
    box-sizing: border-box;
    line-height: 1;
    overflow: hidden;
    margin: 0 .5em 1.5em;
    box-shadow: #ccc 0 1px 2px;
    background: #fff;
  }
  .link-list-num{
    position: absolute;
    right: 0;
    top: 0;
    padding: .2em .4em;
    line-height: 1;
    background: #dae9f7;
    border-bottom-left-radius: .4em;
    color: #111;
  }
  .link-list-thumb{
    width: 3.6em;
    height: 3.6em;
    margin-right: 1em;
    display: block;
    float: left;
  }
  .link-list-time{
    display: inline-block;
    vertical-align: middle;
  }
  .link-list-item{
    display: inline-block;
    font-size: 12px;
    vertical-align: middle;
    margin: 0 .3em;
    border-radius: 6px;
    overflow: hidden;
    opacity: .8;
    box-sizing: border-box;
    box-shadow: #555 0 0 2px;
  }
  .link-list-item:hover{
    transition: opacity .3s;
    opacity: 1;
  }
  .link-list-href{
    background: linear-gradient(90deg, #6f4940 60%, #eee 60%);
  }
  .link-list-source{
    background: linear-gradient(90deg, #477a4d 60%, #eee 60%);
  }
  .link-list-docs{
    background: linear-gradient(90deg, #7a2850 60%, #eee 60%);
  }
  .link-list-favicon,
  .link-list-favhd{
    display: inline-block;
    vertical-align: middle;
    margin: .1em .3em;
    color: #fff;
  }
  .link-list-favicon{
    height: 1.2em;
  }
  .link-list-desc{
    font-size: 13px;
    color: #666;
    margin-top: .5em;
    padding: .5em 0;
    white-space: normal;
    word-break: break-all;
    line-height: 1.5;
    text-indent: 2em;
    border-top: #eee solid 1px;
  }
  .link-list-desc p{
    margin: 0;
  }
  @media (max-width: 767px) {
    .link-list-h1{
      font-size: 20px;
    }
    .link-list-h2{
      font-size: 14px;
    }
    .link-list-li {
      font-size: 13px;
    }
  }
</style>
