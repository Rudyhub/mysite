let config = {
	lang: 'zh-cn',
	global: {
		title: '个人网站',
		meta: `
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <meta name="keyworks" content="最酷网站,最骚网站,前端高境界,web 3D,css3的强大,transform, animation, @keyframes,令狐长老,Rudy">
            <meta name="description" content="令狐长老（Rudy）的个人网站，最酷的3D体验，这是真正的前端，多数人估计都不知道css3+js如此强大。">`,
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
		name: 'about',
		title: '关于',
	}, {
		name: 'works',
		title: '作品',
		children: [{
			name: 'detail',
			title: '作品观赏',
			component: 'worksDetail.vue'
		}]
	}, {
		name: 'blog',
		title: '博客',
		link: '<link rel="stylesheet" href="/plugins/highlight.css">',
		script:
			`<script src="/plugins/marked.min.js"></script>
            <script src="/plugins/highlight.js"></script>`
	}, {
		name: 'album',
		title: '相册图册'
	}, {
		name: 'home2d',
		title: '普通模式-主页',
		component: 'home2d.vue'
	}, {
		name: 'about2d',
		title: '普通模式-个人介绍',
		component: 'about2d.vue'
	}, {
		name: 'works2d',
		title: '普通模式-作品集合',
		component: 'works2d.vue'
	}]
};

module.exports = config;