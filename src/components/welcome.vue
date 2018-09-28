<template>
  <div class="welcome">
    <span class="welcome-char" v-for="(char, index) of chars" :key="index">{{char}}</span>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  data () {
    return {
      chars: 'Welcome to Rudy\'s Zone'.split('')
    }
  },
  mounted () {
    let _this, children, len, i
    _this = this
    children = _this.$el.children
    len = children.length
    i = 0
    for (; i < len; i++) {
      children[i].style.animationDelay = i * 0.1 + 's'
      children[i].classList.add('welcome-in')
    }
    children[len - 1].addEventListener('animationend', animationEnd)
    function animationEnd (e) {
      this.removeEventListener(e.type, animationEnd)
      _this.$emit('welcomeEnd', e.animationName)
    }
  }
}
</script>

<style>
  .welcome{
    font-size: 0.42rem;
    text-align: center;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: absolute;
  }
  .welcome-char{
    min-width: .5em;
    opacity: 0;
    transform: translateX(100%);
  }
  .welcome-in{
    animation: char-animate 5s;
  }
  @keyframes char-animate {
    0%{
      transform: translateX(100%);
      opacity: 0;
    }
    20%{
      transform: translateX(0);
      opacity: 1;
    }
    40%{
      transform: translateX(0) rotateX(60deg);
    }
    60%{
      transform: translateX(0) rotateX(0);
    }
    80%{
      transform: translateX(0);
      opacity: 1;
    }
    100%{
      transform: translateX(-100%);
      opacity: 0;
    }
  }
</style>
