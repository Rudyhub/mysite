<template>
    <div class="command fs9">
      <div class="command-answer">
        Hi~！欢迎进入Rudy的个人平台，进入其他页面须输入指令。输入“?” 或 “帮助”，然后Enter，可查看所有指令。<br>
      </div>
      <template v-for="(line, i) of lines">
        <div v-if="line.ask" class="command-ask" :key="'ask'+i">
          <span class="command-ask-name">[You ~]:</span>
          {{line.ask}}
        </div>
        <div class="command-answer" :key="'answer'+i" v-html="line.answer"></div>
      </template>
      <div class="command-ask">
        <span class="command-ask-name">[You ~]:</span>
        <input class="command-input" type="text" v-model="ask" @keydown="onKeydown" :autofocus="true" spellcheck="false" title="输入指令">
      </div>
    </div>
</template>

<script>
import utils from '../../utils/utils.js'
import store from '../../utils/store.js'
import music from '../../utils/music.js'
export default {
  name: 'command',
  data () {
    let data = {
      AI: [],
      ask: '',
      lines: [],
      historyIndex: 0,
      aiKeys: Object.freeze({
        help: /^(帮助|help|-h|-?[?？]|查看指令)$/,
        clear: /^(cls|clear|清除|清屏)$/,
        song: /^听\s+/,
        songPause: /^((-m|music)\s+(off|pause|puase)|暂停音乐|安静|嘘|静音)\s*$/,
        songPlay: /^((-m|music)\s+(on|play)|播放(音乐|歌曲))\s*$/,
        songStop: /^((-m|music)\s+stop|停止(播放|音乐))\s*$/,
        songLoop: /^((-m|music)\s+loop|单曲循环)\s*$/,
        songNum: /^\d+$/,
        songList: /^((-m|music)\s+list|查看歌单|歌单|歌曲列表)\s*$/,
        songName: /^((-m|music)\s+name|(查看)?歌名)\s*$/,
        songNext: /^((-m|music)\s+next|下一首)\s*$/,
        songPrev: /^((-m|music)\s+prev|上一首)\s*$/
      })
    }
    utils.ajax({
      url: store.dataApi+'?name=ai'
    }).then(res => {
      res.forEach((item, i) => {
        let ask, g
        ask = item.ask.replace(/(?:^\/)|(?:\/([ig]*)$)/g, ($0, $1) => {
          if ($1) {
            g = $1
          }
          return ''
        })
        item.ask = new RegExp(ask, g ? g + '' : '')
        data.AI[i] = item
      })
      if (/^#info$/.test(window.location.hash) && typeof res === 'object'){
        this.lines.push({
          ask: '个人信息',
          answer: res[0].answer.join('<br>')
        })
      }
    }, err => {
      console.log(err)
    })
    return data
  },
  mounted () {
    let _this = this
    utils.scroll(_this.$el)
    music.on('error', err => {
      if (err.playError === 1) {
        _this.lines.push({
          answer: '音乐自动播放失败，可输入“播放音乐”。'
        })
      }
    })
    if (!window.Rsong.el.src || window.Rsong.el.paused) {
      music.search()
    }
  },
  methods: {
    onKeydown (e) {
      let len
      switch (e.code) {
        case 'Enter':
          this.respone(e.currentTarget.value)
          break
        case 'ArrowUp':
          len = this.lines.length
          if (len - this.historyIndex > 0) {
            this.historyIndex++
            this.ask = this.lines[len - this.historyIndex].ask
          }
          break
        case 'ArrowDown':
          len = this.lines.length
          if (this.historyIndex > 1) {
            this.historyIndex--
            this.ask = this.lines[len - this.historyIndex].ask
          }
          break
      }
    },
    autoLine () {
      let name = music.getName()
      this.lines.push({
        ask: '听 ' + name,
        answer: '正在播放：' + name
      })
      this.updateLine()
    },
    pushLine (html) {
      let _this = this
      _this.historyIndex = 0
      _this.lines.push({
        ask: _this.ask,
        answer: html
      })
      this.updateLine()
    },
    updateLine () {
      this.ask = ''
      window.requestAnimationFrame(() => (this.$el.scrollTop = this.$el.scrollHeight - this.$el.offsetHeight))
    },
    help (nav) {
      let html = '<div class="command-answer-title">访问页面：</div><div class="command-answer-detail fs8">'
      for (let k in nav) {
        if (k === 'index') continue
        html += '<span class="command-fc0">访问' + nav[k] + '</span>：可输入的指令有“' + nav[k] + '”、“' + k + '”<br>'
      }
      html += `</div>
      <div class="command-answer-title">听音乐：</div>
      <div class="command-answer-detail fs8">
        <span class="command-fc0">听歌搜歌</span>：可输入“听 + 空格 + 关键词（歌曲或歌星）”，如：听 蓝莲花，又如：听 许巍<br/>
        <span class="command-fc0">暂停音乐</span>：可输入指令有“-m off”、“music off”、“暂停音乐”、“安静”、“嘘”、“静音”<br/>
        <span class="command-fc0">播放音乐</span>：可输入指令有“-m on”、“music on”、“播放音乐”、“播放歌曲”<br/>
        <span class="command-fc0">停止音乐</span>：可输入指令有“-m stop”、“music stop”、“停止音乐”、“停止播放”<br/>
        <span class="command-fc0">单曲循环</span>：可输入指令有“-m loop”、“music loop”、“单曲循环”，注：关闭单曲循环同用<br/>
        <span class="command-fc0">查看歌单</span>：可输入指令有“-m list”、“music list”、“歌单”、“歌曲列表”，注：列出的只是上一次的搜索结果<br/>
        <span class="command-fc0">查看歌名</span>：可输入指令有“-m name”、“music name”、“歌名”、“查看歌名”<br/>
        <span class="command-fc0">下 一 首</span>：可输入指令有“-m next”、“music next”、“下一首”<br/>
        <span class="command-fc0">上 一 首</span>：可输入指令有“-m prev”、“music prev”、“上一首”
      </div>
      <div class="command-answer-title">其他指令：</div>
      <div class="command-answer-detail fs8">
        <span class="command-fc0">查看指令</span>：可输入指令有“？”、“-h”、“help”、“帮助”、“查看指令”<br/>
        <span class="command-fc0">清空屏幕</span>：可输入指令有“cls”、“clear”、“清屏”、“清除”
      </div>
      <div class="command-answer-title">问答系统：</div>
      <div class="command-answer-detail fs8">
        以上指令之外的事情，都交给本问答系统吧。当前系统只是个非常小的静态数据，纯属娱乐同时装一下X，能回复的问题不多，而且态度基本很傲娇，很皮。
        以后，砸家想开发为一个具有人工智能的问答学习系统，不仅会回答码农的问题，还会回答九年义务教育的课程问题甚至各行业的专业问题。期待吧~
      </div>`
      return html
    },
    respone (val) {
      let _this, len, i
      _this = this
      val = val.trim().toLowerCase()
      i = 0
      if (!val) return
      for (let page in store.nav) {
        if (page === val || store.nav[page] === val) {
          if (val === 'index') {
            _this.pushLine('这就是首页了噻')
          } else {
            window.location = window.location.protocol + '//' + window.location.host + '/' + page +'.html'
          }
          return
        }
      }
      for (let aiKey in _this.aiKeys) {
        if (_this.aiKeys[aiKey].test(val)) {
          switch (aiKey) {
            case 'help':
              _this.pushLine(_this.help(store.nav))
              return
            case 'clear':
              _this.lines.splice(0, _this.lines.length)
              _this.ask = ''
              return
            case 'song':
              _this.pushLine('正在搜...')
              music.search(val.replace(_this.aiKeys[aiKey], ''), () => {
                _this.pushLine(_this.musicList())
              })
              return
            case 'songPause':
              music.pause()
              _this.pushLine('已暂停音乐')
              return
            case 'songPlay':
              if (music.paused()) {
                music.play()
                _this.pushLine('播放：' + music.getName())
              } else {
                _this.pushLine('歌曲：“' + music.getName() + '”已在播放')
              }
              return
            case 'songStop':
              music.stop()
              _this.pushLine('已停止音乐')
              return
            case 'songLoop':
              _this.pushLine('已' + (music.toggleLoop() ? '开启' : '关闭') + '循环')
              return
            case 'songNum':
              music.search(parseInt(val))
              return
            case 'songList':
              _this.pushLine(_this.musicList())
              return
            case 'songName':
              _this.autoLine()
              return
            case 'songNext':
              music.next(() => {
                _this.pushLine('歌曲：“' + music.getName() + '”已在播放')
              })
              return
            case 'songPrev':
              music.prev(() => {
                _this.pushLine('歌曲：“' + music.getName() + '”已在播放')
              })
              return
          }
          break
        }
      }
      for (len = _this.AI.length; i < len; i++) {
        if (_this.AI[i].ask.test(val)) {
          let sysLen = _this.AI[i].answer.length
          let index = Math.round(Math.random() * sysLen - 0.5)
          _this.pushLine(_this.AI[i].answer[index])
          return
        }
      }
      _this.pushLine('你说啥？书读得少，听不懂。')
    },
    musicList () {
      let html, list
      list = music.getList()
      if (list && list.length) {
        html = '<dl class="command-dl">'
        if (list.length > 1) {
          html += '<dd class="command-answer-title command-dd">搜到歌曲：（输入对应序号即听）</dd>'
          list.forEach((file, index) => {
            html += '<dd class="command-dd">' + index + '：' + file.FileName + '</dd>'
          })
        }
        html += '</dl>'
      } else {
        html = '空列表'
      }
      return html
    }
  }
}
</script>

