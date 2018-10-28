<template>
    <div class="works2d">
        <header-bar active="works" mode="2d"/>
        <div class="works2d-main">
            <nav class="fixed-nav">
                <a class="fixed-nav-item" v-for="(item, name) of nav" :key="name" :class="{active: active === name}" :href="'#'+name">{{item}}</a>
            </nav>
            <div class="panel" id="webs">
                <h3 class="panel-title" :title="webs.title">{{webs.title}}</h3>
                <ul class="works-list flex-between">
                    <list-item v-for="(item, index) of webs.items" :item="item" :key="index" :index="index" :total="webs.items.length"/>
                </ul>
            </div>
            <div class="panel" id="games">
                <h3 class="panel-title" :title="games.title">{{games.title}}</h3>
                <ul class="works-list flex-between">
                    <li class="works-item" v-if="games.items" v-for="(item, index) of games.items" :key="index">
                        <h4 class="works-item-title">{{item.title}}</h4>
                        <div class="preview-iframe-box">
                            <iframe class="preview-iframe" :src="item.href[0]" frameborder="0"></iframe>
                            <div class="preview-qrcode" @mouseenter="showQrcode($event, item.href[0])"></div>
                        </div>
                    </li>
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
        for(let key in works.nav){
    		works.nav[key] = works[key].title
        }
        works.active = 'webs'
    	return works
    },
    methods: {
    	showQrcode(e, href) {
    		let target = e.currentTarget
    		if(target.hasAttribute('data-qrcode')) return
            try{
    			new QRCode(target, href)
                target.setAttribute('data-qrcode', '')
            } catch (err) {
                console.log(err)
			}
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
        cursor: pointer;
        transition: background .5s;
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
        height: 490px;
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
        font-size: 14px;
    }
    .preview-iframe-box{
        position: relative;
        height: 442px;
        overflow: hidden;
    }
    .preview-iframe{
        height: 100%;
        width: 100%;
    }
    .preview-qrcode{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translateX(100%);
        transition: transform .5s;
        background-color: rgba(0,0,0,.5);
    }
    .preview-iframe-box:hover .preview-qrcode{
        transform: translateX(0);
    }
</style>