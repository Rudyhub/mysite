<template>
  <section class="album">
    <header-bar active="album"/>
    <div style="text-align: center">...</div>
  </section>
</template>

<script>
import headerBar from './components/headerBar'
export default {
  name: 'ablum',
  components: {headerBar}
}
</script>
<style>
  .album{
    background: #fff;
    height: 100%;
  }
</style>