<style>
  .command{
    height: 100%;
    margin: 0 auto;
    padding: 1em;
    overflow: hidden;
    box-sizing: border-box;
    line-height: 1.4;
    word-spacing: .2em;
    letter-spacing: .06em;
    text-align: justify;
  }
  @media (min-width: 1600px) {
    .command{
      font-size: 14px;
    }
  }
  .command-ask{
    white-space: nowrap;
    overflow: hidden;
    line-height: 1;
  }
  .command-answer{
    padding: 0.3em 0 0.3em 2em;
    color: #b26821;
  }
  .command-ask-name{
    display: block;
    float: left;
    box-sizing: border-box;
    width: 4em;
    overflow: hidden;
  }
  .command-input{
    float: left;
    -webkit-appearance: none;
    border: none;
    background: transparent;
    color: inherit;
    font-size: inherit;
    outline: none;
    box-sizing: border-box;
    padding: 0;
    width: calc(100% - 4em);
  }
  .command-dl,
  .command-dd{
    margin: 0;
  }
  .command-fc0{
    border-bottom: 1px dashed;
  }
  .command-answer-title{
    color: #b9231f;
    margin-top: .5em;
    font-weight: bolder;
  }
  .command-p{
    margin: .5em 0;
    text-indent: 2em;
  }
</style>
