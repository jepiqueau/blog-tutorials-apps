<template>
    <div id="viewervideo-page">
        <header>
            <PageHeader :title="pageTitle"></PageHeader>
        </header>
        <div id="viewervideo-container">
            <van-grid :border="false" :column-num="1">
                <van-grid-item class="viewervideo-publish">
                    <p class="viewervideo-publish-date">
                    {{ prettyPublishedAt }}
                    </p>
                    <h2 class="viewervideo-publish-title">{{ videoContent.title }}</h2>
                </van-grid-item>
                <van-grid-item>
                    <span class="viewervideo-publish-description">{{ videoContent.description }}</span>
                </van-grid-item>
                <van-grid-item>
                    <van-button type="primary" block @click="playVideo()">
                        Watch
                    </van-button>
                </van-grid-item>
            </van-grid>
            <div v-if="isClicked">
                <FullscreenVideoPlayer @onPlay="handleOnPlay" @onPause="handleOnPause" @onEnded="handleOnEnded" @onExit="handleOnExit" @onReady="handleOnReady" :videoData="videoContent"></FullscreenVideoPlayer>
            </div>

        </div> 
    </div> 
</template>
<script lang="ts">
    import VideoService from '@/services/video.service';
    import type { VideoModel } from '~/interfaces/interfaces';
    export default defineNuxtComponent({
    name: "ViewerVideoPage",
    alias: "/viewervideo",
    setup() {
        // get the props id
        const route = useRoute();
        // build-up the page  title
        const videoRef = ref(route.params.id);
        const videoText = computed(() => {
            if(Number(videoRef.value) == 0) {
                return "MP4 Video"
            }
            if(Number(videoRef.value) == 1) {
                return "HLS Video"
            }
        });
        const pageTitle = `${videoText.value}`
        const videoService = new VideoService();
        const [isClicked, setIsClicked] = useMyState(false);
        const playerLeave = async () => {
            console.log (`>>> in [id].vue playerLeave`)
            setIsClicked(false);
        }
        const handleOnPlay = (e:any) => {
            console.log(`<<<< onPlay in ViewerVideo ${e.fromPlayerId} ct: ${e.currentTime}`);
        }
        const handleOnPause = (e:any) => {
            console.log(`<<<< onPause in ViewerVideo ${e.fromPlayerId} ct: ${e.currentTime}`)
        }
        const handleOnEnded = (e:any) => {
            console.log(`<<<< onEnded in ViewerVideo ${e.fromPlayerId} ct: ${e.currentTime}`)
            playerLeave();
        }
        const handleOnExit = (e:any) => {
            console.log(`<<<< onExit in ViewerVideo ${e.dismiss}`)
            playerLeave();
        }
        const handleOnReady = (e:any) => {
            console.log(`<<<< onReady in ViewerVideo ${e.fromPlayerId} ct: ${e.currentTime}`)
        }
        
        const videoContent = ref({} as VideoModel);

        const getVideoContent = async () => {
            const response = await videoService.get(videoRef);
            if ("content" in response) {
                videoContent.value = response.content;
            } else {
                console.log("Failed to load content");
                throw new Error("Failed to load content")
            }    
        }
        onMounted(async () => {
            await getVideoContent();
        });

        return {pageTitle, isClicked, setIsClicked, videoContent, handleOnPlay,
                handleOnPause, handleOnEnded, handleOnExit, handleOnReady};
    },
    computed: {
        prettyPublishedAt() {
        const strDate: string = this.videoContent.published_at;
        const d = new Date(strDate);
        return d.toLocaleString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        
        },
    },
    methods: {
        async playVideo() {
            this.setIsClicked(true);
        },
    }
    });
</script>
<style scoped>
    #viewervideo-page {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    position: absolute; 
    z-index: 1;  
    }
    #viewervideo-container {
    position: absolute;
    top: 96px;
    left: 0;
    right: 0;
    bottom: 0;
    }
    .viewervideo-publish {
    display:flex;
    flex-direction: row;
    }
    .viewervideo-publish-date {
    margin-top:3px;
    margin-bottom:3px;
    }
    .viewervideo-publish-title {
    margin-top:3px;
    margin-bottom:3px;
    }
    .viewervideo-publish-description {
    margin-top:3px;
    margin-bottom:3px;
    }

</style> 
