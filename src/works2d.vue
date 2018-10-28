<template>
    <div class="works2d">
        <header-bar active="works" mode="2d"/>
        <div class="works2d-main">
            <nav class="fixed-nav">
                <a class="fixed-nav-item" v-for="(item, name) of works" :key="name" :class="{active: active === name}" :href="'#'+name">{{item.title}}</a>
            </nav>
            <div class="panel" v-for="(item, name) of works" :id="name">
                <h3 class="panel-title" :title="item.title">{{item.title}}</h3>
                <ul class="works-list">
                    <li v-if="item.items" v-for="(item1, index) of item.items" :key="index">
                        <img class="preview" :src="item1.thumb">
                        <div v-html="item1.desc"></div>
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
export default {
    name: 'works2d',
	components: {headerBar},
    data(){
    	let _this, works
        _this = this
        works = sessionStorage.getItem('worksData')
        if(!works){
    		works = {}
			utils.ajax({
				url: store.dataApi + '?name=works'
			}).then(res => {
				for(let k in res){
					if(res.hasOwnProperty(k)){
						_this.$set(_this.works, k, res[k])
                    }
                }
				sessionStorage.setItem('worksData', JSON.stringify(res))
			}, err => {
				console.log(err)
			})
        }else{
    		works = JSON.parse(works)
        }
    	return {
    		works,
            active: 'app'
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
    .panel-title:hover:after{
        transform: scaleY(1);
    }
</style>