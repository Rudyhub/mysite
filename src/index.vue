<template>
  <div class="home">
    <div class="computer">
      <transition name="computer-cover" @afterEnter="coverAfterEnd">
        <div v-show="show" class="computer-cover">
          <div class="computer-back-cover flex-column">
            <img class="computer-logo" src="/img/face.png" alt="">
            <p>RUDY</p>
          </div>
          <div class="computer-screen">
            <component ref="screen" :is="screen" @welcomeEnd="welcomeEndFn"/>
          </div>
        </div>
      </transition>
      <div class="computer-keyboard">
        <keyboard/>
        <div ref="lyric" class="lyric fs16 flex-center" :style="{backgroundImage: 'linear-gradient(to right, #2f4d2f '+songPlayed+'%, #4d2f2f '+songPlayed+'%, #4d2f2f '+songBufer+'%, transparent '+songBufer+'%)'}">
          <div class="lyric-text">{{lyric}}</div>
          <div class="lyric-line" v-for="i of lines" :key="'h'+i" :style="{top: i*2 + 'px'}">
          </div>
        </div>
      </div>
    </div>
    <div class="ICP">
      <a class="ICP-a" href="http://www.miitbeian.gov.cn/" target="_blank">
        粤ICP备 18116298号
      </a>
      <a class="ICP-a" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030402002546" target="_blank">
        <img class="ICP-img" src="/img/beian.png"/>
        <span class="ICP-span">粤公网安备 44030402002546号</span>
      </a>
    </div>
  </div>
</template>

<script>
import welcome from './components/welcome'
import command from './components/command'
import keyboard from './components/keyboard'
import music from '../utils/music.js'
export default {
  name: 'home',
  components: {welcome, command, keyboard},
  data () {
    return {
      show: false,
      screen: null,
      lyric: '',
      lines: 0,
      songPlayed: 0,
      songBufer: 0
    }
  },
  mounted () {
    music.init()
    this.lines = Math.round(this.$refs.lyric.offsetHeight / 2)
    music.on('lrcupdate', lrc => {
      this.lyric = lrc
    })
    music.on('timeupdate', (cur, dur) => {
      this.songPlayed = 100 * (cur / dur).toFixed(4)
    })
    music.on('buffer', buf => {
      this.songBufer = buf
    })
    music.on('srcupdate', () => {
      this.lyric = ''
      try {
        this.$refs.screen.autoLine()
      } catch (e) {}
    })
    this.show = true
  },
  methods: {
    coverAfterEnd () {
      this.screen = 'welcome'
    },
    welcomeEndFn () {
      this.screen = 'command'
    }
  }
}
</script>

<style>
  .home{
    perspective: 18rem;
    width: 100%;
    height: 10rem;
    margin: 0 auto;
    overflow: hidden;
  }
  .computer-logo{
    width: 10%;
    opacity: .5;
  }
  .computer{
    transform-style: preserve-3d;
    transform: translateY(.1rem);
    width: 10rem;
    height: 12rem;
    margin: 0 auto;
  }
  .computer-cover,
  .computer-keyboard,
  .computer-back-cover{
    height: 6rem;
    width: 10rem;
    position: absolute;
    left: 0;
    box-sizing: border-box;
    box-shadow: inset 0 0 .02rem #8a8583;
    transform-style: preserve-3d;
  }
  .computer-back-cover{
    background: linear-gradient(#333, #272224);
    top: 0;
    color: #888;
    transform: scaleX(-1);
  }
  .computer-cover{
    background: linear-gradient(#333, #272224);
    transform: rotateX(0);
    transform-origin: bottom;
    top: 0;
  }
  .computer-back-cover, .computer-cover{
    border-radius: .1rem .1rem 0 0;
  }
  .computer-cover-enter-active,
  .computer-cover-leave-active{
    transition: transform 2s .3s;
  }
  .computer-cover-enter,
  .computer-leave-to{
    transform: rotateX(-107deg);
  }
  .computer-keyboard{
    background: linear-gradient(135deg, #222, #17151c);
    transform: rotateX(72deg);
    top: 6rem;
    transform-origin: top;
  }
  .computer-keyboard:after{
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-bottom: .1rem solid;
    box-shadow: inset 0 -.01rem .02rem #686361;
  }
  .computer-keyboard, .computer-keyboard:after{
    border-radius: 0 0 .25rem .25rem;
  }
  .computer-screen{
    width: 98%;
    height: 97%;
    margin: 1% 1% 2%;
    background: #111;
    color: #fff;
    position: absolute;
    z-index: 1;
    transform: translate3d(0,0,1px);
  }
  .lyric{
    word-break: break-all;
    height: 1rem;
    position: absolute;
    bottom: .25rem;
    width: 98%;
    background-color: #2f2323;
    left: 0;
    right: 0;
    margin: auto;
    overflow: hidden;
  }
  .lyric-text{
    color: #86a0fe;
    text-shadow: 0 0 .2em #000000;
  }
  .lyric-line{
    position: absolute;
    color: #111;
    height: 2px;
    border-top: 1px dotted;
    border-bottom: 1px dotted;
    width: 100%;
  }
  .ICP{
    width: 100%;
    position: fixed;
    bottom: 0;
    text-align: center;
    white-space: nowrap;
    font-size: 14px;
    opacity: 0.4;
  }
  a.ICP-a{
    display: inline-block;
    vertical-align: middle;
    color: #fee;
    padding: 0 1em;
  }
  .ICP-img, .ICP-span{
    display: inline-block;
    vertical-align: middle;
  }
  @media (max-width: 768px) {
    .ICP{
      font-size: .2rem;
    }
    .ICP-img{
      width: .33rem;
    }
  }
</style>
