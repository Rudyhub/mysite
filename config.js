let config = {
	lang: 'zh-cn',
	global: {
		title: '个人网站',
		meta: `
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <meta name="keyworks" content="最酷网站,最骚网站,前端高境界,web 3D,css3的强大,transform, animation, @keyframes,Rudy">
            <meta name="description" content="个人网站，最酷的3D体验，这是真正的前端，多数人估计都不知道css3+js如此强大。">`,
		link: `
            <link rel="icon" type="image/x-icon" href="/favicon.ico">
            <link rel="stylesheet" href="/css/global.css">`,
		script: `<script src="/js/rem.js"></script>`,
		style: '',
		body: '<div id="app"></div>'
	},
	pages: [{
		name: 'index',
		title: '首页',
	}, {
		name: 'page1',
		title: '第一个页面'
	}, {
		name: 'page2',
		title: '第二个页面',
		children: [{
			name: 'detail',
			title: '作品观赏',
			component: 'childPage.vue'
		}]
	},
	{
		name: 'page3',
		title: '第二个页面',
		link: '<link rel="stylesheet" href="/plugins/example.css">',
		script:'<script src="/plugins/jquery.js"></script>'
	}]
};

module.exports = config;