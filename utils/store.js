export default {
  nav: Object.freeze({
    index: '首页',
    about: '个人',
    works: '作品',
    blog: '博客',
    album: '相册'
  }),
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
