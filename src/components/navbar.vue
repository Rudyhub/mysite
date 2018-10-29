<template>
  <transition name="fade" @beforeEnter="beforeEnter" @afterLeave="afterLeave">
    <nav v-show="show" class="navbar">
      <a class="navbar-item" v-for="(navItem, name) of nav" :key="name" :href="name==='index' ? '/' : '/'+name+'.html'" >{{navItem}}</a>
      <a class="navbar-item" href="javascript:void(0)" @click="onclick($event, 'help')">指南</a>
    </nav>
  </transition>
</template>

<script>
import store from '../../utils/store.js'
export default {
  name: 'navbar',
  data () {
    return {
      nav: store.nav,
      show: false
    }
  },
  methods: {
    onclick (e, name) {
      this.$emit('click', e, name)
    },
    beforeEnter (e) {
      this.$emit('beforeEnter', e)
    },
    afterLeave (e) {
      this.$emit('afterLeave', e)
    }
  }
}
</script>

<style>
  .navbar{
    text-align: right;
    position: fixed;
    top: 0;
    right: 2em;
    width: 0;
    height: 100%;
    color: #888;
    z-index: 99;
    perspective: 10.5rem;
    font-size: .22rem;
  }
  .navbar-item{
    background: rgba(200, 240, 255, 0.3);
    border-radius: 4px;
    display: block;
    padding: .5em;
    line-height: 1;
    cursor: pointer;
    white-space: nowrap;
    width: 2.5em;
    text-decoration: none;
    border: 1px solid #2e6881;
    transition: transform .5s;
    transform-origin: right;
    margin: .2em 0;
  }
  a.navbar-item{
    color: #fff;
  }
  .navbar-item:hover{
    background: rgba(200, 240, 255, 0.5);
    transform: rotateY(-10deg);
  }
</style>
