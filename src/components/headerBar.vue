<template>
  <header class="header">
    <div class="header-container flex-between">
      <img class="face" src="/img/logo.png" alt="">
      <form class="header-form" action="">
        <input class="header-search-input" type="text" name="keyword" placeholder="search" value="" title="输入搜索的关键词">
      </form>
      <div class="header-navbar">
        <nav class="header-nav">
          <a class="header-nav-item" v-for="(item, name) of nav" :key="name" :class="name===active ? 'header-nav-active' : ''" :href="'/'+name+'.html'">{{item}}</a>
        </nav>
        <nav class="header-nav-dropmenu">
          <a class="header-nav-item" v-for="(item, name) of nav" :key="name" :class="name===active ? 'header-nav-active' : ''" :href="'/'+name+'.html'">{{item}}</a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import store from '../../utils/store.js'
export default {
  name: 'header-bar',
  props: ['active'],
  data () {
    return {
      nav: store.nav
    }
  }
}
</script>

<style>
  .header{
    margin: 0 auto;
    padding: 1em 0;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    box-sizing: border-box;
  }
  .header-container{
    max-width: 800px;
    margin: 0 auto;
  }
  .face{
    width: .5rem;
    min-width: 24px;
    max-width: 36px;
    border-radius: 50%;
  }
  .header-form{
    box-sizing: border-box;
    width: 100%;
    max-width: 300px;
    min-width: 120px;
    padding: 0 1em;
    position: relative;
  }
  .header-search-input{
    border: 1px solid #ddd;
    padding: .2em .4em;
    line-height: 1;
    border-radius: 1em;
    width: 100%;
    box-sizing: border-box;
    -webkit-appearance: none;
    font-size: 16px;
  }
  .header-search-input:focus{
    outline: none;
    border-color: #4787e2;
    box-shadow: #4787e2 0 0 4px;
  }
  .data-list{
    -webkit-appearance: none;
    box-sizing: border-box;
  }
  .header-navbar{
    position: relative;
  }
  .header-nav{
    white-space: nowrap;
  }
  a.header-nav-item{
    text-decoration: none;
    display: inline-block;
    margin: 0 .4em;
    padding: .2em .1em;
    color: #477a4d;
    border-radius: 4px;
    line-height: 1;
    position: relative;
  }
  .header-nav-item:after{
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    border-bottom: 2px solid;
    transform: scaleX(0);
  }
  a.header-nav-active:after,
  a.header-nav-item:hover:after{
    transition: .3s;
    transform: scaleX(1);
  }
  .header-nav-dropmenu{
    display: none;
    position: absolute;
    background: #fff;
    box-shadow: #aaa 0 2px 2px;
    right: 0;
    top: 1.5em;
    border-radius: 4px;
    transform-origin: top right;
  }
  @media (max-width: 480px) {
    .header-nav{
      white-space: normal;
      height: 1.5em;
      overflow: hidden;
    }
    .header-nav:before{
      content: '=';
      color: #555;
      font-weight: bolder;
      text-align: center;
      display: block;
      width: 1em;
      height: .8em;
      border-top: 2px solid;
      border-bottom: 2px solid;
      line-height: .8;
      margin: .2em auto;
      cursor: pointer;
    }
    .header-nav:hover{
      background: #eee;
    }
    a.header-nav-item{
      display: block;
      margin: 0;
    }
    .header-nav-dropmenu .header-nav-item{
      margin: .4em 1em;
      white-space: nowrap;
    }
    .header-nav-dropmenu:hover,
    .header-nav:hover ~ .header-nav-dropmenu{
      display: block;
      animation: zoom-in .6s forwards;
    }
  }
  @keyframes zoom-in {
    0%{
      transform: scale(0);
    }
    100%{
      transform: scale(1);
    }
  }
</style>
