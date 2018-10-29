<template>
    <div class="about2d">
        <header-bar active="about" mode="2d"/>
        <article class="panel">
            <h2 class="panel-title fs14">基本信息</h2>
            <div class="panel-main flex-center">
                <img class="panel-face" src="/img/id-photo.png" alt="证件照" draggable="false">
                <ul class="info-list fs10">
                    <li><b>姓名：</b>卢进</li>
                    <li><b>出生：</b>1988年</li>
                    <li><b>籍贯：</b>贵州省</li>
                    <li><b>专业：</b>园林</li>
                    <li><b>学历：</b>本科</li>
                    <li><b>学位：</b>学士</li>
                    <li><b>毕业院校：</b>嘉应大学</li>
                    <li><b>毕业时间：</b>2012年</li>
                    <li><b>目前职业：</b>前端开发</li>
                    <li><b>QQ：</b>670752970</li>
                </ul>
            </div>
        </article>
        <article class="panel">
            <h2 class="panel-title fs14">个人技能</h2>
            <div class="panel-main">
                <div class="fs10" v-for="(skill, skey) of skills" :key="skey">
                    <h3 class="fs12">{{skill.title}}</h3>
                    <ol v-if="typeof skill.content === 'object'">
                        <li v-for="(skillItem, k1) of skill.content" :key="k1">{{skillItem}}</li>
                    </ol>
                    <div v-else v-html="skill.content"></div>
                </div>
            </div>
        </article>
        <article class="panel">
            <h2 class="panel-title fs14">工作经历</h2>
            <div class="panel-main">
                <div class="fs10" v-for="(item, skey) of career" :key="skey">
                    <h3 class="career-title fs12">
                        <b class="title">{{item.date}}</b>
                        <b>{{item.job}}</b>
                        <img class="company-logo" :src="item.logo" :alt="item.company + 'LOGO'">
                        <b>{{item.company}}</b>
                    </h3>
                    <ol v-if="typeof item.harvest === 'object'">
                        <li v-for="(citem, k1) of item.harvest" :key="k1">{{citem}}</li>
                    </ol>
                    <div v-else v-html="item.harvest"></div>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
import store from '../utils/store.js'
import utils from '../utils/utils.js'
import headerBar from './components/headerBar'
export default {
    name: 'about2d',
    components: {headerBar},
    data() {
    	let _this, data, skills, career
        _this = this
        skills = []
    	career = []
        data = sessionStorage.getItem('aboutData')
        if(!data){
			utils.ajax({
				url: store.dataApi + '?name=about'
			}).then(res => {
				res.skills.forEach(item => {
					skills.push(item)
                })
				res.career.forEach(item => {
					career.push(item)
                })
				sessionStorage.setItem('aboutData', JSON.stringify(res))
			}, err => {
				console.error(err)
			})
        }else{
    		data = JSON.parse(data)
			data.skills.forEach(item => {
				skills.push(item)
			})
			data.career.forEach(item => {
				career.push(item)
			})
        }
    	return {
			skills,
            career
        }
    }
}
</script>

<style>
    .header{
        background-color: #fff;
    }
    .about2d{
        background-color: #eee;
        height: 100%;
        overflow: auto;
    }
    .panel{
        width: 96%;
        margin: 1em auto;
        overflow: hidden;
    }
    .panel-title{
        margin: 0;
        background-color: #eee;
        border-radius: .4em .4em 0 0;
        padding: .2em .5em;
        color: #555;
    }
    .panel-main{
        border: 1px solid #eee;
        border-radius: 0 0 .4em .4em;
        flex-wrap: wrap;
        padding: .5em;
        overflow: hidden;
        line-height: 1.6;
        background-color: #fff;
    }
    .panel-face{
        width: 120px;
    }
    .info-list li{
        float: left;
        width: 20%;
    }
    .career-title b{
        padding-right: 1em;
        vertical-align: middle;
    }
    .company-logo{
        height: 1.2em;
        vertical-align: middle;
    }
    .panel-main li{
        margin: .4em 0;
    }
    @media (max-width: 1200px) {
        .info-list li{
            width: 25%;
        }
    }
    @media (max-width: 1000px) {
        .info-list li{
            width: 33%;
        }
    }
    @media (max-width: 640px) {
        .panel-face{
            display: block;
            width: 30%;
            float: none;
            margin: 0 auto 1em;
        }
        .info-list{
            margin: 0;
        }
        .info-list li{
            width: 50%;
        }
    }
</style>