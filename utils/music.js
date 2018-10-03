export default {
  rootPath: 'https://670752970.com/api/music.php',
  _lrc: {
    time: [],
    text: [],
    len: 0,
    lrc: ''
  },
  _handler: {
    error: [],
    buffer: [],
    timeupdate: [],
    lrcupdate: [],
    srcupdate: []
  },
  on (evt, fn) {
    let _this, handler
    _this = this
    handler = _this._handler[evt]
    if (handler && !handler.includes(fn)) {
      handler.push(fn)
    }
  },
  off (evt, fn) {
    let _this, handler, len, i
    _this = this
    handler = _this._handler[evt]
    if (handler) {
      len = handler.length
      i = 0
      for (; i < len; i++) {
        if (fn === handler[i]) {
          handler.splice(i, 1)
          break
        }
      }
    }
  },
  fire (evt, args) {
    let _this, handler
    _this = this
    handler = _this._handler[evt]
    handler.forEach(fn => {
      fn.apply(_this, args)
    })
  },
  songIndex: 0,
  init () {
    let _this, v, start
    _this = this
    v = document.createElement('video')
    _this.songIndex = 0
    window.Rsong = {
      el: v,
      song: null,
      list: []
    }
    v.addEventListener('canplay', () => {
      v.play().catch(err => {
        err.playError = 1
        _this.fire('error', [err])
      })
    })
    v.addEventListener('play', () => {
      start = 0
    })
    v.addEventListener('ended', () => {
      if (v.loop === false) _this.next()
    })
    start = 0
    v.addEventListener('timeupdate', () => {
      try {
        _this.fire('buffer', [(v.buffered.end(v.buffered.length - 1) / v.duration) * 100])
      } catch (e) {}
      for (let i = start; i < _this._lrc.len; i++) {
        if (Math.abs(_this._lrc.time[i] - v.currentTime) <= 1) {
          if (start !== i) {
            start = i
            _this.fire('lrcupdate', [_this._lrc.text[i]])
          }
          break
        }
      }
      _this.fire('timeupdate', [v.currentTime, v.duration])
    })
  },
  search (kw, fn) {
    let _this, songHash, songName, firstTime, list
    _this = this
    list = window.Rsong.list
    if (/^\d+$/.test(kw)) {
      if (list && list[kw]) {
        _this.url(list[kw].FileHash, fn)
      } else if (window.Rsong.song) {
        _this.replay()
        if (fn) fn()
      }
    } else {
      songHash = window.localStorage.getItem('songHash')
      songName = window.localStorage.getItem('songName')
      firstTime = !kw && !songHash
      if (kw || firstTime) {
        kw = firstTime ? '许巍 - 空谷幽兰' : kw
        _this.find(kw, () => {
          list = window.Rsong.list
          if (list && list[0]) {
            _this.songIndex = 0
            _this.url(list[0].FileHash)
          }
          if (fn) fn(kw)
        })
      } else {
        _this.url(songHash)
        if (fn) fn(songName)
      }
    }
  },
  find (songName, fn) {
    let xhr = new XMLHttpRequest()
    xhr.open('get', this.rootPath + '?song=' + songName, true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          let res = typeof xhr.response === 'object' ? xhr.response : JSON.parse(xhr.response)
          window.Rsong.list = res.data.lists
          if (fn) fn()
        } catch (e) {}
      }
    }
    xhr.send()
  },
  url (hash, fn) {
    let _this, xhr, Rsong
    _this = this
    Rsong = window.Rsong
    xhr = new XMLHttpRequest()
    xhr.open('get', _this.rootPath + '?hash=' + hash, true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          let res = typeof xhr.response === 'object' ? xhr.response : JSON.parse(xhr.response)
          Rsong.el.src = res.data.play_url
          Rsong.song = res.data
          _this.lyric()
          window.localStorage.setItem('songHash', res.data.hash)
          window.localStorage.setItem('songName', res.data.audio_name)
          _this.fire('srcupdate', [res.data])
          if (fn) fn()
        } catch (e) {}
      }
    }
    xhr.send()
  },
  lyric () {
    let _this, reg, match, lrc
    _this = this
    reg = /\[([^\]]*?)]([^[]*?)(?=[[\n\u2028\u2029])/g
    lrc = window.Rsong.song.lyrics
    _this._lrc.time = []
    _this._lrc.text = []
    match = reg.exec(lrc)
    while (match) {
      let s = match[1].split(/[:：]+/)
      if (s.length > 2) {
        s = parseInt(s[0]) * 3600 + parseInt(s[1]) * 60 + parseFloat(s[2])
      } else {
        s = parseInt(s[0]) * 60 + parseFloat(s[1])
      }
      _this._lrc.time.push(s)
      _this._lrc.text.push(match[2])
      match = reg.exec(lrc)
    }
    _this._lrc.len = _this._lrc.time.length
  },
  play () {
    window.Rsong.el.play()
  },
  pause () {
    window.Rsong.el.pause()
  },
  paused () {
    return window.Rsong.el.paused
  },
  stop () {
    this.replay()
    setTimeout(() => {
      this.pause()
    }, 50)
  },
  replay () {
    window.Rsong.el.currentTime = 0
  },
  toggleLoop () {
    window.Rsong.el.loop = !window.Rsong.el.loop
    return window.Rsong.el.loop
  },
  getName () {
    return window.Rsong.song ? window.Rsong.song.audio_name : ''
  },
  getList () {
    return window.Rsong.list
  },
  next (fn) {
    let list, len
    list = window.Rsong.list
    len = list.length
    if (len) {
      this.songIndex = this.songIndex < len - 1 ? this.songIndex + 1 : 0
      this.url(list[this.songIndex].FileHash)
    } else {
      if (fn) fn()
    }
  },
  prev (fn) {
    let list, len
    list = window.Rsong.list
    len = list.length
    if (len) {
      this.songIndex = this.songIndex > 0 ? this.songIndex - 1 : list.length - 1
      this.url(list[this.songIndex].FileHash)
    } else {
      if (fn) fn()
    }
  }
}
