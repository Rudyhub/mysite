<template>
    <div class="works2d" @scroll="onscroll">
        <header-bar active="works" mode="2d"/>
        <div class="works2d-main">
            <nav class="fixed-nav" :class="{'nav-fixed-top': navFixed}">
                <a class="fixed-nav-item" v-for="(item, name) of nav" :key="name" :class="{active: active === name}" :href="'#'+name">{{item}}</a>
            </nav>
            <div class="panel" id="webs">
                <h3 class="panel-title" :title="webs.title">{{webs.title}}</h3>
                <ul class="works-list flex-between">
                    <list-item v-for="(item, index) of webs.items" :item="item" :key="index" :index="index" :total="webs.items.length" :href="webs.href"/>
                </ul>
            </div>
            <div class="panel" id="games">
                <h3 class="panel-title" :title="games.title">{{games.title}}</h3>
                <ul class="works-list flex-round">
                    <li class="works-item" v-if="games.items" v-for="(item, index) of games.items" :key="index">
                        <h4 class="works-item-title">{{item.title}} &nbsp; ({{index+1}} / {{games.items.length}})</h4>
                        <div class="preview-box">
                            <template v-if="item.href && item.href[0]">
                                <video ref="video" class="preview-img" @mouseenter="play" v-if="item.video" :data-src="'https://isrudy.com/media/games/'+item.video" loop></video>
                                <div ref="qrcode" class="preview-qrcode" :data-href="item.href[0]">
                                    <h5>微信扫一扫体验</h5>
                                </div>
                            </template>
                            <div v-else v-html="item.desc" class="preview-none"></div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="panel" id="app">
                <h3 class="panel-title" :title="app.title">{{app.title}}</h3>
                <ul class="works-list flex-between">
                    <list-item v-for="(item, index) of app.items" :item="item" :key="index" :index="index" :total="app.items.length" :href="app.href"/>
                </ul>
            </div>
            <div class="panel" id="effects">
                <h3 class="panel-title" :title="effects.title">
                    {{effects.title}}
                    <a class="access-all" :href="effects.href" target="_blank">查看全部项目</a>
                </h3>
                <ul class="works-list flex-between">
                    <list-item v-for="(item, index) of effects.items" :item="item" :key="index" :index="index" :total="effects.items.length" :href="effects.href"/>
                </ul>
            </div>
            <div class="panel" id="homework">
                <h3 class="panel-title" :title="homework.title">
                    {{homework.title}}
                    <a class="access-all" :href="homework.href" target="_blank">查看全部项目</a>
                </h3>
                <ul class="works-list flex-between">
                    <list-item v-for="(item, index) of homework.items" :item="item" :key="index" :index="index" :total="homework.items.length" :href="homework.href"/>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import store from '../utils/store.js'
import utils from '../utils/utils.js'
import headerBar from './components/headerBar'
import listItem from './components/linkItem'
export default {
    name: 'works2d',
	components: {headerBar, listItem},
    data(){
    	let _this, works
        _this = this
        works = sessionStorage.getItem('worksData')
        if(!works){
    		works = {
    			webs: {},
                games: {},
                app: {},
                effects: {},
                homework: {}
            }
			utils.ajax({
				url: store.dataApi + '?name=works'
			}).then(res => {
				for(let k in res){
					for(let key in res[k]){
						_this.$set(_this[k], key, res[k][key])
                    }
                }
                _this.navData(_this)
				sessionStorage.setItem('worksData', JSON.stringify(res))
			}, err => {
				console.log(err)
			})
        }else{
    		works = JSON.parse(works)
        }
		works.nav = {
			webs: '',
			games: '',
			app: '',
			effects: '',
			homework: ''
        }
        _this.navData(works)
        works.active = 'webs'
        works.navFixed = false
    	return works
    },
    mounted(){
    	let videos, len, qlen, i, qrcode
        videos = this.$refs.video
        qrcode = this.$refs.qrcode
        len = videos.length
        qlen = qrcode.length;
        this.gameLen = len
    	this.panel = this.$el.querySelectorAll('.panel')
        this.panelLen = this.panel.length
        this.$el.scrollTop = 0
        this.$watch('active', val => {
        	if(val === 'games'){
        		for(i=0; i<len; i++){
                    let attr = videos[i].getAttribute('data-src')
                    if(videos[i].src != attr) videos[i].src = attr
                }
            }
        })
        for(i = 0; i<qlen; i++){
            new QRCode(qrcode[i], qrcode[i].getAttribute('data-href'))
        }
    },
    methods: {
        onscroll(){
        	let scrollTop, i
            scrollTop = this.$el.scrollTop
            this.navFixed = scrollTop > 100
            for(i=0; i<this.panelLen; i++){
                if(scrollTop > this.panel[i].offsetTop){
                	this.active = this.panel[i].id
                }
            }
        },
    	navData(works){
			for(let key in works.nav){
				works.nav[key] = works[key].title
			}
        },
        play(e){
            let target = e.currentTarget
            if(!target.paused) return;
            setTimeout(() => {
                target.play()
            }, 500)
        }
    }
}
</script>

