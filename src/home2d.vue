<template>
    <div class="home2d">
        <video class="bg-video" src="/media/v02.mp4" poster="/img/works/v02_thumb.jpg" autoplay loop playsinline webkit-playsinline></video>
        <div class="overlay flex-center">
            <div class="overlay-header"></div>
            <img class="home2d-face" src="/img/id-photo.png" alt="证件照" draggable="false">
            <div class="info fs20">
                晋曲 &nbsp; Rudy <br>
                <p class="fs14">
                    程序员 &nbsp; PROGRAMMER<br>
                </p>
                <p class="fs10">
                    而立之年，青春和梦想真正的开始
                </p>
            </div>
            <nav class="navbar fs12">
                <a class="nav-item" v-for="(item, key) of nav" :href=" key === 'index' ? '/' : '/'+key+'2d.html'" :key="key">{{item}}</a>
            </nav>
        </div>
    </div>
</template>

<script>
import store from '../utils/store.js'
export default {
    name: 'home2d',
    data(){
        return {
        	nav: store.nav
        }
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
        background-color: rgba(255, 255, 255, .5);
        flex-wrap: wrap;
    }
    .overlay-header{
        width: 100%;
        padding-top: 10%;
    }
    .home2d-face{
        max-width: 180px;
        min-width: 80px;
        width: 60%;
        border-radius: 50%;
        margin-right: 5%;
    }
    .info{
        color: #fff;
        text-shadow: 0 0 .2em #333;
    }
    .navbar{
        width: 100%;
        text-align: center;
        padding-top: 5%;
    }
    .nav-item,
    .nav-item:visited,
    .nav-item:link{
        background-color: rgba(255,255,255,.8);
        padding: .5em 1em;
        border-radius: .2em;
        margin: 0 1em;
        color: #3487d5;
    }
    .nav-item:hover{
        background-color: rgba(137, 185, 245, .8);
        text-decoration: none;
        color: #fff;
    }
</style>