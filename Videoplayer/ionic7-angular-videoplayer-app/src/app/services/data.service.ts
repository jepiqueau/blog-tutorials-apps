import { Injectable } from '@angular/core';

export interface Video {
  device: string;
  type: string;
  title: string;
  url: string;
  thumb?: string;
  note: string;
  subtitle?: string,
  stlang?: string,
}


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private videos: Video[] = [
    {
      type: "mp4",
      device: "all",
      url: "https://brenopolanski.github.io/html5-video-webvtt-example/MIB2.mp4",
      note: "Breno Polanski",
      title: "Test MP4 with Subtitle",
      subtitle: "https://brenopolanski.github.io/html5-video-webvtt-example/MIB2-subtitles-pt-BR.vtt",
      stlang: "es"
    },
    {
      type: "mp4",
      device: "all",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      note: "By Blender Foundation",
      thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
      title: "Big Buck Bunny"
    },
    {
      type: "mp4",
      device: "all",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      note: "By Blender Foundation",
      thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
      title: "Elephant Dream"
    },
    {
      type: "mp4",
      device: "all",
      url: "https://media.bernat.ch/videos/2019-self-hosted-videos-subtitles/progressive.mp4",
      note: "Blender Animation Studio",
      thumb: "https://d2pzklc15kok91.cloudfront.net/images/posters/2019-self-hosted-videos-subtitles.3b55d44c736235.jpg",
      title: "327",
      subtitle: "https://media.bernat.ch/videos/2019-self-hosted-videos-subtitles.en.vtt",
      stlang: "en"
    },
    {
      type: "aws",
      device: "all",
      url: "https://universo-dev-a-m.s3.amazonaws.com/779970/fe774806dbe7ad042c24ce522b7b46594f16c66e",
      note: "Custom",
      title: "AWS video test",
    },
    {
      type: "hls",
      device: "all",
      url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      note: "By Blender Foundation",
      title: "Big Buck Bunny",
    },
    {
      type: "mpd",
      device: "android",
      url: "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
      note: "",
      title: "MPD video test",
    },
    {
      type: "webm",
      device: "android",
      url: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Sintel_movie_4K.webm",
      note: "Blender Foundation",
      thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Sintel_movie_4K.webm/800px--Sintel_movie_4K.webm.jpg?20150505130125",
      title: "Webm video test",
    }
  ];

  constructor() { }

  public getVideos(platform: string): Video[] {
    if (platform === 'web') {
      // Filter videos for Web platform (device: 'all')
      return this.videos.filter((video) => video.device === 'all');
    } else if (platform === 'android') {
      // Filter videos for Android platform (device: 'all' or 'android')
      return this.videos.filter((video) => video.device === 'all' || video.device === 'android');
    } else if (platform === 'ios') {
      // Filter videos for iOS platform (device: 'all' or 'ios')
      return this.videos.filter((video) => video.device === 'all' || video.device === 'ios');
    } else {
      return [];
    }
  }
  public getVideo(index:number): Video | null {
    if(index <= this.videos.length) {
      return this.videos[index];
    } else {
      return null;
    }
  }

}
