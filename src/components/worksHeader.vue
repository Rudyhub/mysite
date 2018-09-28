<template>
  <header class="works-header">
    <h1 class="works-header-h1 fs20">{{title}}</h1>
    <div class="works-header-tools">
      <span class="works-header-tool" v-for="i of 3" :key="'tool'+i" :class="{active: i===active}" @click="toolFn(i)" :title="'每行'+i+'张图'">x{{i}}</span>
    </div>
  </header>
</template>

<script>
export default {
  name: 'works-header',
  props: {
    title: [String],
    active: {
      type: [Number],
      default: 2
    }
  },
  methods: {
    toolFn (i) {
      this.$emit('activeChange', i)
    }
  }
}
</script>

<style>
  .works-header{
    position: relative;
    border-bottom: 1px solid #ddd;
  }
  .works-header-h1{
    text-align: center;
    margin: 0;
    height: .9rem;
    line-height: .9rem;
    background: #333;
    color: #fff;
  }
  .works-header-tools{
    position: absolute;
    left: 0;
    bottom: 2px;
  }
  .works-header-tool{
    display: inline-block;
    width: 2em;
    text-align: center;
    border: 3px double;
    user-select: none;
    color: #ddd;
    cursor: pointer;
    background: #888;
    margin: 0 2px;
  }
  .works-header-tool:hover{
    background: #666;
  }
  .works-header-tool.active{
    background: #318642;
  }
</style>
