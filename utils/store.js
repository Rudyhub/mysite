export default {
  nav: Object.freeze({
    index: '首页',
    about: '个人',
    works: '作品',
    blog: '博客',
    album: '相册'
  }),
  dataApi: (/(670752970|isrudy)\.com/.test(window.location.hostname) ? '' : 'https://670752970.com') + '/api/data.php'
}
