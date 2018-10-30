<template>
    <div class="index">
        <div class="index-bg"></div>
        <div class="index-box flex-column">
            <img class="index-logo" src="/img/logo.png" alt="">
            <h1 class="index-name">Rudy</h1>
            <div class="index-btns">
                <a class="index-btn" href="/home2d.html">普通来宾</a>
                <a class="index-btn" href="/home.html">程序员</a>
            </div>
        </div>
        <div class="ICP">
            <a class="ICP-a" href="http://www.miitbeian.gov.cn/" target="_blank">
                粤ICP备 18116298-{{ICP}}号
            </a>
            <a class="ICP-a" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030402002546" target="_blank">
                <img class="ICP-img" src="/img/beian.png"/>
                <span class="ICP-span">粤公网安备 44030402002546号</span>
            </a>
        </div>
    </div>
</template>

<script>
	export default {
		name: 'index',
        data(){
			return {
				ICP: /isrudy\.com/.test(window.location.href) ? 2 : 1
            }
        }
	}
</script>

<style>
    .index{
        height: 100%;
        overflow: hidden;
    }
    .index-bg,
    .index-box{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .index-bg{
        background: url("/img/index-bg.jpg") no-repeat center;
        background-size: 100% auto;
        z-index: 1;
        filter: blur(2px);
    }
    .index-box{
        background-color: rgba(0,0,0,.2);
        z-index: 2;
    }
    .index-logo{
        background-color: rgba(255,255,255,.4);
        border-radius: 50%;
        display: block;
    }
    .index-name{
        margin: .4em 0 0;
        color: #fff;
    }
    .index-btns{
        margin: 1em 0;
    }
    a.index-btn{
        padding: .5em;
        width: 6em;
        text-align: center;
        margin: .5em;
        display: inline-block;
        vertical-align: middle;
        background-color: #fff;
        border-radius: .2em;
        color: #9b6f6f;
        transition: background-color .3s;
    }
    a.index-btn:hover{
        background-color: #cd8334;
        color: #fff;
    }
    .ICP{
        width: 100%;
        position: fixed;
        bottom: 1em;
        text-align: center;
        white-space: nowrap;
        font-size: 13px;
        z-index: 9;
    }
    a.ICP-a{
        display: inline-block;
        vertical-align: middle;
        color: #fff;
        padding: 0 1em;
    }
    .ICP-img, .ICP-span{
        display: inline-block;
        vertical-align: middle;
    }
    @media (max-width: 768px) {
        .ICP{
            font-size: .2rem;
        }
        .ICP-img{
            width: .33rem;
        }
    }
</style>