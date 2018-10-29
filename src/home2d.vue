<template>
    <div class="home2d">
        <video class="bg-video" src="/media/v02.mp4" poster="/img/works/v02_thumb.jpg" autoplay loop playsinline webkit-playsinline></video>
        <div class="overlay flex-center">
            <img class="home2d-face" src="/img/id-photo.png" alt="证件照" draggable="false">
            <div class="info fs16">
                <p>卢晋曲 &nbsp; Rudy </p>
                <p>程序员 &nbsp; PROGRAMMER</p>
                <p class="fs10">
                    而立之年，青春和梦想真正的开始
                </p>
            </div>
            <nav class="navbar fs12">
                <a class="nav-item" v-for="(item, key) of nav" :href="key === 'index' ? '/' : '/'+key+'2d.html'" :key="key">{{item}}</a>
            </nav>
        </div>
    </div>
</template>

<script>
import store from '../utils/store.js'
export default {
    name: 'home2d',
    data(){
    	let nav = {}
    	for(let k in store.nav){
    		if(k === 'home') continue
    		nav[k] = store.nav[k]
        }
        return { nav }
    }
}
</script>

<style>
    .home2d{
        height: 100%;
        overflow: hidden;
    }
    .bg-video{
        width: 100%;
        height: 100%;
        background: #000;
    }
    .overlay{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        flex-wrap: wrap;
    }
    .home2d-face{
        max-width: 150px;
        min-width: 80px;
        width: 60%;
        border-radius: 50%;
        margin-right: 1em;
    }
    .info{
        color: #fff;
    }
    .info p{
        margin: 0 0 .5em 0;
    }
    .navbar{
        width: 100%;
        text-align: center;
        padding-top: 1.5em;
        overflow: hidden;
        position: relative;
    }
    .nav-item,
    .nav-item:visited,
    .nav-item:link{
        background-color: #fff;
        padding: .4em 1.5em;
        border-radius: .2em;
        margin: 0 1em;
        text-decoration: none;
        color: #9b6f6f;
        transition: background-color .3s;
        display: inline-block;
    }
    .nav-item:hover{
        background-color: #cd8334;
        color: #fff;
    }
</style>