<style>
    .works2d{
        background-color: #eee;
        height: 100%;
        overflow: auto;
    }
    .header{
        background-color: #fff;
    }
    .works2d-main{
        position: relative;
    }
    .fixed-nav{
        overflow: hidden;
    }
    .nav-fixed-top{
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 999;
    }
    .fixed-nav-item:visited,
    .fixed-nav-item:link,
    .fixed-nav-item{
        display: block;
        float: left;
        width: 20%;
        text-align: center;
        padding: .5em;
        box-sizing: border-box;
        background-color: #4fc08d;
        color: #fff;
        font-size: 14px;
    }
    .fixed-nav-item.active{
        background-color: #3da174;
    }
    .panel{
        margin: 1%;
        box-sizing: border-box;
        background-color: #fff;
    }
    .panel-title{
        margin: 0;
        color: #666;
        font-size: 16px;
        padding: .5em;
        box-sizing: border-box;
        transition: background-color .5s;
        position: relative;
        overflow: hidden;
    }
    .panel-title:after{
        content: '';
        transition: transform .5s;
        background-color: #36a461;
        transform: scaleY(0);
        transform-origin: top;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0.3;
    }
    .panel:hover .panel-title:after{
        transform: scaleY(1);
    }
    .works-list{
        list-style: none;
        margin: 0;
        padding: 0;
        flex-wrap: wrap;
    }
    .link-list-li{
        width: 480px;
        margin: 1.5em .5em;
        border: 1px solid #ddd;
        box-sizing: border-box;
        border-radius: 4px;
    }
    .works-item{
        width: 312px;
        padding: 5px;
        overflow: hidden;
        border: 1px solid #ccc;
        box-sizing: border-box;
        border-radius: 6px;
        margin: 10px;
        box-shadow: 0 0 5px #ccc;
    }
    .works-item-title{
        margin: 0;
        background-color: #333;
        color: #fff;
        padding: .5em;
        font-weight: normal;
        font-size: 16px;
    }
    .preview-box{
        position: relative;
        height: 556px;
        overflow: hidden;
    }
    .preview-img{
        max-width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
    }
    .preview-none{
        width: 100%;
        height: 100%;
        text-indent: 2em;
        font-size: 14px;
        color: #555;
        box-sizing: border-box;
        padding: 1em .5em;
        line-height: 1.6;
        overflow: auto;
        text-align: justify;
    }
    .preview-qrcode{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translateX(100%);
        transition: transform .6s;
        background-color: rgba(0,0,0,.5);
        text-align: center;
        z-index: 1;
    }
    .works-item-title:hover ~ .preview-box .preview-qrcode{
        transform: translateX(0);
    }
    .preview-qrcode h5{
        color: #fff;
        font-size: 16px;
        background-color: rgba(0, 0, 0, .6);
        padding: .5em;
    }
    .preview-qrcode img{
        display: block;
        width: 80%;
        margin: 1em auto;
        border: 5px solid #fff;
        box-sizing: border-box;
    }
    .access-all{
        font-weight: normal;
        position: absolute;
        right: 1em;
        font-size: 14px;
        z-index: 2;
    }
</style>