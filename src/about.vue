<template>
  <div class="about">
    <navbar ref="navbar" class="flex-column" @click="navbarClick"/>
    <popup ref="popup" @beforeEnter="onPopupShow" @afterLeave="onPopupHide">
      <p class="fs12"><b class="popup-color-1">操作指南：</b></p>
      <p class="fs10">
        鼠标左键左右拖动 <b class="popup-color-1">&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;&nbsp;&nbsp;</b> 旋转<br>
        ctrl键 + 鼠标左键上下左右拖动 <b class="popup-color-1">&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;&nbsp;&nbsp;</b> 移动<br>
        al键 + 鼠标滚轮 <b class="popup-color-1">&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;&nbsp;&nbsp;</b> 缩放<br>
        shift键 <b class="popup-color-1">&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;&nbsp;&nbsp;</b> 禁止3D变换。
      </p>
      <p class="fs10 popup-color-1">页面内容溢出时，滚动条虽是隐藏的，但支持上下拖动，也支持滚轮。</p>
    </popup>
    <transition name="about-in" @afterEnter="onGlassBoxInEnd">
      <div v-show="aboutShow" class="about-glass-box" :style="{transform: glassBoxTransform}">
        <div class="about-glass about-glass-1 flex-column">
          <p class="about-p"><img class="about-face" src="/img/face.png" alt="Rudy" draggable="false"></p>
          <p class="fs18 about-p">我是谁并不重要，重要的是我能做什么。</p>
          <p class="fs18 about-p">It's not important who I am, but what I can do.</p>
        </div>
        <div ref="glassSkill" class="about-glass about-glass-2">
          <h3 class="fs16 about-title">技能篇</h3>
          <div class="fs10 chart-header">为了避免使用精通、熟练、掌握、了解等这类模糊概念容易词，以图表试展示不仅更直观，而且结合各项详细描述的话更能准确评估。知识往深了学，便不敢轻易使用“精通”二字。</div>
          <div class="chart fs9">
            <div class="chart-line" v-for="(skill, index) of skills" :key="index" @click="toggleDetail">
              <div class="chart-hd">{{skill.name}}</div>
              <div class="chart-td">
                <span class="chart-progress" :title="skill.name">
                  <i class="chart-progress-value" :style="'width:' + skill.value + '%;background:'+chartColor[skill.type].color">{{skill.value}}%</i>
                </span>
                <div class="chart-detail fs10" v-html="skill.detail"></div>
              </div>
              <div class="fs18 chart-more"><b class="chart-more-icon">&#187;</b></div>
            </div>
          </div>
          <div class="chart-legendbar fs10">
            <div class="chart-legend" v-for="(item, index) of chartColor" :key="index">
              <i class="chart-legend-color" :style="'background:'+item.color" :title="item.text"></i>
              <span class="chart-legend-text">{{item.text}}</span>
            </div>
          </div>
        </div>
        <div ref="glassCareer" class="about-glass  about-glass-3">
          <h3 class="about-title">工作经历篇</h3>
          <section class="career">
            <article class="career-item" v-for="(item, index) in career" :key="index">
              <h4><span class="career-date">{{item.date}}</span><span class="career-job">{{item.job}}</span></h4>
              <img v-if="item.logo" class="career-logo" :src="item.logo">
              <div v-else class="career-no-logo">?</div>
              <p class="career-company">{{item.company}}</p>
              <p class="career-harvest">{{item.harvest}}</p>
            </article>
          </section>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import utils from '../utils/utils.js'
import popup from '../components/popup'
import navbar from '../components/navbar'
export default {
  name: 'about',
  components: {navbar, popup},
  data () {
    return {
      aboutShow: false,
      glassBoxTransform: 'translate3d(0, 0, -2rem) rotateY(0)',
      chartColor: [],
      skills: [],
      career: []
    }
  },
  mounted () {
    let _this, el, prevTransX, transX, prevTransY, transY, prevRotateY, rotateY, z, allowWheel, scrollPrevent, listen
    _this = this
    el = _this.$el
    prevTransX = transX = prevTransY = transY = prevRotateY = rotateY = 0
    z = -20
    scrollPrevent = ['altKey', 'ctrlKey']
    listen = utils.listener(el, {
      start () {
        if (this.shiftKey) return
        el.classList.remove('about-in')
        allowWheel = true
        trans()
      },
      move (disX, disY) {
        if (this.shiftKey) return
        if (this.ctrlKey) {
          transX = prevTransX + disX
          transY = prevTransY + disY
        } else {
          rotateY = prevRotateY + disX
        }
        trans()
      },
      end () {
        prevTransX = transX
        prevTransY = transY
        prevRotateY = rotateY
      },
      easeOut (spX) {
        if (this.shiftKey || this.ctrlKey) return
        rotateY += this.directionX * spX
        trans()
        prevRotateY = rotateY
      }
    })

    function wheel (e) {
      if (e.altKey && allowWheel) {
        z += 20 * (e.wheelDelta < 0 ? -1 : 1)
        trans()
      }
    }

    function trans () {
      _this.glassBoxTransform = 'translate3d(' + transX + 'px, ' + transY + 'px, ' + (z / 10) + 'rem) rotateY(' + (rotateY / 10) + 'deg)'
    }

    this.$on('popupHide', () => {
      el.addEventListener('mousewheel', wheel)
      listen.on()
    })
    this.$on('popupShow', () => {
      el.addEventListener('mousewheel', wheel)
      listen.off()
    })
    utils.scroll(this.$refs.glassSkill, '', scrollPrevent)
    utils.scroll(this.$refs.glassCareer, '', scrollPrevent)

    utils.ajax({
      url: 'http://localhost:8000?jsonFile=about'
    }).then(res => {
      for (let k in res) {
        if (res.hasOwnProperty(k)) {
          _this[k] = res[k]
        }
      }
      _this.aboutShow = true
    }, err => {
      console.error(err)
    })
  },
  methods: {
    onGlassBoxInEnd () {
      this.$refs.navbar.show = true
      this.$refs.popup.show = true
    },
    onPopupShow () {
      this.$emit('popupShow')
    },
    onPopupHide () {
      this.$emit('popupHide')
    },
    navbarClick (e, name) {
      if (name === 'help') {
        this.$refs.popup.show = !this.$refs.popup.show
      }
    },
    toggleDetail (e) {
      if (e.shiftKey) return
      e.currentTarget.classList.toggle('chart-detail-show')
    }
  }
}
</script>

