<template>
    <div id="fullscreen">
    </div>
    </template>
<script lang="ts">
    export default defineNuxtComponent({
        name: 'FullscreenVideoPlayer',
        props: ['videoData'],
        emits: ['onPlay','onPause','onEnded', 'onExit','onReady'],
        setup(props, { emit }) {
        let ret: any = {};
        let params: any[] = [];
        const vpHook: VideoPlayerHook = useVideoPlayer(emit);
        const playVideo = async () => {
            params = [];

            if( props.videoData.subtitle_url != null && 
                props.videoData.subtitle_langage != null) {
            params = [...params,props.videoData.subtitle_url,props.videoData.subtitle_langage];
            }
            if(props.videoData.subtitle_options != null) {
            params = [...params,props.videoData.subtitle_options];
            }
            const args: any[] = [...params];
            ret = await vpHook.initPlayer("fullscreen",props.videoData.url,"fullscreen","div",...params);
            console.log(`ret : ${JSON.stringify(ret)}`)

        } 
        onMounted(async () => {
            await playVideo();
        });
        onUnmounted(async () => {
            await vpHook.removeListeners();
            await vpHook.stopAllPlayers();
        });
        }
    });
</script>
