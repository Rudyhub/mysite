<template>
  <transition name="works" @afterEnter="afterEndFn">
    <div v-show="show" class="works flex-center" :style="'perspective: '+(stagePerspective/10)+'rem'" @transitionend="stageTransEnd">
      <navbar ref="navbar" class="flex-column" @click="navbarClick"/>
      <popup ref="popup" @beforeEnter="onPopupShow" @afterLeave="onPopupHide">
        <p class="fs12 popup-color-1"><b>操作指南：</b></p>
        <p class="fs10">
          鼠标左键左右拖动<b class="popup-color-1">&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;&nbsp;&nbsp;</b>旋转<br>
          点击书本<b class="popup-color-1">&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;&nbsp;&nbsp;</b>进入查看作品<br/>
          书本被打开后，双击<b class="popup-color-1">&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;&nbsp;&nbsp;</b>关闭书本
        </p>
      </popup>
      <div class="works-table flex-center"
           :style="{
           transition: (allTransition ? 'all '+allTransition+'s' : 'none'),
           transform: 'translateY('+(tableTranslateY/10)+'rem) rotateX(' + tableRotateX + 'deg) rotateZ(' + tableRotateZ + 'deg)'
           }">
        <div class="book" v-for="(book, name) of books" :key="name" @click="readBook(name)"
             :style="{
             transition: (allTransition ? 'transform '+allTransition+'s' : 'none'),
             transform: 'scale3d('+book.scale+','+book.scale+','+book.scale+') rotateX(-90deg) rotateY(' + book.rotateY + 'deg) translate3d('+(book.translateX/10)+'rem,-5rem,0)'
             }">
          <book-cover :book="book" class="book-cover flex-center" :style="{transform: 'rotateY('+book.coverRotateY+'deg)'}">
            <div class="book-cover-inner" @dblclick="closeBook(name)">
              <link-list :items="book.items" apart="left" :title="book.title" :href="book.href"/>
            </div>
          </book-cover>
          <div class="book-spine book-spine-a flex-center">
            <div class="book-spine-title" v-html="spineTextFilter(book.title)"></div>
            <div class="book-spine-subtitle" v-html="spineTextFilter(book.subtitle)"></div>
          </div>
          <div class="book-spine book-spine-b"></div>
          <div class="book-spine book-spine-c"></div>
          <div class="book-spine book-spine-d"></div>
          <book-cover :book="book" class="book-back-cover flex-center">
            <div class="book-back-cover-inner" @dblclick="closeBook(name)">
              <link-list :items="book.items" apart="right" :title="book.title" :href="book.href"></link-list>
            </div>
          </book-cover>
        </div>
      </div>
      <div class="works-table-leg"
           :style="{
           transition: (allTransition ? 'transform '+allTransition+'s' : 'none'),
           transform: 'rotateX('+(tableRotateX+90)+'deg) translate3d(0, -'+(4.2+tableTranslateY/10)+'rem, -2rem)'
           }"></div>
    </div>
  </transition>
</template>

