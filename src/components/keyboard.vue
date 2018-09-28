<template>
  <div class="keyboard">
    <div class="keyboard-row" v-for="(row, index) of keys" :key="index">
      <template v-for="key of row">
        <div class="keyboard-item" :class="'keyboard-'+key.code" :key="key.code" :data-code="key.code">
          <div class="keyboard-content" v-html="key.html"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'keyboard',
  data () {
    return {
      keys: [
        [{html: 'Esc', code: 'Escape'}, {html: 'F1', code: 'F1'}, {html: 'F2', code: 'F2'}, {html: 'F3', code: 'F3'}, {html: 'F4', code: 'F4'},
          {html: 'F5', code: 'F5'}, {html: 'F6', code: 'F6'}, {html: 'F7', code: 'F7'}, {html: 'F8', code: 'F8'}, {html: 'F9', code: 'F9'},
          {html: 'F10', code: 'F10'}, {html: 'F11', code: 'F11'}, {html: 'F12', code: 'F12'}, {html: 'Delete', code: 'Delete'}],
        [{html: '~<br>`', code: 'Backquote'}, {html: '!<br>1', code: 'Digit1'}, {html: '@<br>2', code: 'Digit2'}, {html: '#<br>3', code: 'Digit3'},
          {html: '$<br>4', code: 'Digit4'}, {html: '%<br>5', code: 'Digit5'}, {html: '^<br>6', code: 'Digit6'}, {html: '&<br>7', code: 'Digit7'},
          {html: '*<br>8', code: 'Digit8'}, {html: '(<br>9', code: 'Digit9'}, {html: ')<br>0', code: 'Digit0'}, {html: '—<br>-', code: 'Minus'},
          {html: '+<br>=', code: 'Equal'}, {html: 'Backspace', code: 'Backspace'}],
        [{html: 'Tab', code: 'Tab'}, {html: 'Q', code: 'KeyQ'}, {html: 'W', code: 'KeyW'}, {html: 'E', code: 'KeyE'},
          {html: 'R', code: 'KeyR'}, {html: 'T', code: 'KeyT'}, {html: 'Y', code: 'KeyY'}, {html: 'U', code: 'KeyU'}, {html: 'I', code: 'KeyI'},
          {html: 'O', code: 'KeyO'}, {html: 'P', code: 'KeyP'}, {html: '{<br>[', code: 'BracketLeft'}, {html: '}<br>]', code: 'BracketRight'},
          {html: '|<br>\\', code: 'Backslash'}],
        [{html: 'CapsLock', code: 'CapsLock'}, {html: 'A', code: 'KeyA'}, {html: 'S', code: 'KeyS'}, {html: 'D', code: 'KeyD'},
          {html: 'F', code: 'KeyF'}, {html: 'G', code: 'KeyG'}, {html: 'H', code: 'KeyH'}, {html: 'J', code: 'KeyJ'}, {html: 'K', code: 'KeyK'},
          {html: 'L', code: 'KeyL'}, {html: ':<br>;', code: 'Semicolon'}, {html: '"<br>\'', code: 'Quote'}, {html: 'Enter', code: 'Enter'}],
        [{html: 'Shift', code: 'ShiftLeft'}, {html: 'Z', code: 'KeyZ'}, {html: 'X', code: 'KeyX'}, {html: 'C', code: 'KeyC'},
          {html: 'V', code: 'KeyV'}, {html: 'B', code: 'KeyB'}, {html: 'N', code: 'KeyN'}, {html: 'M', code: 'KeyM'}, {html: '&lt;<br>,', code: 'Comma'},
          {html: '&gt;<br>.', code: 'Period'}, {html: '?<br>/', code: 'Slash'}, {html: 'Shift', code: 'ShiftRight'}],
        [{html: 'Ctrl', code: 'ControlLeft'}, {html: 'Fn', code: 'Fn'}, {html: 'Win', code: 'MetaLeft'}, {html: 'Alt', code: 'AltLeft'},
          {html: 'Space', code: 'Space'}, {html: 'Alt', code: 'AltRight'}, {html: 'PrtSc', code: 'PrintScreen'},
          {html: 'Win', code: 'MetaRight'}, {html: 'Ctrl', code: 'ControlRight'}]
      ]}
  },
  mounted () {
    let items, els, reg, timer
    items = {}
    els = this.$el.querySelectorAll('[data-code]')
    reg = /^F([1-4]|[6-9]|11)$/i
    function itemAnimateEnd () {
      this.classList.remove('active')
    }
    for (let i = 0, len = els.length; i < len; i++) {
      items[els[i].dataset.code] = els[i]
      els[i].addEventListener('animationend', itemAnimateEnd, false)
    }
    els = null
    document.addEventListener('keydown', function (e) {
      if (reg.test(e.code)) {
        e.preventDefault()
      }
      if (items[e.code]) {
        items[e.code].classList.remove('active')
        clearTimeout(timer)
        timer = setTimeout(function () {
          clearTimeout(timer)
          items[e.code].classList.add('active')
        }, 20)
      }
    })
  }
}
</script>

<style>
.keyboard{
  width: 100%;
  margin: .3rem auto;
  padding: .05rem;
  box-sizing: border-box;
  color: #910101;
}
.keyboard-row{
  height: .65rem;
  margin: .05rem 0;
}
.keyboard-item{
  box-sizing: border-box;
  float: left;
  width: .6rem;
  height: .6rem;
  margin: 0 .04rem;
  vertical-align: middle;
  border-radius: 4px;
  line-height: 1.2;
  position: relative;
  font-size: .18rem;
  box-shadow: 0 .01rem .04rem .01rem;
}
.keyboard-Escape{
  margin-right: 0.15rem;
}
.keyboard-Delete{
  width: .76rem;
  margin-left: .15rem;
}
.keyboard-Backspace{
  width: .98rem;
  font-size: .16rem;
}
.keyboard-Tab,
.keyboard-Backslash{
  width: .79rem;
}
.keyboard-CapsLock,
.keyboard-Enter{
  width: 1.13rem;
}
.keyboard-ShiftLeft,
.keyboard-ShiftRight{
  width: 1.47rem;
}
.keyboard-ControlLeft,
.keyboard-ControlRight{
  width: .76rem;
}
.keyboard-Space{
  width: 3.8rem;
}
.keyboard-PrintScreen{
  width: .86rem;
}
.keyboard-Delete,
.keyboard-Backspace,
.keyboard-Tab,
.keyboard-CapsLock,
.keyboard-Enter,
.keyboard-ShiftLeft,
.keyboard-ShiftRight,
.keyboard-row:last-child .keyboard-item{
  line-height: .42rem;
  text-align: center;
}
.keyboard-content{
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 .02rem #afaaa8;
  box-sizing: border-box;
  padding: 0 .2em;
  border-radius: 3px;
  border-bottom: .07rem solid #000;
  overflow: hidden;
}
.keyboard-item.active{
  color: #00bcff;
  animation: bright 1s;
}
.active .keyboard-content{
  height: 98%;
  border-width: .03rem;
}
@keyframes bright {
  0%{
    box-shadow: 0 .01rem .04rem;
  }
  20%{
    border: 1px solid #00bcff;
    box-shadow: 0 .02rem .14rem;
  }
  80%{
    border: 1px solid #00bcff;
    box-shadow: 0 .02rem .14rem;
  }
  100%{
    box-shadow: 0 .01rem .04rem;
  }
}
</style>
