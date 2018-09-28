export default {
  listener (el, opt) {
    let isTouch, events, startX, endX, prevX, speedX, startY, endY, prevY, speedY, capture, len, i, timer

    if (!el || !opt || typeof opt !== 'object') return
    opt.preventKeys = opt.preventKeys || []
    opt.reduction = opt.reduction || 0.9
    isTouch = 'ontouchstart' in document
    events = ['mousedown', 'mousemove', 'mouseup']
    startX = endX = prevX = speedX = 0
    startY = endY = prevY = speedY = 0
    capture = {passive: false}
    len = opt.preventKeys.length

    if (isTouch) {
      events[0] = 'touchstart'
      events[1] = 'touchmove'
      events[2] = 'touchend'
    }

    function startFn (e) {
      setKeys(e)
      cancelAnimationFrame(timer)
      for (i = 0; i < len; i++) {
        if (e[opt.preventKeys[i]]) return false
      }
      e.preventDefault()
      let evt = isTouch ? e.targetTouches[0] : e
      startX = evt.clientX
      startY = evt.clientY
      prevX = startX
      prevY = startY
      speedX = speedY = 0
      if (opt.start) opt.start(0, 0, startX, startY)
      el.addEventListener(events[1], moveFn, capture)
      document.addEventListener(events[2], endFn)
    }

    function moveFn (e) {
      setKeys(e)
      e.preventDefault()
      let evt = isTouch ? e.targetTouches[0] : e
      endX = evt.clientX
      endY = evt.clientY
      speedX = endX - prevX
      speedY = endY - prevY
      if (opt.move) opt.move(endX - startX, endY - startY, endX, endY)
      prevX = endX
    }

    function endFn (e) {
      setKeys(e)
      el.removeEventListener(events[1], moveFn, capture)
      document.removeEventListener(events[2], endFn)
      opt.directionX = endX - startX > 0 ? 1 : -1
      opt.directionY = endY - startY > 0 ? 1 : -1
      if (opt.end) opt.end(endX - startX, endY - startY, endX, endY, speedX, speedY)
      easeOut(speedX, speedY)
    }

    function easeOut (spx, spy) {
      spx = Math.abs(spx)
      spy = Math.abs(spy)
      function play () {
        spx *= opt.reduction
        spy *= opt.reduction
        if (opt.easeOut) opt.easeOut(spx, spy)
        cancelAnimationFrame(timer)
        timer = requestAnimationFrame(play)
        if (spx <= 0.01 && spy <= 0.01) {
          cancelAnimationFrame(timer)
          if (opt.easeEnd) opt.easeEnd(spx, spy)
        }
      }
      cancelAnimationFrame(timer)
      if (spx > 1 || spy > 1) {
        timer = requestAnimationFrame(play)
      }
    }

    function setKeys (e) {
      opt.ctrlKey = e.ctrlKey
      opt.shiftKey = e.shiftKey
      opt.altKey = e.altKey
    }

    opt.on = function on () {
      el.addEventListener(events[0], startFn, capture)
    }

    opt.off = function off () {
      el.removeEventListener(events[0], startFn, capture)
    }
    return opt
  },
  scroll (el, direction, preventKeys = []) {
    let isTouch, events, start, end, startTop, prev, speed, prevent, scroll, client, len, i, timer

    isTouch = 'ontouchstart' in document
    events = ['mousedown', 'mousemove', 'mouseup']
    start = 0
    end = 0
    startTop = 0
    prev = 0
    speed = 0
    prevent = {passive: false}
    scroll = 'scrollTop'
    client = 'clientY'
    len = preventKeys.length

    if (isTouch) {
      events[0] = 'touchstart'
      events[1] = 'touchmove'
      events[2] = 'touchend'
    }

    if (direction && direction.toLowerCase() === 'x') {
      scroll = 'scrollLeft'
      client = 'clientX'
    }

    function startFn (e) {
      e.stopPropagation()
      for (i = 0; i < len; i++) {
        if (e[preventKeys[i]]) return false
      }
      start = isTouch ? e.targetTouches[0][client] : e[client]
      end = start
      startTop = el[scroll]
      prev = start
      el.addEventListener(events[1], moveFn, prevent)
      document.addEventListener(events[2], endFn)
    }

    function moveFn (e) {
      e.stopPropagation()
      if (!e.ctrlKey) {
        e.preventDefault()
      }
      end = isTouch ? e.targetTouches[0][client] : e[client]
      speed = end - prev
      prev = end
      el[scroll] = startTop + (start - end)
    }

    function endFn (e) {
      e.stopPropagation()
      el.removeEventListener(events[1], moveFn, prevent)
      document.removeEventListener(events[2], endFn)
      easeOut(Math.abs(speed), end - start, end - start < 0 ? 1 : -1)
    }

    function wheel (e) {
      e.stopPropagation()
      for (i = 0; i < len; i++) {
        if (e[preventKeys[i]]) {
          return false
        }
      }
      let dir = e.wheelDelta < 0 ? 1 : -1
      el[scroll] += dir * 10
      easeOut(10, 6, dir)
    }

    function easeOut (d, dis, dir) {
      function play () {
        d *= 0.9
        cancelAnimationFrame(timer)
        timer = requestAnimationFrame(play)
        if (d < 1) cancelAnimationFrame(timer)
        el[scroll] += d * dir
      }
      if (Math.abs(dis) > 5) {
        cancelAnimationFrame(timer)
        timer = requestAnimationFrame(play)
      }
    }

    function bind () {
      el.addEventListener(events[0], startFn)
      if (!isTouch) el.addEventListener('mousewheel', wheel)
    }

    function unbind () {
      el.removeEventListener(events[0], startFn)
      el.addEventListener('mousewheel', wheel)
    }

    bind()

    return {
      on: bind,
      off: unbind
    }
  },
  favicon (url) {
    let sites = {
      'favicon.ico': /rudyhub\.github\.io|^([^h][^t][^t][^p])/i,
      'icons/wwp.ico': /(^https?:\/\/|(www|news|assets|paper|sp|image)\.)wenweipo\.com/i,
      'icons/wii-c.ico': /wii-c\.com/i
    }
    for (let k in sites) {
      if (sites[k].test(url)) return '/static/' + k
    }
    url = url.split(/\/+/)
    return url[0] + '//' + url[1] + '/favicon.ico'
  },
  ajax (opt) {
    let xhr, o, promise, params
    o = {
      url: '',
      type: 'get',
      dataType: 'json',
      data: {},
      timeout: 30000,
      contentType: 'application/x-www-form-urlencoded',
      sync: true
    }
    if (typeof opt === 'object') {
      for (let k in opt) {
        if (opt.hasOwnProperty(k) && o.hasOwnProperty(k)) {
          o[k] = opt[k]
        }
      }
    }
    opt = null
    if (o.data instanceof FormData) {
      o.contentType = 'multipart/form-data'
      o.type = 'post'
      params = o.data
    } else {
      params = ''
      for (let k in o.data) {
        if (o.data.hasOwnProperty(k)) {
          params += '&' + k + '=' + o.data[k]
        }
      }
      if (params && o.type.toLowerCase() === 'get') {
        o.url += /\?/.test(o.url) ? params : '?' + params
        params = null
      }
    }
    promise = new Promise((resolve, reject) => {
      xhr = new XMLHttpRequest()
      xhr.timeout = o.timeout
      xhr.open(o.type, o.url, o.sync)
      xhr.setRequestHeader('Content-type', o.contentType)
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              resolve(JSON.parse(xhr.response))
            } catch (e) {
              e.message = '响应的数据格式错误导致无法转为json，具体错误：' + e.message
              reject(e)
            }
          } else {
            reject(new Error('fail, readyState:' + xhr.readyState + ', status:' + xhr.status))
          }
        }
      }
      xhr.send(params)
    })
    return promise
  }
}
