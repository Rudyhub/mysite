window.CONF = {
  viewport: function () {
    var scale, html, w, h, fs
    scale = .6
    html = document.documentElement
    w = window.innerWidth
    h = window.innerHeight
    if (h / w < scale) {
      fs = h * .625 + '%'
    } else {
      fs = w * scale * .625 + '%'
    }
    html.style.fontSize = fs
  }
};
CONF.viewport();
