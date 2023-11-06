<template>
    <div id="home-page">
        <div id="home-header">
            <h2>Home Page</h2>
        </div>
        <div id="home-container">
            <nav>
            <van-grid :border="false" :column-num="1">
                <van-grid-item>
                    <NuxtLink to="/about" class="n-link-base">
                        About
                    </NuxtLink>
                </van-grid-item>
                <van-grid-item>
                    <NuxtLink to="/viewervideo/0" class="n-link-base">
                        MP4 Video
                    </NuxtLink>
                </van-grid-item>
                <van-grid-item>
                    <NuxtLink to="/viewervideo/1" class="n-link-base">
                        HLS Video
                    </NuxtLink>
                </van-grid-item>
            </van-grid>
            </nav>
        </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    layout:"home",
    alias:["/home", "/"]
})
</script>
<style scoped>
#home-page {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    position: absolute; 
    z-index: 1;  
}
#home-header {
    position:absolute;
    width: 100%;
    top: 40px;
    text-align:center; 
}
#home-container {
    position: absolute;
    top: 96px;
    left: 0;
    right: 0;
    bottom: 0;
}

</style>