<style>
  .about{
    height: 10rem;
    position: relative;
    overflow: hidden;
    background: #07080d;
    perspective: 21rem;
    color: #ccd;
    user-select: none;
  }
  .about-glass-box{
    transform-style: preserve-3d;
    transform-origin: left;
    position: relative;
    transform: translate3d(0, 0, -2rem) rotateY(0);
  }
  .about-glass{
    background: rgba(200, 240, 255, 0.2);
    position: absolute;
    width: 100%;
    height: 10rem;
    top: 0;
    left: 0;
    transform-origin: left;
    border: 3px solid #2e6881;
    padding: .5em;
    box-sizing: border-box;
    overflow: hidden;
  }
  .about-glass-1{
    transform: rotateY(0);
  }
  .about-glass-2{
    transform: rotateY(120deg);
  }
  .about-glass-3{
    transform: rotateY(240deg);
  }
  .about-in-enter-active {
    animation: about-in 5s;
  }
  .about-in-leave-active {
    animation: about-in 5s reverse;
  }
  @keyframes about-in {
    0%{
      transform: translate3d(10.5rem, 0, -300rem) rotateY(-360deg);
    }
    80%{
      transform: translate3d(10.5rem, 0, -2rem) rotateY(0);
    }
    100%{
      transform: translate3d(0, 0, -2rem) rotateY(0);
    }
  }
  .about-face{
    width: 5rem;
    border-radius: 50%;
    margin: 0 auto;
    display: block;
  }
  .about-p{
    margin: .3em 0;
  }
  .about-title{
    text-align: center;
    margin: .5em 0;
  }
  .chart-header{
    margin-left: 6em;
    text-indent: 2em;
    padding: .5em 0;
  }
  .chart{
    display: table;
    width: 100%;
  }
  .chart-line{
    display: table-row;
  }
  .chart-line:hover,
  .chart-detail-show{
    background-color: rgba(255,255,255,.1);
  }
  .chart-separation .chart-hd{
    border-bottom: 1px dotted;
  }
  .chart-hd{
    display: table-cell;
    width: 10em;
    text-align: right;
    vertical-align: middle;
    border-right: 1px solid;
    box-sizing: border-box;
    padding: .4em;
  }
  .chart-td{
    display: table-cell;
    vertical-align: middle;
    box-sizing: border-box;
  }
  .chart-progress{
    display: inline-block;
    width: calc(100% - 2em);
    background: rgba(255,255,255,.2);
    position: relative;
    border-radius: 1em;
    line-height: 1;
    overflow: hidden;
    vertical-align: middle;
    margin: 0 1em;
  }
  .chart-progress-value{
    display: inline-block;
    background: rgba(111,174,9,.5);
    border-radius: 1em;
    text-indent: 1em;
  }
  .chart-legendbar{
    padding: .5em 0 6%;
    text-align: center;
  }
  .chart-legend{
    display: inline-block;
    padding: 0 1em;
  }
  .chart-legend-color{
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    margin-right: .6em;
  }
  .chart-legend-color{
    display: inline-block;
    vertical-align: middle;
  }
  .chart-detail{
    margin: .5em 1em;
    line-height: 1.5;
    display: none;
    opacity: 0;
    text-indent: 2em;
  }
  .chart-detail-show .chart-detail{
    display: block;
    animation: fade-in .5s forwards;
  }
  .chart-more{
    display: table-cell;
    width: 2em;
    vertical-align: middle;
  }
  .chart-detail-show .chart-more-icon{
    display: none;
  }
  .career-item{
    margin: 3% 2em;
    background: rgba(77, 144, 165, 0.3);
    padding: .5em 1em;
    border-radius: 4px;
  }
  .career-date{
    padding-right: 2em;
  }
  .career-logo{
    width: 4%;
    float: left;
  }
  .career-company{
    font-weight: bold;
    color: #aab;
  }
  .career-company,
  .career-harvest{
    margin-left: 6%;
  }
  .career-harvest{
    line-height: 1.6;
    text-align: justify;
    font-size: 14px;
  }
  .career-no-logo{
    width: 4%;
    display: block;
    float: left;
    text-align: center;
  }
</style>