<script>
import bookCover from '../components/bookCover'
import popup from '../components/popup'
import utils from '../utils/utils.js'
import navbar from '../components/navbar'
import linkList from '../components/linkList'
export default {
  name: 'works',
  components: {bookCover, popup, navbar, linkList},
  data () {
    let inits = Object.freeze({
      stagePerspective: 100,
      tableRotateX: 60,
      tableTranslateY: 0
    })
    return {
      show: false,
      activeIndex: -1,
      inits,
      books: {},
      stagePerspective: inits.stagePerspective,
      tableRotateX: 90,
      tableRotateZ: 0,
      tableTranslateY: inits.tableTranslateY,
      allTransition: 0.8,
      isRotateTable: false,
      isBookOpened: true
    }
  },
  mounted () {
    let _this, z, listener
    _this = this
    z = this.tableRotateZ
    listener = utils.listener(this.$el, {
      start () {
        z = _this.tableRotateZ
        _this.isRotateTable = false
      },
      move (disX) {
        _this.allTransition = 0
        _this.tableRotateZ = z - disX / 10
        _this.isRotateTable = true
      },
      end (disX, disY) {
        if (Math.abs(disX) < 3 && Math.abs(disY) < 3) {
          _this.isRotateTable = false
        }
        _this.allTransition = 0.8
      },
      easeOut (spX) {
        if (_this.isRotateTable) {
          _this.allTransition = 0
          _this.tableRotateZ -= this.directionX * spX / 10
        }
      },
      easeOutEnd () {
        _this.isRotateTable = false
        _this.allTransition = 0.8
      }
    })
    utils.ajax({
      url: 'http://localhost:8000?jsonFile=works'
    }).then(res => {
      let len, i, local
      len = Object.keys(res).length
      i = 0
      for (let name in res) {
        _this.$set(_this.books, name, {
          rotateY: Math.round(i * (360 / len)),
          coverRotateY: -90,
          scale: 0.25,
          translateX: -80
        })
        for (let k in res[name]) {
          _this.books[name][k] = res[name][k]
        }
        i++
      }
      local = JSON.parse(window.localStorage.getItem('RudyData') || '{}')
      local.works = _this.books
      window.localStorage.setItem('RudyData', JSON.stringify(local))

      _this.show = true
    }, err => {
      console.error(err)
    })
    this.$on('offRotate', () => {
      listener.off()
    })
    this.$on('onRotate', () => {
      listener.on()
      this.isBookOpened = false
    })
  },
  methods: {
    afterEndFn () {
      let _this, timer
      _this = this
      timer = setTimeout(() => {
        clearTimeout(timer)
        _this.allTransition = 0.8
        _this.$refs.navbar.show = true
        _this.$refs.popup.show = true
      }, 1500)
      _this.allTransition = 1.5
      _this.tableRotateX = 60
    },
    navbarClick (e, name) {
      if (name === 'help') {
        this.$refs.popup.show = !this.$refs.popup.show
      }
    },
    spineTextFilter (val) {
      return val.split('').join('<br>')
    },
    readBook (name) {
      // 事件冒泡：book的click和旋转控制的mousedown->mouseup(touchstart->touchend)相互冲突，通过isRotateTable判断鼠标/手指是否触发了move事件和鼠标移动距离来判断是否是旋转操作
      if (this.isRotateTable) return
      if (this.isBookOpened) return
      this.isBookOpened = true
      this.activeIndex = name
      if (this.stagePerspective === this.inits.stagePerspective) {
        this.$emit('offRotate')
        this.tableRotateX = 90
        this.tableRotateZ = this.books[name].rotateY - 90
        this.tableTranslateY = 16
        this.stagePerspective = 50
        this.books[name].scale = 0.32
        this.$refs.navbar.show = false
      }
    },
    onPopupShow () {
      this.$emit('offRotate')
    },
    onPopupHide () {
      this.$emit('onRotate')
    },
    stageTransEnd (e) {
      if (e.target === e.currentTarget) {
        if (this.stagePerspective !== this.inits.stagePerspective) {
          this.books[this.activeIndex].coverRotateY = -270
          this.books[this.activeIndex].translateX = -100
        } else {
          if (e.propertyName === 'perspective') {
            this.$emit('onRotate')
            this.isBookOpened = false
          }
        }
      }
    },
    closeBook (name) {
      this.tableRotateX = this.inits.tableRotateX
      this.tableTranslateY = this.inits.tableTranslateY
      this.stagePerspective = this.inits.stagePerspective
      this.books[name].scale = 0.25
      this.books[name].translateX = -80
      this.books[name].coverRotateY = -90
      this.$refs.navbar.show = true
    }
  }
}
</script>

