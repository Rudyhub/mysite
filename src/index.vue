<template>
    <div class="index">
        <div class="index-bg"></div>
        <div class="index-box flex-column">
            <img class="index-logo" src="/img/logo.png" alt="">
            <div class="index-btns">
                <a class="index-btn" href="/home2d.html">普通来宾</a>
                <a class="index-btn" href="/home.html">程序员</a>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		name: 'index'
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
</style>