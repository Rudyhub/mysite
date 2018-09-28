<template>
  <div class="img-list">
    <figure class="img-list-figure" v-for="(item, index) of thisItems" :key="'i'+index" :style="{width: calcWidth(item.zoom)}">
      <img class="img-list-img" :src="item.img" :alt="item.caption" draggable="false">
      <figcaption class="img-list-figcaption"><span class="fs12">{{item.caption}}</span></figcaption>
    </figure>
  </div>
</template>

<script>
export default {
  name: 'img-list',
  props: {
    items: [Array],
    times: {
      type: [Number],
      default: 2
    }
  },
  data () {
    let items, len, i, s1, s2, s3
    items = JSON.parse(JSON.stringify(this.items))
    len = items.length
    for (i = 0; i < len; i++) {
      items[i].zoom = [0, 0]
    }
    for (i = 0; i < len; i += 2) {
      s1 = items[i].scale[1] / items[i].scale[0]
      s2 = items[i + 1] ? items[i + 1].scale[1] / items[i + 1].scale[0] : 0.5625
      items[i].zoom[0] = s2 / (s1 + s2)
      if (items[i + 1]) items[i + 1].zoom[0] = s1 / (s1 + s2)
    }
    for (i = 0; i < len; i += 3) {
      s1 = items[i].scale[1] / items[i].scale[0]
      s2 = items[i + 1] ? items[i + 1].scale[1] / items[i + 1].scale[0] : 0.5625
      s3 = items[i + 2] ? items[i + 2].scale[1] / items[i + 2].scale[0] : 0.5625
      items[i].zoom[1] = (s2 * s3) / (s1 * s2 + s2 * s3 + s1 * s3)
      if (items[i + 1]) items[i + 1].zoom[1] = (s1 * s3) / (s1 * s2 + s2 * s3 + s1 * s3)
      if (items[i + 2]) items[i + 2].zoom[1] = (s1 * s2) / (s1 * s2 + s2 * s3 + s1 * s3)
    }
    return {
      thisItems: items
    }
  },
  methods: {
    calcWidth (zoom) {
      if (zoom[this.times - 2]) {
        return zoom[this.times - 2] * 100 + '%'
      } else {
        return 100 / this.times + '%'
      }
    }
  }
}
</script>

<style>
  .img-list{
    font-size: 0;
    text-align: center;
    text-align-last: left;
  }
  .img-list-figure{
    margin: 0 0 20px;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: bottom;
    padding: 5px;
  }
  .img-list-img{
    display: block;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
  }
  .img-list-figcaption{
    text-align: center;
    text-align-last: auto;
    font-weight: bold;
    background: #fff;
    padding-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .img-list-figcaption span{
    display: inline-block;
    padding: .4em;
    border-bottom: 3px double;
    text-align: left;
  }
</style>