<style>
  .works{
    perspective: 10rem;
    height: 10rem;
    background: #07080d;
    overflow: hidden;
    transition: all 0.8s;
  }
  .works-enter,
  .works-leave-to{
    opacity: 0;
  }
  .works-enter-active,
  .works-leave-active{
    transition: opacity .5s;
  }
  .works-leave,
  .works-enter-to{
    opacity: 1;
  }
  .works-table{
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
    background: rgba(200, 240, 255, 0.2);
    border: 3px solid #2e6881;
    transform-style: preserve-3d;
    position: absolute;
    z-index: 2;
  }
  .works-table:after{
    content: '';
    display: block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url("/img/works/table-bg.png") no-repeat;
    background-size: cover;
    border-radius: 50%;
    overflow: hidden;
    opacity: 0.1;
    position: absolute;
    z-index: 1;
  }
  .works-table-leg{
    position: absolute;
    width: .3rem;
    height: 3rem;
    background: linear-gradient(90deg, #555 10%, #000000 30%, #bbd5ee 80%, #555);
    transform-style: preserve-3d;
    border-radius: .15rem .15rem 0 0;
    z-index: 0;
    top: .8rem;
  }
  .works-table-leg:before{
    content: '';
    position: absolute;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: #555;
    transform: rotateX(90deg) translate3d(-.35rem, 0, -.5rem);
    bottom: 0;
    left: 0;
  }
  .works-table-leg:after{
    content: '';
    position: absolute;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: linear-gradient(90deg, #101010, #707e95);
    transform: rotateX(90deg) translate3d(-1.35rem, 0, 1.5rem);
    top: 0;
    left: 0;
  }
  .book{
    transform-style: preserve-3d;
    position: absolute;
    user-select: none;
    cursor: pointer;
    width: 1rem;
    height: 10rem;
    z-index: 1;
  }
  .book-cover,
  .book-back-cover{
    width: 8.8rem;
    height: 10rem;
    flex-direction: column;
    color: #333;
    transform-style: preserve-3d;
  }
  .book-spine,
  .book-back-cover{
    position: absolute;
    top: 0;
    left: 0;
  }
  .book-cover{
    background: linear-gradient(45deg, #888, #ccc);
    text-align: center;
    transform-origin: left;
    transform: rotateY(-90deg);
    transition: transform 0.6s;
  }
  .book-back-cover{
    transform-origin: left;
    transform: rotateY(-90deg) scaleX(-1) translate3d(-8.8rem, 0, -1rem);
    background: linear-gradient(0, #c8c7d7, #c1b8ac);
  }
  .book-cover-inner,
  .book-back-cover-inner{
    background: linear-gradient(45deg, #cccccc, #ffffff);
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .book-cover-inner{
    transform: translateZ(-2px) scaleX(-1);
  }
  .book-back-cover-inner{
    transform-origin: left;
    transform: translate3d(100%, 0, calc(1rem - 2px)) scaleX(-1);
  }
  .book-spine{
    text-align: center;
    font-size: .5rem;
    color: #333;
    line-height: 1;
  }
  .book-spine-b,
  .book-spine-c,
  .book-spine-d{
    width: calc(1rem - 2px);
    background: linear-gradient(90deg, #b9c3dd, #b9c3dd 50%, #c1b8ac 50%, #c1b8ac);
    background-size: 10% 100%;
  }
  .book-spine-a{
    width: 1rem;
    box-shadow: inset 0 0 .2rem #fff;
    height: 10rem;
    background: linear-gradient(0, #b9c3dd, #c1b8ac);
    flex-direction: column;
    transform: scaleX(-1);
  }
  .book-spine-b{
    transform: translate3d(0, 0, 8.8rem);
    box-shadow: inset 0 0 .2rem #555;
    height: 10rem;
  }
  .book-spine-c{
    transform-origin: top;
    transform: rotateX(90deg);
    box-shadow: inset 0 0 .2rem #555;
    height: 8.8rem;
  }
  .book-spine-d{
    transform-origin: top;
    transform:  rotateX(90deg) translate3d(0, 0, -10rem);
    box-shadow: inset 0 0 .2rem #555;
    height: 8.8rem;
  }
  .book-spine-title{
    margin: 0 auto;
  }
  .book-spine-subtitle {
    background: #333;
    color: #fff;
    padding: .1rem;
    margin-top: .3rem;
    font-size: .8em;
  }
</style>
