import videoList from '@/assets/json/videolist.json';
import type { VideoModel } from '@/interfaces/interfaces';
import type { Ref } from 'vue';

export default class VideoService {
    videoList: VideoModel[] = videoList.videoList;
    public async get(contentId: Ref<string | string[]>): Promise<any>{
        const index = Number(contentId.value);
        if(index <= this.videoList.length) {
            return Promise.resolve({content: this.videoList[index]});        
        } else {
            return Promise.resolve({});
        }
    }
}