<template>
  <div @transitionend="transitionEnd">
    <video v-if="book.video" class="book-cover-img" @mouseenter="playVideo" :src="book.video" :poster="book.thumb" autoplay loop playsinline webkit-playsinline></video>
    <img v-else class="book-cover-img" :src="book.cover" draggable="false">
    <h1 class="book-cover-title">{{book.title}}</h1>
    <h2 class="book-cover-subtitle">{{book.subtitle}}</h2>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'book-cover',
  props: ['book'],
  methods: {
    transitionEnd (e) {
      this.$emit('transitionend', e)
    },
    playVideo (e) {
      e.target.play()
    }
  }
}
</script>
<style>
  .book-cover-title{
    font-size: .6rem;
    line-height: 1;
    padding: .5em;
    border-bottom: 1px solid;
  }
  .book-cover-subtitle{
    text-transform: uppercase;
    font-size: .5rem;
    margin: 0;
  }
  .book-cover-img{
    width: 80%;
    border-radius: 6px;
  }
</style>
